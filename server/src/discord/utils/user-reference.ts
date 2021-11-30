export function getUserReference(id: string): string {
  return `<@${id}>`;
}

const removeRegex = /^<@(\d+)>$/;
export function removeUserReference(ref: string): string {
  return ref.replace(removeRegex, "$1");
}
