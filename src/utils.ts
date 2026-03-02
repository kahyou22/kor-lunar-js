export const toInt = (num: string | number): number => {
  return ~~num;
};

export const padLeft = (str: string, length: number, char: string): string => {
  return str.length >= length ? str : new Array(length - str.length + 1).join(char) + str;
};
