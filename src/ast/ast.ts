import { RawProgram, RawASTNode, ASTLocation } from '../../lib/Parser/program'

interface LineError {
  location: {start?: ASTLocation, end?: ASTLocation};
  error: string;
  node: ASTNode;
  meta?: { [key: string]: string };
}

export interface ASTEnvironment {
  errors: LineError[];
  symbols: {[key: string]: ASTNode};
}

class ASTNode {
  children: ASTNode[] = [];
  type: string;
  valueType: string = 'void'
  location: { start?: ASTLocation, end?: ASTLocation }

  constructor(node: RawASTNode) {
    this.type = node.type
    this.location = node.location
  }

  getAstSymbolId(): string { return '' }

  eval(env: ASTEnvironment): ValueNode | null {
    return null
  }

  check(env: ASTEnvironment) { return true }
}

interface ASTProgram {
  ast: ASTNode;
  checkEnv: ASTEnvironment;
}

interface ValueNode {
  getValue(): string
}

class ConstInteger extends ASTNode implements ValueNode {
  value: number
  constructor(node: RawASTNode) {
    super(node)
    this.value = parseInt(node.children[0].toString())
    this.valueType = 'integer'
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
  valueType: string = 'string'
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
    if (this.value.type === 'function') {
      env.symbols[`${this.id}_${this.value.getAstSymbolId()}`] = this.value
    } else {
      env.symbols[this.id] = this.value
    }
    return null
  }

  check(env: ASTEnvironment) {
    this.value.check(env)
    const symbolId = this.value.type === 'function' ? `${this.id}_${this.value.getAstSymbolId()}` : this.id
    if (env.symbols[symbolId]) {
      env.errors.push({
        location: this.location,
        error: 'symbolAlreadyExists', // TODO: add support for function overload
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
    const paramsStr = this.params.map(p => p.valueType).join('_')
    this.id = `${node.children[0].toString()}_${paramsStr}`
  }

  eval(env: ASTEnvironment) {
    const symbols = env.symbols
    this.params.forEach((p, i) => { env.symbols[`ms_param_${i}`] = p })
    env.symbols[this.id].eval(env)
    env.symbols = symbols
    return null
  }

  check(env: ASTEnvironment) {
    if (!env.symbols[this.id]) {
      env.errors.push({
        location: this.location,
        error: 'symbolNotFound',
        node: this
      })
    }
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
    return null
  }

  check(env: ASTEnvironment) {
    return true
  }
}

class FunctionNode extends ASTNode {
  returnType: string
  args: ASTNode[]

  constructor(node: RawASTNode) {
    super(node)
    this.args = node.children[0].children.map(createNode)
    this.children = node.children.slice(1).map(createNode)
    const lastChild = this.children[this.children.length - 1]
    this.returnType = lastChild ? lastChild.valueType : 'void'
  }

  eval(env: ASTEnvironment): ValueNode | null{
    return null
  }

  check(env: ASTEnvironment) {
    return true
  }
}

class TypedParamNode extends ASTNode {
  symbol: string = ''

  constructor(node: RawASTNode) {
    super(node)
    if (node.children.length > 0) {
      this.setNode(node.children[0].toString(), node.children[1].toString())
    }
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

function createNode(node: RawASTNode): ASTNode {
  switch (node.type) {
    case 'block':
      return new Block(node)
    case 'constString':
      return new ConstString(node)
    case 'constInteger':
      return new ConstInteger(node)
    case 'assign':
      return new Assignment(node)
    case 'fnCall':
      return new FnCall(node)
    case 'symbol':
      return new SymbolNode(node)
    case 'function':
      return new FunctionNode(node)
    case 'typedParam':
      return new TypedParamNode(node)
    default:
      console.debug(JSON.stringify(node, null, 1))
      throw new Error(`Unknown type: ${node.type}`)
  }
}

class SystemFunctionNode extends FunctionNode {
  handler: (env: ASTEnvironment) => ValueNode | null
  constructor(handler: (env: ASTEnvironment) => ValueNode | null, args: TypedParamNode[]) {
    super({
      type: 'function',
      children: [
        { children: args, location: {}, type: 'typedParamList' }
      ],
      location: {}
    })
    this.handler = handler
  }

  eval(env: ASTEnvironment): ValueNode | null {
    return this.handler(env)
  }
}

function createArguments(symbols: {[key: string]: string}) {
  return Object.keys(symbols).map(
    k => {
      const param = new TypedParamNode(
        {
          type: 'typedParam',
          children: [],
          location: {}
        }
      )
      param.setNode(symbols[k], k)
      return param
    }
  )
}

export function addSystemFunctions(env: ASTEnvironment) {
  env.symbols.print_string =
    new SystemFunctionNode(
      (env: ASTEnvironment) => {
        const p1 = env.symbols.ms_param_0
        console.log(p1.eval(env)!.getValue())
        return null
      }, createArguments({
        p1: 'string'
      }))
}

export function convertToAST(program: RawProgram): ASTProgram {
  const ast = createNode(program.ast)
  const checkEnv: ASTEnvironment = { symbols: {}, errors: [] }
  addSystemFunctions(checkEnv)
  ast.check(checkEnv)
  return {
    ast, checkEnv
  }
}
