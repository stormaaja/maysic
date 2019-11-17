import { ASTEnvironment } from "./environment"
import { ASTNode } from "./astnode"

export interface ASTProgram {
  ast: ASTNode;
  checkEnv: ASTEnvironment;
}
