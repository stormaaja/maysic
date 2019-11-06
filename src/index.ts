import { parseFile } from './parser'
import { convertToAST } from './ast/ast'

function main(args: string[]) {
  if (args.length < 3) {
    console.log('Usage: parser path/to/file.msic')
  } else {
    try {
      const rawProgram = parseFile(args[2])
      console.debug(JSON.stringify(rawProgram, null, 1))
      const program = convertToAST(rawProgram)
      console.debug(program)
    } catch (e) {
      console.error(e.msg)
      console.debug(e.stack)
    }
  }
}

main(process.argv)
