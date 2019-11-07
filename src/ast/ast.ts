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

interface ASTNode {
  children: ASTNode[];
  eval: (env: Environment) => void;
  check: (env: ASTEnvironment) => boolean;
}

class TypedNode {
  type: string;
  children: ASTNode[] = []
  location: { start: ASTLocation, end: ASTLocation }
  constructor(node: RawASTNode) {
    this.type = node.type
    this.location = node.location
  }
}

interface ASTProgram {
  ast?: ASTNode;
  checkEnv: ASTEnvironment;
}

class ConstInteger extends TypedNode implements ASTNode {
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

class ConstString extends TypedNode implements ASTNode {
  value: string
  constructor(node: RawASTNode) {
    super(node)
    this.type = 'constString'
    this.value = node.children[0].toString()
  }

  eval(env: Environment) {

  }

  check(env: ASTEnvironment) {
    return true
  }
}

class Block extends TypedNode implements ASTNode {
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

class Assignment extends TypedNode implements ASTNode {
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

class FnCall extends TypedNode implements ASTNode {
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

class SymbolNode extends TypedNode implements ASTNode {
  id: string
  errors: LineError[] = []

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
