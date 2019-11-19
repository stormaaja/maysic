import { Assignment } from "../../src/ast/assignment"
import { StringNode, IntegerNode } from "./valuenodes"

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
