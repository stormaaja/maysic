import { FunctionNode, TypedParamNode } from "./function"
import { ASTNode } from "./astnode"
import { ASTEnvironment } from "./environment"
import { ValueNode } from "./valuenode"

class SystemFunctionNode extends FunctionNode {
  handler: (env: ASTEnvironment, args: ASTNode[]) => ValueNode | null
  constructor(handler: (env: ASTEnvironment,
    args: ASTNode[]) => ValueNode | null, args: TypedParamNode[]) {
    super({
      type: "function",
      children: [
        { children: args, location: {}, type: "typedParamList" }
      ],
      location: {}
    })
    this.handler = handler
  }

  eval(env: ASTEnvironment, args: ASTNode[]): ValueNode | null {
    return this.handler(env, args)
  }
}

export function createArguments(symbols: {[key: string]: string}) {
  return Object.keys(symbols).map(
    k => {
      const param = new TypedParamNode(
        {
          type: "typedParam",
          children: [],
          location: {}
        }
      )
      param.setNode(symbols[k], k)
      return param
    }
  )
}

export function addSystemFunctions(env: ASTEnvironment) {
  env.symbols.print_string =
    new SystemFunctionNode(
      (env: ASTEnvironment, args: ASTNode[]) => {
        const p1 = args[0]
        console.log(p1.eval(env)!.getValue())
        return null
      }, createArguments({
        p1: "string"
      }))
  env.symbols.print_integer =
    new SystemFunctionNode(
      (env: ASTEnvironment, args: ASTNode[]) => {
        const p1 = args[0]
        console.log(p1.eval(env)!.getValue())
        return null
      }, createArguments({
        p1: "integer"
      }))
}
