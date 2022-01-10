function getRange(count: number) {
  return [...Array<number>(count)].map((_, i) => i);
}

// min is inclusive, max is exclusive
export function getRandomInteger(min: number, max: number) {
  if (max - min < 0) {
    throw new RangeError("Max was smaller than min.");
  }
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

// min is inclusive, max is exclusive
export function getRandomIntegerArray(min: number, max: number, count: number): number[] {
  const range = max - min;
  if (range <= count) {
    return getRange(range).map((i) => i + min);
  }
  // const selects = getRange(count).map((i) => getRandomInteger(0, range - i));
  // return selects.reduce<number[]>((results, select, i) => {
  //   const over = results.filter((result) => select > result - min - i).length;
  //   return [...results, select + min + over];
  // }, []);
  const list = getRange(range).map((x) => x + min);
  const result = [] as number[];
  for (let i = 0; i < count; i++) {
    const random = getRandomInteger(0, list.length);
    result.push(...list.splice(random, 1));
  }
  return result;
}
