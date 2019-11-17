import { RawASTNode } from "../../lib/Parser/program"
import { ConstString, ConstInteger } from "./valuenode"
import { Assignment, SymbolNode } from "./assignment"
import { FnCall, FunctionNode, TypedParamNode } from "./function"
import { ASTNode } from "./astnode"
import { Block } from "./block"

export function createNode(node: RawASTNode): ASTNode {
  switch (node.type) {
    case "block":
      return new Block(node)
    case "constString":
      return new ConstString(node)
    case "constInteger":
      return new ConstInteger(node)
    case "assign":
      return new Assignment(node)
    case "fnCall":
      return new FnCall(node)
    case "symbol":
      return new SymbolNode(node)
    case "function":
      return new FunctionNode(node)
    case "typedParam":
      return new TypedParamNode(node)
    default:
      console.debug(JSON.stringify(node, null, 1))
      throw new Error(`Unknown type: ${node.type}`)
  }
}
