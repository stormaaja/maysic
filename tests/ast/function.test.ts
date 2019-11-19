import { FunctionNode } from "../../src/ast/function"
import { createArguments } from "../../src/ast/system"

describe("Create function node", () => {
  it("creates empty function", () => {
    const fn = new FunctionNode({
      type: "function",
      children: [
        {
          type: "typedParamList",
          children: createArguments({ p1: "string" }),
          location: {}
        }
      ],
      location: {}
    })
    expect(fn.args.length).toBe(1)
    expect(fn.children.length).toBe(0)
  })
})
