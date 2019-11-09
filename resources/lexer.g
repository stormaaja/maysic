%lex

%%

\s+                 /* skip whitespace */
'string'            return 'STRINGTYPE'
'integer'           return 'INTEGERTYPE'
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

function createNode(type, children, startLocation, endLocation) {
  return {
    type: type,
    children: children,
    location: getLocation(startLocation, endLocation)
  }
}

%}

%%

Begin
  : Program { $$ = { ast: $1 } }
  ;

Program
  : Blocks { $$ = createNode('block', $1, @1) }
  ;

Blocks
  : /* empty */ { $$ = [] }
  | Blocks Block { $$ = $1.concat($2) }
  ;

Block
  : Assign
  | FnCall
  ;

Assign
  : ID '=' Expr { $$ = createNode('assign', [$1, $3], @1, @3) }
  ;

Expr
  : Const
  | ID { $$ = createNode('symbol', [$1], @1)}
  | Function
  ;

Function
  : '(' TypedParamList ')' ':' '{' Blocks '}' {
      $$ = createNode(
        'function', [createNode('typedParamList', $2, @2)].concat($6), @1, @7)
    }
  ;

TypedParamList
  : /* Empty */ { $$ = [] }
  | TypedParam { $$ = [$1] }
  | TypedParamList ',' TypedParam { $$ = $1.concat($3) }
  ;

TypedParam
  : SymbolType ID { $$ = createNode('typedParam', [$1, $2], @1, @2) }
  ;

SymbolType
  : STRINGTYPE
  | INTEGERTYPE
  ;

Const
  : INTEGER { $$ = createNode('constInteger', [$1], @1) }
  | STRING { $$ = createNode('constString', [$1], @1) }
  ;

FnCall
  : ID '(' ParamList ')' {
      $$ = createNode(
        'fnCall', [$1, createNode('paramList', $3, @1, @3)], @1, @3)
    }
  ;

ParamList
  : /* Empty */ { $$ = [] }
  | Param { $$ = [$1]}
  | ParamList ',' Param { $$ = $1.concat($3) }
  ;

Param
  : Expr
  | FnCall
  ;