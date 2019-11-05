%lex

%%

\s+                 /* skip whitespace */
[1-9][0-9]*         return 'INTEGER'
\"[^"]+\"           return 'STRING'
[a-z][a-zA-Z0-9_]*  return 'ID'

/lex

%{

function getLocation(start, end) {
  // Same as default result location.
  return {
    start: start
      ? {
          startOffset: start.startOffset,
          endOffset: start.endOffset,
          startLine: start.startLine,
          endLine: start.endLine,
          startColumn: start.startColumn,
          endColumn: start.endColumn
        }
      : null,
    end: end
      ? {
        startOffset: end.startOffset,
        endOffset: end.endOffset,
        startLine: end.startLine,
        endLine: end.endLine,
        startColumn: end.startColumn,
        endColumn: end.endColumn
      }
      : null
  };
}

function createNode(type, left, right, startLocation, endLocation) {
  return {
    type: type,
    left: left,
    right: right,
    location: getLocation(startLocation, endLocation)
  }
}

%}

%%

Begin:
  | Program { $$ = { ast: $1 } }
  ;

Program:
  | Assign
  ;

Assign:
  | ID '=' Expr { $$ = createNode('ASSIGN', $1, $3, @1, @3) }
  ;

Expr:
  | Const
  ;

Const:
  | INTEGER { $$ = createNode('INTEGER', $1, null, @1, null) }
  | STRING { $$ = createNode('STRING', $1, null, @1, null) }
  ;