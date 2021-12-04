export {};

declare global {
  interface Array<T> {
    removeNone(): Array<T extends null ? never : T extends undefined ? never : T>;
    throwNone(): Array<T extends null ? never : T extends undefined ? never : T>;
    mapAsync<U>(converter: (src: T) => Promise<U>): Promise<Array<U>>;
    forEachAsync(task: (src: T) => Promise<void>): Promise<void[]>;
  }
}

Array.prototype.removeNone = function <T>(this: Array<T | undefined | null>): Array<T> {
  return this.filter((element) => element) as T[];
};

Array.prototype.throwNone = function <T>(this: Array<T | undefined | null>): Array<T> {
  if (this.filter((element) => !element).length > 0) throw TypeError("Some elements didn't has value");
  return this as T[];
};

Array.prototype.mapAsync = function <T, U>(this: Array<T>, converter: (src: T) => Promise<U>): Promise<Array<U>> {
  return Promise.all(this.map(converter));
};

Array.prototype.forEachAsync = function <T>(this: Array<T>, task: (src: T) => Promise<void>): Promise<void[]> {
  return Promise.all(this.map(task));
};
