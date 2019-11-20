import { FunctionNode, FnCall } from "../../src/ast/function"
import { createArguments } from "../../src/ast/system"
import { StringNode } from "./valuenodes"
import { ASTEnvironment } from "../../src/ast/environment"

function createFunctionNode(args: { [key: string]: string }) {
  return new FunctionNode({
    type: "function",
    children: [
      {
        type: "typedParamList",
        children: createArguments(args),
        location: {}
      }
    ],
    location: {}
  })
}

function createFunctionCallNode() {
  return new FnCall({
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
}

describe("Create function node", () => {
  it("creates empty function", () => {
    const fn = createFunctionNode({})
    expect(fn.args.length).toBe(0)
    expect(fn.children.length).toBe(0)
    const env = { errors: [], symbols: {} }
    fn.check(env, [])
    expect(env.errors).toHaveLength(0)
    expect(env.symbols).toStrictEqual({})
  })
  it("creates function with a arg", () => {
    const fn = createFunctionNode({ p1: "string" })
    expect(fn.args.length).toBe(1)
    expect(fn.children.length).toBe(0)
  })
  it("checks function with misplaced args", () => {
    const fn = createFunctionNode({ p1: "string" })
    const env: ASTEnvironment = { errors: [], symbols: {} }
    fn.check(env, [])
    expect(env.errors).toHaveLength(1)
    expect(env.errors[0].error).toBe("tooFewArguments")
    expect(env.symbols).toStrictEqual({})
  })
})

describe("Create function call node", () => {
  it("creates function call without params", () => {
    const fnCall = createFunctionCallNode()
    expect(fnCall.params.length).toBe(0)
    expect(fnCall.id).toBe("test")

    const fn = createFunctionNode({})

    const env = { errors: [], symbols: { test_void: fn } }

    fnCall.check(env)
    expect(env.errors.length).toBe(0)
    expect(env.symbols).toStrictEqual({ test_void: fn })
  })
})
