export function codeBlock(content: string): string {
  return "```" + content + "```";
}

export function code(content: string): string {
  return "`" + content + "`";
}

export function bold(content: string): string {
  return "**" + content + "**";
}

export function italic(content: string): string {
  return "*" + content + "*";
}
