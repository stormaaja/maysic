import { parseFile } from './parser'
import { convertToAST } from './ast/ast'

function main(args: string[]) {
  if (args.length < 3) {
    console.log('Usage: parser path/to/file.msic')
  } else {
    try {
      const rawProgram = parseFile(args[2])
      if (args.indexOf('--debug') > -1 || args.indexOf('--print-raw') > -1) {
        console.debug(JSON.stringify(rawProgram, null, 1))
      }
      const program = convertToAST(rawProgram)
      if (args.indexOf('--debug') > -1 || args.indexOf('--print-ast') > -1) {
        console.debug(program)
      }
      if (program.checkEnv.errors.length > 0) {
        console.error(JSON.stringify(program.checkEnv.errors, null, 1))
      }
    } catch (e) {
      console.error(e.msg)
      console.debug(e.stack)
    }
  }
}

main(process.argv)
