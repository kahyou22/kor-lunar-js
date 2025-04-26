export const toInt = (num: string | number): number => {
  if (typeof num === "string" || typeof num === "number") return ~~num;
  return num;
};
