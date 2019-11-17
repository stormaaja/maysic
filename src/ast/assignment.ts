import { ASTNode, createNode } from "./"
import { RawASTNode } from "../../lib/Parser/program"
import { ASTEnvironment } from "./environment"

export class Assignment extends ASTNode {
  id: string
  value: ASTNode

  constructor(node: RawASTNode) {
    super(node)
    this.children = []
    this.id = node.children[0].toString()
    this.value = createNode(node.children[1])
    this.valueType = this.value.valueType
  }

  eval(env: ASTEnvironment) {
    if (this.value.type === "function") {
      env.symbols[`${this.id}_${this.value.getAstSymbolId()}`] = this.value
    } else {
      env.symbols[this.id] = this.value
    }
    return null
  }

  check(env: ASTEnvironment) {
    const symbolId = this.value.type === "function"
      ? `${this.id}_${this.value.getAstSymbolId()}` : this.id
    if (env.symbols[symbolId]) {
      env.errors.push({
        location: this.location,
        error: "symbolAlreadyExists", // TODO: add support for function overload
        node: this,
        meta: { symbolId }
      })
    } else {
      env.symbols[symbolId] = this.value
    }
    return true
  }
}

export class SymbolNode extends ASTNode {
  id: string

  constructor(node: RawASTNode) {
    super(node)
    this.id = node.children[0].toString()
  }

  eval(env: ASTEnvironment) {
    this.valueType = env.symbols[this.id].valueType
    return env.symbols[this.id].eval(env)
  }

  check(env: ASTEnvironment) {
    this.valueType = env.symbols[this.id].valueType
    return true
  }
}
