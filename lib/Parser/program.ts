export interface RawASTNode {
  left: RawASTNode | string;
  right: RawASTNode | string;
  type: string;
}

export interface RawProgram {
  ast: RawASTNode;
}
