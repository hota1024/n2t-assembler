import * as fs from 'fs/promises'
import { assemble } from '.'

const main = async (argv: string[]) => {
  if (argv.length !== 4) {
    console.log('Usage: n2t-assembler <input file> <output file>')
    return
  }

  const inputPath = argv[2]
  const outputPath = argv[3]

  const time = Date.now()
  const input = await fs.readFile(inputPath, 'utf8')

  const binary = assemble(input)

  await fs.writeFile(outputPath, binary)
  const elapsed = Date.now() - time

  console.log(`${inputPath} -> ${outputPath}`)
  console.log(`${elapsed}ms`)
}

main(process.argv)
