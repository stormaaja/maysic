import { FunctionNode, FnCall } from "../../src/ast/function"
import { createArguments } from "../../src/ast/system"
import { StringNode } from "./valuenodes"

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

describe("Create function call node", () => {
  it("creates function call without params", () => {
    const fnCall = new FnCall({
      type: "fnCall",
      children: [
        new StringNode("test"),
        {
          type: "paramList",
          children: [],
          location: {}
        }
      ],
      location: {}
    })
    expect(fnCall.params.length).toBe(0)
    expect(fnCall.id).toBe("test")
  })
})
