import { RawProgram } from "./program"

export declare class yyparse {
  // setOptions(options: any): ...;
  // getOptions(): {
  //     captureLocations: boolean;
  // };
  parse(s: string, parseOptions?: string[]): RawProgram;
  // setTokenizer(customTokenizer: any): ...;
  // getTokenizer(): any;
  // onParseBegin(string: any, tokenizer: any, options: any): void;
  // onParseEnd(parsed: any): void;
  // onShift(token: any): any;
}
