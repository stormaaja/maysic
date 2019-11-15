export interface ASTLocation {
  startOffset: number;
  endOffset: number;
  startLine: number;
  endLine: number;
  startColumn: number;
  endColumn: number;
}

export interface RawASTNode {
  children: RawASTNode[];
  type: string;
  location: { start?: ASTLocation; end?: ASTLocation };
}

export interface RawProgram {
  ast: RawASTNode;
}
