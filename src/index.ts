import { parseFile } from './parser'

function main(args: string[]) {
  if (args.length < 3) {
    console.log('Usage: parser path/to/file.msic')
  } else {
    console.log(parseFile(args[2]))
  }
}

main(process.argv)
