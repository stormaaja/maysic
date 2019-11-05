export interface RawASTNode {
  children: RawASTNode[];
  type: string;
}

export interface RawProgram {
  ast: RawASTNode;
}
