import { RawASTNode } from "../../lib/Parser/program"

export class IntegerNode implements RawASTNode {
  children: RawASTNode[] = []
  type: string = ""
  location = {}
  value: number
  constructor(value: number) {
    this.value = value
  }

  toString() { return this.value.toString() }
}

export class StringNode implements RawASTNode {
  children: RawASTNode[] = []
  type: string = ""
  location = {}
  value: string
  constructor(value: string) {
    this.value = value
  }

  toString() { return this.value }
}
