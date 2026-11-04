import { ts, type Node, type SourceFile } from "ts-morph";

/** One-based lines, including CR, CRLF, LF, U+2028 and U+2029. */
export function compilerLine(sourceFile: SourceFile, position: number): number {
  return ts.getLineAndCharacterOfPosition(sourceFile.compilerNode, position).line + 1;
}

export function nodeLine(node: Node): number {
  return compilerLine(node.getSourceFile(), node.getStart());
}
