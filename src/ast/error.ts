import { ASTLocation } from "../../lib/Parser/program"
import { ASTNode } from "./"

export interface LineError {
  location: {start?: ASTLocation; end?: ASTLocation};
  error: string;
  node: ASTNode;
  meta?: { [key: string]: string };
}

export function createError(node: ASTNode, error: string): LineError {
  return {
    location: node.location,
    error: error,
    node: node
  }
}
