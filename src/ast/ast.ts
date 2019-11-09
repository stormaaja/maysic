import { RawProgram, RawASTNode, ASTLocation } from '../../lib/Parser/program'

interface LineError {
  location: {start: ASTLocation, end: ASTLocation}
  error: string
}

interface Environment {
  errors: LineError[];
  constants: {[key: string]: ASTNode}
}

interface ASTEnvironment {
  errors: LineError[];
  symbols: {[key: string]: ASTNode};
}

class ASTNode {
  children: ASTNode[] = [];
  type: string;
  valueType: string = 'void'
  location: { start: ASTLocation, end: ASTLocation }

  constructor(node: RawASTNode) {
    this.type = node.type
    this.location = node.location
  }

  eval(env: Environment) {}
  check(env: ASTEnvironment) { return true }
}

interface ASTProgram {
  ast?: ASTNode;
  checkEnv: ASTEnvironment;
}

class ConstInteger extends ASTNode {
  value: number
  constructor(node: RawASTNode) {
    super(node)
    this.value = parseInt(node.children[0].toString())
  }

  eval(env: Environment) {

  }

  check(env: ASTEnvironment) {
    return true
  }
}

class ConstString extends ASTNode {
  value: string
  valueType: string = 'string'
  constructor(node: RawASTNode) {
    super(node)
    this.value = node.children[0].toString()
  }

  eval(env: Environment) {

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

  eval(env: Environment) {

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
  }

  eval(env: Environment) {
    env.constants[this.id] = this.value
  }

  check(env: ASTEnvironment) {
    // Check value type
    this.children.forEach(n => n.check(env))
    return true
  }
}

class FnCall extends ASTNode {
  id: string
  params: ASTNode[]

  constructor(node: RawASTNode) {
    super(node)
    this.id = node.children[0].toString()
    this.params = node.children[1].children.map(createNode)
  }

  eval(env: Environment) {

  }

  check(env: ASTEnvironment) {
    if (!env.symbols[this.id]) {
      env.errors.push({
        location: this.location,
        error: 'symbolNotFound'
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

  eval(env: Environment) {

  }

  check(env: ASTEnvironment) {
    env.symbols[this.id] = this
    return true
  }
}

class FunctionNode extends ASTNode {
  returnType: string
  params: ASTNode[]

  constructor(node: RawASTNode) {
    super(node)
    this.params = node.children[0].children.map(createNode)
    this.children = node.children.slice(1).map(createNode)
    const lastChild = this.children[this.children.length - 1]
    this.returnType = lastChild ? lastChild.valueType : 'void'
  }

  eval(env: Environment) {
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
    default:
      console.debug(JSON.stringify(node, null, 1))
      throw new Error(`Unknown type: ${node.type}`)
  }
}

export function convertToAST(program: RawProgram): ASTProgram {
  const ast = createNode(program.ast)
  const checkEnv = { symbols: {}, errors: [] }
  ast.check(checkEnv)
  return {
    ast, checkEnv
  }
}
