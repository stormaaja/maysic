import { RawProgram, RawASTNode } from '../../lib/Parser/program'

interface LineError {
  line: number;
  column: number;
  error: string
}

interface Environment {
  errors: LineError[];
  constants: {[key: string]: Value}
}

interface TypeEnvironment {
  errors: LineError[]
}

interface ASTNode {
  left?: ASTNode;
  right?: ASTNode;
  eval: (env: Environment) => void;
  typeCheck: (typeEnv: TypeEnvironment) => boolean;
}

interface ASTProgram {
  ast?: ASTNode;
  env: Environment;
}

interface Value {
  eval: (env: Environment) => void;
  typeCheck: (typeEnv: TypeEnvironment) => boolean;
  type: string;
}

class ValueInteger implements Value {
  value: number
  type: string
  constructor(value: number) {
    this.type = 'INTEGER'
    this.value = value
  }

  eval(env: Environment) {

  }

  typeCheck(typeEnv: TypeEnvironment) {
    return true
  }
}

class ValueString implements Value {
  value: string
  type: string
  constructor(value: string) {
    this.type = 'STRING'
    this.value = value
  }

  eval(env: Environment) {

  }

  typeCheck(typeEnv: TypeEnvironment) {
    return true
  }
}

function getValue(node: RawASTNode) {
  switch (node.type) {
    case 'INTEGER':
      return new ValueInteger(parseInt(node.left.toString()))
    case 'STRING':
      return new ValueString(node.left.toString())
    default:
      throw new Error(`Unknown value type: ${node.type}`)
  }
}

class Assignment implements ASTNode {
  left?: ASTNode | undefined
  right?: ASTNode | undefined
  id: string
  type: string
  value: Value

  constructor(node: RawASTNode) {
    this.type = node.type
    this.id = node.left.toString()
    this.value = getValue(node.right) // Change to expression
  }

  eval(env: Environment) {
    env.constants[this.id] = this.value // Eval value expression
  }

  typeCheck(_: TypeEnvironment) {
    return true
  }
}

function createNode(node: RawASTNode) {
  switch (node.type) {
    case 'ASSIGN':
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
