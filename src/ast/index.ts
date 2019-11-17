import { RawASTNode, ASTLocation } from "../../lib/Parser/program"
import { ASTEnvironment } from "./environment"
import { ConstString, ConstInteger, ValueNode } from "./valuenode"
import { Assignment, SymbolNode } from "./assignment"
import { FnCall, FunctionNode, TypedParamNode } from "./function"

export class ASTNode {
  children: ASTNode[] = [];
  type: string;
  valueType: string = "void"
  location: { start?: ASTLocation; end?: ASTLocation }

  constructor(node: RawASTNode) {
    this.type = node.type
    this.location = node.location
  }

  getAstSymbolId(): string { return "" }

  eval(env: ASTEnvironment, args: ASTNode[] = []): ValueNode | null {
    return null
  }

  check(env: ASTEnvironment, args: ASTNode[] = []) { return true }
}

export interface ASTProgram {
  ast: ASTNode;
  checkEnv: ASTEnvironment;
}

class Block extends ASTNode {
  children: ASTNode[]

  constructor(node: RawASTNode) {
    super(node)
    this.children = node.children.map(createNode)
  }

  eval(env: ASTEnvironment) {
    const results = this.children.map(n => n.eval(env))
    return results[results.length - 1]
  }

  check(env: ASTEnvironment) {
    this.children.forEach(n => n.check(env))
    return true
  }
}

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
