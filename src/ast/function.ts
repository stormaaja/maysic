import { RawASTNode } from "../../lib/Parser/program"
import { ASTNode, createNode } from "."
import { createError } from "./error"
import { ASTEnvironment } from "./environment"
import { ValueNode } from "./valuenode"

export class FnCall extends ASTNode {
  id: string
  params: ASTNode[]

  constructor(node: RawASTNode) {
    super(node)
    this.params = node.children[1].children.map(createNode)
    this.id = node.children[0].toString()
  }

  getAstSymbolId() {
    const paramsStr = this.params.length > 0
      ? this.params.map(p => p.valueType).join("_") : "void"
    return `${this.id}_${paramsStr}`
  }

  eval(env: ASTEnvironment) {
    this.params.forEach(p => { if (p.type === "symbol") p.eval(env) })
    const returnValue = env.symbols[this.getAstSymbolId()].eval(
      env, this.params)
    return returnValue
  }

  check(env: ASTEnvironment) {
    this.params.forEach(p => { if (p.type === "symbol") p.check(env) })
    env.symbols[this.getAstSymbolId()].check(env, this.params)
    return true
  }
}

export class FunctionNode extends ASTNode {
  returnType: string
  args: ASTNode[]

  constructor(node: RawASTNode) {
    super(node)
    this.args = node.children[0].children.map(createNode)
    this.children = node.children.slice(1).map(createNode)
    const lastChild = this.children[this.children.length - 1]
    this.returnType = lastChild ? lastChild.valueType : "void"
  }

  getAstSymbolId() {
    return this.args.length > 0
      ? this.args.map(p => p.valueType).join("_") : "void"
  }

  eval(env: ASTEnvironment, args: ASTNode[]): ValueNode | null {
    const symbols = Object.assign({}, env.symbols)
    args.forEach((a, i) => { env.symbols[this.args[i].getAstSymbolId()] = a })
    const values = this.children.map(c => c.eval(env))
    env.symbols = symbols
    return values[values.length - 1]
  }

  check(env: ASTEnvironment, args: ASTNode[]) {
    const symbols = Object.assign({}, env.symbols)
    if (this.args.length !== args.length) {
      env.errors.push(createError(this, "tooFewArguments"))
    } else {
      args.forEach((p, i) => { env.symbols[this.args[i].getAstSymbolId()] = p })
    }
    this.children.map(c => c.check(env))
    env.symbols = symbols
    return true
  }
}

export class TypedParamNode extends ASTNode {
  symbol: string = ""

  constructor(node: RawASTNode) {
    super(node)
    if (node.children.length > 0) {
      this.setNode(node.children[0].toString(), node.children[1].toString())
    }
  }

  getAstSymbolId() {
    return this.symbol
  }

  setNode(valueType: string, symbol: string) {
    this.valueType = valueType
    this.symbol = symbol
  }

  eval(env: ASTEnvironment) {
    return null
  }

  check(env: ASTEnvironment) {
    return true
  }
}
