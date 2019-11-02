%lex

%%

\s+                 /* skip whitespace */
[1-9][0-9]*         return 'INTEGER'
[a-z][a-zA-Z0-9_]*  return 'ID'

/lex

%{

function getLocation(start, end) {
  // Same as default result location.
  return {
    start: {
      startOffset: start.startOffset,
      endOffset: start.endOffset,
      startLine: start.startLine,
      endLine: start.endLine,
      startColumn: start.startColumn,
      endColumn: start.endColumn
    },
    end: {
      startOffset: end.startOffset,
      endOffset: end.endOffset,
      startLine: end.startLine,
      endLine: end.endLine,
      startColumn: end.startColumn,
      endColumn: end.endColumn
    }
  };
}

function createNode(type, left, right, startLocation, endLocation) {
  return {
    type: 'ASSIGN',
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
  | ID '=' INTEGER { $$ = createNode('ASSIGN', $1, $3, @1, @3) }
  ;