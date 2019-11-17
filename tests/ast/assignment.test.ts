import { Assignment } from "../../src/ast/assignment"
import { RawASTNode } from "../../lib/Parser/program"

class IntegerNode implements RawASTNode {
  children: RawASTNode[] = []
  type: string = ""
  location = {}
  value: number
  constructor(value: number) {
    this.value = value
  }

  toString() { return this.value.toString() }
}

class StringNode implements RawASTNode {
  children: RawASTNode[] = []
  type: string = ""
  location = {}
  value: string
  constructor(value: string) {
    this.value = value
  }

  toString() { return this.value }
}

describe("Create assignment node", () => {
  it("creates simple integer assignment", () => {
    const assignment = new Assignment({
      location: {},
      children: [
        new StringNode("i"),
        {
          type: "constInteger",
          children: [new IntegerNode(2)],
          location: {}
        }],
      type: "assign"
    })
    expect(assignment.type).toBe("assign")
  })
})
