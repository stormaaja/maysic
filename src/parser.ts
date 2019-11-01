import { Parser } from '../lib/Parser'
const fs = require('fs')

export function parseFile(filePath: string) {
  const fileContent = fs.readFileSync(filePath, 'utf8')
  return Parser.parse(fileContent)
}
