import { ASTEnvironment } from "./environment"
import { ASTNode } from "./astnode"
import { RawASTNode } from "../../lib/Parser/program"

export class ValueNode extends ASTNode {
  value: string
  valueType: string
  constructor(node: RawASTNode, valueType: string) {
    super(node)
    this.value = node.children[0].toString()
    this.valueType = valueType
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

export class ConstInteger extends ValueNode {
  constructor(node: RawASTNode) {
    super(node, "integer")
  }
}

export class ConstString extends ValueNode {
  constructor(node: RawASTNode) {
    super(node, "string")
  }
}
