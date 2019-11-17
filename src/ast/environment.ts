import { ASTNode } from "./astnode"
import { LineError } from "./error"

export interface Environment {
  symbols: {[key: string]: ASTNode};
}

export interface ASTEnvironment extends Environment {
  errors: LineError[];
}
