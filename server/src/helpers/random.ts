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
  if (range < count) {
    throw new RangeError("Range was smaller than count.");
  }
  const selects = Array.range(count).map((i) => getRandomInteger(0, range - i));
  return selects.reduce<number[]>((results, select, i) => {
    const over = results.filter((result) => select > result - min - i).length;
    return [...results, select + min + over];
  }, []);
}
