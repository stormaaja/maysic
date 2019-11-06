import { RawProgram, RawASTNode } from '../../lib/Parser/program'

interface LineError {
  line: number;
  column: number;
  error: string
}

interface Environment {
  errors: LineError[];
  constants: {[key: string]: ASTNode}
}

interface TypeEnvironment {
  errors: LineError[]
}

interface ASTNode {
  children: ASTNode[];
  eval: (env: Environment) => void;
  typeCheck: (typeEnv: TypeEnvironment) => boolean;
}

class TypedNode {
  type: string;
  children: ASTNode[] = []
  constructor(node: RawASTNode) {
    this.type = node.type
  }
}

interface ASTProgram {
  ast?: ASTNode;
  env: Environment;
}

class ConstInteger extends TypedNode implements ASTNode {
  value: number
  constructor(node: RawASTNode) {
    super(node)
    this.value = parseInt(node.children[0].toString())
  }

  eval(env: Environment) {

  }

  typeCheck(typeEnv: TypeEnvironment) {
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

  typeCheck(typeEnv: TypeEnvironment) {
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

  typeCheck(_: TypeEnvironment) {
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

  typeCheck(_: TypeEnvironment) {
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
    default: throw new Error(`Unknown type: ${node.type}`)
  }
}

export function convertToAST(program: RawProgram): ASTProgram {
  return {
    ast: createNode(program.ast),
    env: { constants: {}, errors: [] }
  }
}
