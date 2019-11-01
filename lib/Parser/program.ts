export interface ASTNode {
  left: ASTNode;
  right: ASTNode;
  type: string;
}

export interface Program {
  ast: ASTNode;
}
