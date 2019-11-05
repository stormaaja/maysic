interface Location {
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
  location: { start: Location; end: Location }
}

export interface RawProgram {
  ast: RawASTNode;
}
