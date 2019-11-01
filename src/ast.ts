import { RawProgram, RawASTNode } from '../lib/Parser/program'

interface Environment {

}

interface ASTNode {
  left?: ASTNode;
  right?: ASTNode;
  eval: (env: Environment) => void;
}

interface ASTProgram {
  ast?: ASTNode;
  env: Environment;
}

interface Value {
  eval: (env: Environment) => void;
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
}

class Assignment implements ASTNode {
  left?: ASTNode | undefined
  right?: ASTNode | undefined
  id: string
  value: Value
  type: string

  constructor(node: RawASTNode) {
    this.type = node.type
    this.id = node.left.toString()
    this.value = new ValueInteger(parseInt(node.right.toString()))
  }

  eval(env: Environment) {

  }
}

function createNode(node: RawASTNode) {
  switch (node.type) {
    case 'ASSIGN': {
      return new Assignment(node)
    }
  }
}

export function convertToAST(program: RawProgram): ASTProgram {
  return {
    ast: createNode(program.ast),
    env: {}
  }
}