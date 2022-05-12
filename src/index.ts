import { Code } from './code/Code'
import { Parser } from './parser/Parser'

/**
 * build symbol map(table).
 *
 * @param input assembly source code.
 */
export const buildSymbolMap = (input: string): Map<string, string> => {
  const parser = new Parser(input)
  const symbols = new Map<string, string>([
    // 定義済みシンボル
    ['SP', '0'],
    ['LCL', '1'],
    ['ARG', '2'],
    ['THIS', '3'],
    ['THAT', '4'],
    ['R0', '0'],
    ['R1', '1'],
    ['R2', '2'],
    ['R3', '3'],
    ['R4', '4'],
    ['R5', '5'],
    ['R6', '6'],
    ['R7', '7'],
    ['R8', '8'],
    ['R9', '9'],
    ['R10', '10'],
    ['R11', '11'],
    ['R12', '12'],
    ['R13', '13'],
    ['R14', '14'],
    ['R15', '15'],
    ['SCREEN', '16384'],
    ['KBD', '24576'],
  ])

  let address = 0

  while (parser.hasMoreCommands()) {
    parser.advance()

    const command = parser.commandType()
    const symbol = parser.symbol()

    if (command === 'C_COMMAND' || command === 'A_COMMAND') {
      address += 1
    } else if (command === 'L_COMMAND' && symbol) {
      // L命令はラベルのシンボルをシンボルテーブルに追加する
      symbols.set(symbol, `${address}`)
    }
  }

  return symbols
}

/**
 * compiles assembly source code to binary code.
 *
 * @param input assembly source code.
 */
export const assemble = (input: string): string => {
  const symbols = buildSymbolMap(input)

  const parser = new Parser(input)
  const binaries: string[] = []
  const compiler = new Code()
  let address = 16

  while (parser.hasMoreCommands()) {
    parser.advance()

    const command = parser.commandType()

    if (command === 'A_COMMAND') {
      //    ┌ A命令
      // ┌──┼───────────┬─────────────┬─────────────┬─────────────┐
      // │  0  v  v  v  │  v  v  v  v │  v  v  v  v │  v  v  v  v │
      // └─────┼────────┴─────────────┴─────────────┴───────────┼─┘
      //       └──────────────value(v = 0 or 1)─────────────────┘
      const symbol = parser.symbol()

      if (!symbol) {
        throw new Error('symbol is not found.')
      }

      const isNumber = symbol.match(/^\d+$/)

      if (!isNumber && !symbols.has(symbol)) {
        // 新しい変数をシンボルテーブルに追加
        symbols.set(symbol, `${address}`)
        address += 1
      }

      // 数値はそのまま、シンボルはシンボルテーブルから取得
      const v = isNumber ? parseInt(symbol) : address

      // 2進数表記に変換し、全体で16文字になるように0埋めする
      const code = v.toString(2).padStart(16, '0')

      binaries.push(code)
    } else if (command === 'C_COMMAND') {
      //    ┌ C命令
      // ┌──┼───────────┬─────────────┬─────────────┬─────────────┐
      // │  1  1  1  a  │ c1 c2 c3 c4 │ c5 c6 d1 d2 │ d3 j1 j2 j3 │
      // └───────────┼──┴─────────────┴─────┼─┼─────┴──┼─┼──────┼─┘
      //             └─────────comp─────────┘ └──dest──┘ └─jump─┘
      const dest = parser.dest()
      const comp = parser.comp()
      const jump = parser.jump()

      // ニーモニックを変換
      const destCode = compiler.dest(dest ?? 'null')
      const compCode = compiler.comp(comp)
      const jumpCode = compiler.jump(jump ?? 'null')

      // コードを生成
      const code = `111${compCode}${destCode}${jumpCode}`

      binaries.push(code)
    }
  }

  return binaries.join('\n')
}
