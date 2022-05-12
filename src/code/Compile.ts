/**
 * Compile interface.
 */
export interface Compile {
  /**
   * `dest` ニーモニックのバイナリコードを返す。
   *
   * @param mnemonic ニーモニック
   */
  dest(mnemonic: string): string

  /**
   * `comp` ニーモニックのバイナリコードを返す。
   *
   * @param mnemonic ニーモニック
   */
  comp(mnemonic: string): string

  /**
   * `jump` ニーモニックのバイナリコードを返す。
   *
   * @param mnemonic ニーモニック
   */
  jump(mnemonic: string): string
}
