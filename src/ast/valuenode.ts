import { ASTEnvironment } from "./environment"
import { ASTNode } from "./"
import { RawASTNode } from "../../lib/Parser/program"

export interface ValueNode {
  getValue(): string;
}

export class ConstInteger extends ASTNode implements ValueNode {
  value: number
  constructor(node: RawASTNode) {
    super(node)
    this.value = parseInt(node.children[0].toString())
    this.valueType = "integer"
  }

  getValue() {
    return this.value.toString()
  }

  eval(env: ASTEnvironment) {
    return this
  }

  check(env: ASTEnvironment) {
    return true
  }
}

export class ConstString extends ASTNode implements ValueNode {
  value: string
  valueType: string = "string"
  constructor(node: RawASTNode) {
    super(node)
    this.value = node.children[0].toString()
  }

  getValue() {
    return this.value
  }

  eval(env: ASTEnvironment) {
    return this
  }

  check(env: ASTEnvironment) {
    return true
  }
}
