import { Program } from './program'

interface Parser {
  parse: (s: string) => Program
}
export const Parser: Parser = require('./yyparse.js')
