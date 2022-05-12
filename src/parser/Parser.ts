import { CommandType, Parse } from './Parse'

class Visitor {
  private readonly lines: string[] = []
  private index = 0

  constructor(input: string) {
    // 行で区切る => 空白文字を削除 => 空行を削除 => コメントを削除
    this.lines = input
      .split('\n')
      .map((line) => line.replace(/ /g, ''))
      .filter((line) => !!line)
      .filter((line) => !line.startsWith('//'))
  }

  current() {
    return this.lines[this.index]
  }

  forward() {
    this.index += 1
  }

  isEnd() {
    return this.index > this.lines.length - 1
  }
}

/**
 * Parser class.
 */
export class Parser implements Parse {
  private readonly visitor: Visitor

  private currentCommand: CommandType = 'NONE'

  private currentSymbol: string | null = null

  private currentDest: string | null = null
  private currentComp: string | null = null
  private currentJump: string | null = null

  constructor(input: string) {
    this.visitor = new Visitor(input)
  }

  hasMoreCommands(): boolean {
    return !this.visitor.isEnd()
  }

  advance(): void {
    const line = this.visitor.current()

    // 前回の行データを削除
    this.currentSymbol = null
    this.currentDest = null
    this.currentComp = null
    this.currentJump = null

    if (line.startsWith('@')) {
      // A命令 - @value
      this.currentCommand = 'A_COMMAND'

      // `@Xxx` の `Xxx` を記録
      this.currentSymbol = line.slice(1)
    } else if (line.match(/^\([A-Z]+\)$/)) {
      // L命令 - (label)
      this.currentCommand = 'L_COMMAND'
      this.currentSymbol = line.slice(1, -1)
    } else {
      // C命令 - dest=comp;jump
      const matches = line.match(
        /^(?<dest>(?:A?M?D?)=)?(?<comp>[-+|&!01AMD]+)(?<jump>;(?:JGT|JEQ|JGE|JLT|JNE|JLE|JMP))?/u
      )

      if (matches) {
        const dest = matches.groups?.dest?.slice(0, -1) // 末尾の '=' を削除
        const comp = matches.groups?.comp
        const jump = matches.groups?.jump?.slice(1) // 最初の ';' を除去

        this.currentCommand = 'C_COMMAND'
        this.currentDest = dest ?? null
        this.currentComp = comp ?? null
        this.currentJump = jump ?? null
      } else {
        // どのコマンドでもない場合はエラー
        throw new Error(`Invalid line: ${line}`)
      }
    }

    this.visitor.forward()
  }

  commandType(): CommandType {
    return this.currentCommand
  }

  symbol(): string | null {
    return this.currentSymbol
  }

  dest(): string | null {
    return this.currentDest
  }

  comp(): string {
    if (!this.currentComp) {
      throw new Error('comp is empty')
    }

    return this.currentComp
  }

  jump(): string | null {
    return this.currentJump
  }
}
