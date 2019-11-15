import { Parser } from "../lib/Parser"
const fs = require("fs")

export function parse(s: string) {
  return Parser.parse(s)
}

export function parseFile(filePath: string) {
  const fileContent = fs.readFileSync(filePath, "utf8")
  return parse(fileContent)
}
