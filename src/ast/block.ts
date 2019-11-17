import { RawASTNode } from "../../lib/Parser/program"
import { ASTEnvironment } from "./environment"
import { ASTNode } from "./astnode"
import { createNode } from "."

export class Block extends ASTNode {
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
