import { RawASTNode, ASTLocation } from "../../lib/Parser/program"

interface LineError {
  location: {start?: ASTLocation; end?: ASTLocation};
  error: string;
  node: ASTNode;
  meta?: { [key: string]: string };
}

function createError(node: ASTNode, error: string): LineError {
  return {
    location: node.location,
    error: error,
    node: node
  }
}

interface Environment {
  symbols: {[key: string]: ASTNode};
}

export interface ASTEnvironment extends Environment {
  errors: LineError[];
}

export class ASTNode {
  children: ASTNode[] = [];
  type: string;
  valueType: string = "void"
  location: { start?: ASTLocation; end?: ASTLocation }

  constructor(node: RawASTNode) {
    this.type = node.type
    this.location = node.location
  }

  getAstSymbolId(): string { return "" }

  eval(env: ASTEnvironment, args: ASTNode[] = []): ValueNode | null {
    return null
  }

  check(env: ASTEnvironment, args: ASTNode[] = []) { return true }
}

export interface ASTProgram {
  ast: ASTNode;
  checkEnv: ASTEnvironment;
}

export interface ValueNode {
  getValue(): string;
}

class ConstInteger extends ASTNode implements ValueNode {
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

class ConstString extends ASTNode implements ValueNode {
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

class Block extends ASTNode {
  children: ASTNode[]

  constructor(node: RawASTNode) {
    super(node)
    this.children = node.children.map(createNode)
  }

  eval(env: ASTEnvironment) {
    const results = this.children.map(n => n.eval(env))
    return results[results.length - 1]
  }

  check(env: ASTEnvironment) {
    this.children.forEach(n => n.check(env))
    return true
  }
}

class Assignment extends ASTNode {
  id: string
  value: ASTNode

  constructor(node: RawASTNode) {
    super(node)
    this.children = []
    this.id = node.children[0].toString()
    this.value = createNode(node.children[1])
    this.valueType = this.value.valueType
  }

  eval(env: ASTEnvironment) {
    if (this.value.type === "function") {
      env.symbols[`${this.id}_${this.value.getAstSymbolId()}`] = this.value
    } else {
      env.symbols[this.id] = this.value
    }
    return null
  }

  check(env: ASTEnvironment) {
    const symbolId = this.value.type === "function" ? `${this.id}_${this.value.getAstSymbolId()}` : this.id
    if (env.symbols[symbolId]) {
      env.errors.push({
        location: this.location,
        error: "symbolAlreadyExists", // TODO: add support for function overload
        node: this,
        meta: { symbolId }
      })
    } else {
      env.symbols[symbolId] = this.value
    }
    return true
  }
}

class FnCall extends ASTNode {
  id: string
  params: ASTNode[]

  constructor(node: RawASTNode) {
    super(node)
    this.params = node.children[1].children.map(createNode)
    this.id = node.children[0].toString()
  }

  getAstSymbolId() {
    const paramsStr = this.params.length > 0 ? this.params.map(p => p.valueType).join("_") : "void"
    return `${this.id}_${paramsStr}`
  }

  eval(env: ASTEnvironment) {
    this.params.forEach(p => { if (p.type === "symbol") p.eval(env) })
    const returnValue = env.symbols[this.getAstSymbolId()].eval(env, this.params)
    return returnValue
  }

  check(env: ASTEnvironment) {
    this.params.forEach(p => { if (p.type === "symbol") p.check(env) })
    env.symbols[this.getAstSymbolId()].check(env, this.params)
    return true
  }
}

class SymbolNode extends ASTNode {
  id: string

  constructor(node: RawASTNode) {
    super(node)
    this.id = node.children[0].toString()
  }

  eval(env: ASTEnvironment) {
    this.valueType = env.symbols[this.id].valueType
    return env.symbols[this.id].eval(env)
  }

  check(env: ASTEnvironment) {
    this.valueType = env.symbols[this.id].valueType
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
    return this.args.length > 0 ? this.args.map(p => p.valueType).join("_") : "void"
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

export function createNode(node: RawASTNode): ASTNode {
  switch (node.type) {
    case "block":
      return new Block(node)
    case "constString":
      return new ConstString(node)
    case "constInteger":
      return new ConstInteger(node)
    case "assign":
      return new Assignment(node)
    case "fnCall":
      return new FnCall(node)
    case "symbol":
      return new SymbolNode(node)
    case "function":
      return new FunctionNode(node)
    case "typedParam":
      return new TypedParamNode(node)
    default:
      console.debug(JSON.stringify(node, null, 1))
      throw new Error(`Unknown type: ${node.type}`)
  }
}
