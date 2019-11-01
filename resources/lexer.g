%lex

%%

\s+                 /* skip whitespace */
[1-9][0-9]*         return 'INTEGER'
[a-z][a-zA-Z0-9_]*  return 'ID'

/lex
%%

Begin:
  | Program { $$ = { ast: $1 } }
  ;

Program:
  | Assign
  ;

Assign:
  | ID '=' INTEGER { $$ = { type: 'ASSIGN', left: $1, right: $3} }
  ;