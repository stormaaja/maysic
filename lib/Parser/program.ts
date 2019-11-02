export interface RawASTNode {
  left: RawASTNode;
  right: RawASTNode;
  type: string;
}

export interface RawProgram {
  ast: RawASTNode;
}
