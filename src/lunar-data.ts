/**
 * 음력 테이블
 *
 * 9b  (17-25): 해당 해의 총 음력 일 수 (예: 384)
 *
 * 1b  (   16): 윤달의 크기 (0: 29일, 1: 30일)
 *
 * 4b  (12-15): 윤달 위치 (1-12, 윤달이 없으면 0)
 *
 * 12b ( 0-11): 각 월의 크기 (0: 29일, 1: 30일)
 */
const LUN_TABLE = [
  /*       0          1          2          3          4          5          6          7          8          9       */
  /*1890*/ 0x3002ab6, 0x2c60daa, 0x3006ee4, 0x2c40ea4, 0x2c40d4a, 0x2fe5555, 0x2c60a97, 0x2c40556, 0x300355d, 0x2c60ad5,
  /*1900*/ 0x3008bd2, 0x2c40752, 0x2c60ea5, 0x2fe5b2a, 0x2c4064b, 0x2c60a9b, 0x3014aa6, 0x2c4056a, 0x2c60b59, 0x3002baa,
  /*1910*/ 0x2c40752, 0x3006da5, 0x2c40b25, 0x2c40a4b, 0x300595b, 0x2c60aad, 0x2c4056a, 0x30025b5, 0x2c60ba9, 0x3007dd2,
  /*1920*/ 0x2c40d92, 0x2c40d25, 0x3005d2d, 0x2c40956, 0x2c402b5, 0x3024add, 0x2c406d4, 0x2c60da9, 0x3002eca, 0x2c40e92,
  /*1930*/ 0x2fe66a6, 0x2c40527, 0x2c60a57, 0x3015956, 0x2c60ada, 0x2c406d4, 0x3013751, 0x2c40749, 0x3017b13, 0x2c40a93,
  /*1940*/ 0x2c4052b, 0x301651b, 0x2c6096d, 0x2c60b6a, 0x3014da4, 0x2c40ba4, 0x2c40b49, 0x3002d4b, 0x2c40a95, 0x3007aab,
  /*1950*/ 0x2c4052d, 0x2c60aad, 0x3015aaa, 0x2c60db2, 0x2c40da4, 0x3013ea1, 0x2c40d4a, 0x3008d95, 0x2c40a96, 0x2c40556,
  /*1960*/ 0x3006575, 0x2c60ad5, 0x2c406d2, 0x3004755, 0x2c60ea5, 0x2c40e4a, 0x2fe364e, 0x2c60a9b, 0x3007ad6, 0x2c4056a,
  /*1970*/ 0x2c60b59, 0x3005bb2, 0x2c40752, 0x2c40725, 0x3004b2b, 0x2c40a4b, 0x30089ab, 0x2c402ad, 0x2c6056b, 0x30165a9,
  /*1980*/ 0x2c60da9, 0x2c40d92, 0x3004d95, 0x2c40d25, 0x300ae4d, 0x2c40a56, 0x2c402b6, 0x3026aed, 0x2c406d4, 0x2c60da9,
  /*1990*/ 0x3005ed2, 0x2c40e92, 0x2c40d26, 0x2fe352e, 0x2c60a57, 0x30089b6, 0x2c60b5a, 0x2c406d4, 0x3005769, 0x2c40749,
  /*2000*/ 0x2c40693, 0x3004a97, 0x2c4052b, 0x2c60a5b, 0x3002aae, 0x2c4036a, 0x3027dd5, 0x2c40ba4, 0x2c40b49, 0x3005d53,
  /*2010*/ 0x2c40a95, 0x2c4052d, 0x301352d, 0x2c60aad, 0x3009baa, 0x2c405d2, 0x2c60da5, 0x3005eaa, 0x2c40d4a, 0x2c40a95,
  /*2020*/ 0x3004a9d, 0x2c40556, 0x2c60ab5, 0x3002ad6, 0x2c406d2, 0x3006765, 0x2c60ea5, 0x2c40e4a, 0x2fe5656, 0x2c60c9b,
  /*2030*/ 0x2c4055a, 0x300356d, 0x2c60b69, 0x300bf52, 0x2c40752, 0x2c40b25, 0x3016b0b, 0x2c40a4b, 0x2c404ab, 0x30052bb,
  /*2040*/ 0x2c6056d, 0x2c60b69, 0x3002daa, 0x2c40d92, 0x3007ea5, 0x2c40d25, 0x2c40a4d, 0x3015a4d, 0x2c402b6, 0x2c605b5,
];

const BASE_YEAR = 1890;
const BASE_MONTH = 1;
const BASE_DAY = 1;

const MAX_YEAR = 2049;
const MAX_MONTH = 12;
const MAX_DAY = 29;

const SMALL_MONTH_DAY = 29;
const BIG_MONTH_DAY = 30;

const getYearData = (year: number): number => {
  return LUN_TABLE[year - BASE_YEAR];
};

const getMonthDays = (year: number, month: number): number => {
  const monthType = (getYearData(year) >> (month - 1)) & 0x1;
  return monthType === 0 ? SMALL_MONTH_DAY : BIG_MONTH_DAY;
};

const getLeapMonth = (year: number): number => {
  return (getYearData(year) >> 12) & 0xf;
};

const hasLeapMonth = (year: number): boolean => {
  return getLeapMonth(year) !== 0;
};

const isLeapMonth = (year: number, month: number): boolean => {
  return month === getLeapMonth(year);
};

const getLeapMonthDays = (year: number, month: number): number => {
  if (!isLeapMonth(year, month)) return 0;
  const monthType = (getYearData(year) >> 16) & 0x1;
  return monthType === 0 ? SMALL_MONTH_DAY : BIG_MONTH_DAY;
};

const getYearDays = (year: number): number => {
  return (getYearData(year) >> 17) & 0x1ff;
};

const getTotalDaysBeforeYear = (year: number): number => {
  let days = 0;
  for (let y = BASE_YEAR; y < year; y++) {
    days += getYearDays(y);
  }
  return days;
};

const getTotalDaysBeforeMonth = (year: number, month: number, isLeapMonth: boolean): number => {
  let days = 0;
  // 해당 월 전까지 윤달을 포함하여 누적
  for (let m = 1; m < month; m++) {
    days += getMonthDays(year, m);
    if (m === getLeapMonth(year)) {
      days += getLeapMonthDays(year, m);
    }
  }
  // 대상이 윤달이면, 앞에 있는 평달을 누적
  let leapMonth = getLeapMonth(year);
  if (isLeapMonth && leapMonth === month) {
    days += getMonthDays(year, month);
  }
  return days;
};

const getTotalDays = (year: number, month: number, day: number, isLeapMonth: boolean): number => {
  let days = getTotalDaysBeforeYear(year) + getTotalDaysBeforeMonth(year, month, isLeapMonth) + day;
  return days;
};

export const LunarData = {
  BASE_YEAR,
  BASE_MONTH,
  BASE_DAY,
  MAX_YEAR,
  MAX_MONTH,
  MAX_DAY,
  getMonthDays,
  getLeapMonth,
  hasLeapMonth,
  isLeapMonth,
  getLeapMonthDays,
  getYearDays,
  getTotalDaysBeforeYear,
  getTotalDaysBeforeMonth,
  getTotalDays,
};
