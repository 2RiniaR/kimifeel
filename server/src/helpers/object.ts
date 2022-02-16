export function tryGetValue<TValue>(obj: { [key in string]: TValue }, key: string): TValue | undefined {
  if (key in obj) return obj[key];
  else return undefined;
}
