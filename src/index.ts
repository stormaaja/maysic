import { parseFile } from "./parser"
import { ASTEnvironment, ASTProgram, createNode } from "./ast/ast"
import { addSystemFunctions } from "./ast/system"
import { RawProgram } from "../lib/Parser/program"

function convertToAST(program: RawProgram): ASTProgram {
  const ast = createNode(program.ast)
  const checkEnv: ASTEnvironment = { symbols: {}, errors: [] }
  addSystemFunctions(checkEnv)
  ast.check(checkEnv)
  return {
    ast, checkEnv
  }
}

function main(args: string[]) {
  if (args.length < 3) {
    console.log("Usage: parser path/to/file.msic")
  } else {
    try {
      const rawProgram = parseFile(args[2])
      if (args.indexOf("--debug") > -1 || args.indexOf("--print-raw") > -1) {
        console.debug(JSON.stringify(rawProgram, null, 1))
      }
      const program = convertToAST(rawProgram)
      if (args.indexOf("--debug") > -1 || args.indexOf("--print-ast") > -1) {
        console.debug(program)
      }
      if (program.checkEnv.errors.length > 0) {
        console.error(JSON.stringify(program.checkEnv.errors, null, 1))
      } else {
        if (args.indexOf("--eval") > -1) {
          const env: ASTEnvironment = {
            symbols: {}, errors: []
          }
          addSystemFunctions(env)
          program.ast.eval(
            env
          )
        }
      }
    } catch (e) {
      console.error(e.msg)
      console.debug(e.stack)
    }
  }
}

main(process.argv)
