export function wrap<TArgs = void, TReturn = void>(
  wrapper: (runInner: (args: TArgs) => TReturn) => TReturn,
  inner: (args: TArgs) => TReturn
) {
  return wrapper(inner);
}
