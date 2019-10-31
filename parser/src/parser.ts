import { Parser } from '../lib/Parser'
const fs = require('fs')

export function parseFile(filePath: string) {
  const fileContent = fs.readFileSync(filePath, 'utf8')
  console.log(Parser.parse(fileContent))
}

function main(args: string[]) {
  if (args.length < 3) {
    console.log('Usage: parser path/to/file.msic')
  } else {
    console.log(parseFile(args[2]))
  }
}

main(process.argv)
