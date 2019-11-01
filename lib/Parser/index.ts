import { RawProgram } from './program'

interface Parser {
  parse: (s: string) => RawProgram
}
export const Parser: Parser = require('./yyparse.js')
