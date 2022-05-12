/**
 * CommandType type.
 */
export type CommandType = 'NONE' | 'A_COMMAND' | 'C_COMMAND' | 'L_COMMAND'

/**
 * Parse interface.
 */
export interface Parse {
  /**
   * 入力にまだコマンドが存在するか?
   */
  hasMoreCommands(): boolean

  /**
   * 入力から次のコマンドを読み、それを 現在のコマンドにする。
   */
  advance(): void

  /**
   * 現コマンドの種類を返す。
   * - `A_COMMAND` は `@Xxx` を意味し、`Xxx` はシンボルか `10` 進数の数値である
   * - `C_COMMAND` は `dest=comp;jump` を意味する
   * - `L_COMMAND` は擬似コマンドであり、 `(Xxx)` を意味する。`Xxx` はシンボルである
   */
  commandType(): CommandType

  /**
   * 現コマンドのシンボル名を返す。
   */
  symbol(): string | null

  /**
   * 現C命令の `dest` ニーモニックを返す。
   */
  dest(): string | null

  /**
   * 現C命令の `comp` ニーモニックを返す。
   */
  comp(): string

  /**
   * 現C命令の `jump` ニーモニックを返す。
   */
  jump(): string | null
}
