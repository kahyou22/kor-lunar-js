const MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const LEAP_FEBRUARY_DAY = 29;

const YEAR_DAY = 365;
const LEAP_YEAR_DAY = 366;

const BASE_YEAR = 1890;
const BASE_MONTH = 1;
const BASE_DAY = 21;

const MAX_YEAR = 2050;
const MAX_MONTH = 1;
const MAX_DAY = 22;

const totalDaysBeforeYear: Record<number, number> = {};

const isLeapYear = (year: number): boolean => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

const getMonthDays = (year: number, month: number): number => {
  let day = month == 2 && isLeapYear(year) ? LEAP_FEBRUARY_DAY : MONTH_DAYS[month - 1];
  return day;
};

const getYearDays = (year: number): number => {
  let day = isLeapYear(year) ? LEAP_YEAR_DAY : YEAR_DAY;
  return day;
};

/**
 * 연도별 누적 일 수를 초기에 룩업 테이블로 생성하여
 * O(1)으로 누적 일 수를 가져오게 변환함
 */
totalDaysBeforeYear[BASE_YEAR] = 0;
for (let y = BASE_YEAR + 1; y < MAX_YEAR; y++) {
  totalDaysBeforeYear[y] = totalDaysBeforeYear[y - 1] + getYearDays(y - 1);
}

const getTotalDaysBeforeYear = (year: number): number => {
  let day = totalDaysBeforeYear[year];
  return day;
};

const getTotalDaysBeforeMonth = (year: number, month: number): number => {
  let day = 0;
  for (let m = 1; m < month; m++) {
    day += getMonthDays(year, m);
  }
  return day;
};

const getTotalDays = (year: number, month: number, day: number): number => {
  let days = getTotalDaysBeforeYear(year) + getTotalDaysBeforeMonth(year, month) + day;
  return days;
};

export const SolarData = {
  BASE_YEAR,
  BASE_MONTH,
  BASE_DAY,
  MAX_YEAR,
  MAX_MONTH,
  MAX_DAY,
  isLeapYear,
  getMonthDays,
  getYearDays,
  getTotalDays,
};
