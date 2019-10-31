%lex

%%

\s+                 /* skip whitespace */
\d+                 return 'NUMBER'
[a-z][a-zA-Z0-9_]*  return 'ID'

/lex
%%

Program:
  | Assign
  ;

Assign:
  | ID '=' NUMBER { $$ = { type: 'ASSIGN', left: $1, right: $3}}
  ;