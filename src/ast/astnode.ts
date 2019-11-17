import { RawASTNode, ASTLocation } from "../../lib/Parser/program"
import { ASTEnvironment } from "./environment"
import { ValueNode } from "./valuenode"

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
