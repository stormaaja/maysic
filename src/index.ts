import { parseFile } from './parser'
import { convertToAST } from './ast/ast'

function main(args: string[]) {
  if (args.length < 3) {
    console.log('Usage: parser path/to/file.msic')
  } else {
    const rawProgram = parseFile(args[2])
    console.log(JSON.stringify(rawProgram, null, 1))
    const program = convertToAST(rawProgram)
    console.log(program)
  }
}

main(process.argv)
