import { parse } from "../src/parser"

describe("parsing assignment", () => {
  it("produces assignment tree", () => {
    const program = parse("s = 2")
    expect(program.ast.children.length).toBe(1)
    expect(program.ast.type).toBe("block")
    const assign = program.ast.children[0]
    expect(assign.type).toBe("assign")
    expect(assign.children[0]).toBe("s")
    expect(assign.children[1].type).toBe("constInteger")
    expect(assign.children[1].children[0]).toBe("2")
  })
})

describe("parsing function", () => {
  it("produces function without args", () => {
    const program = parse("f = (): {}")
    expect(program.ast.children.length).toBe(1)
    expect(program.ast.type).toBe("block")
    const assign = program.ast.children[0]
    expect(assign.type).toBe("assign")
    expect(assign.children[0]).toBe("f")
    expect(assign.children[1].type).toBe("function")
  })
  it("produces function with two params", () => {
    const program = parse("f = (integer i, string s): {}")
    const fn = program.ast.children[0].children[1]
    const args = fn.children[0].children
    expect(args.length).toBe(2)
    expect(args[0].type).toBe("typedParam")
    expect(args[0].children[0].toString()).toBe("integer")
    expect(args[0].children[1].toString()).toBe("i")
    expect(args[1].type).toBe("typedParam")
    expect(args[1].children[0].toString()).toBe("string")
    expect(args[1].children[1].toString()).toBe("s")
  })
})

describe("parsing function call", () => {
  it("produces function call tree", () => {
    const program = parse("print(\"Hello World!\")")
    const fnCall = program.ast.children[0]
    expect(fnCall.type).toBe("fnCall")
    expect(fnCall.children[0]).toBe("print")
    expect(fnCall.children[1].children.length).toBe(1)
    expect(fnCall.children[1].children[0].type).toBe("constString")
    expect(fnCall.children[1].children[0].children[0].toString()).toBe(
      "\"Hello World!\"")
  })
  it("produces function call with symbols", () => {
    const program = parse("s = \"Hello World!\" i = 2 print(s, i)")
    const params = program.ast.children[2].children[1].children
    expect(params.length).toBe(2)
    expect(params[0].type).toBe("symbol")
    expect(params[0].children[0].toString()).toBe("s")
    expect(params[1].type).toBe("symbol")
    expect(params[1].children[0].toString()).toBe("i")
  })
})
