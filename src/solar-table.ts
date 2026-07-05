import { toInt } from "./utils";

const MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const LEAP_FEBRUARY_DAY = 29;

const YEAR_DAY = 365;
const LEAP_YEAR_DAY = 366;

export const BASE_YEAR = 1890;
export const BASE_MONTH = 1;
export const BASE_DAY = 21;
export const BASE_VALUE = BASE_YEAR * 10000 + BASE_MONTH * 100 + BASE_DAY;

export const MAX_YEAR = 2050;
export const MAX_MONTH = 12;
export const MAX_DAY = 31;
export const MAX_VALUE = MAX_YEAR * 10000 + MAX_MONTH * 100 + MAX_DAY;

const totalDaysBeforeYear: number[] = [];

/**
 * 그레고리력 윤년인지를 반환합니다.
 * @param year 양력 연도
 * @returns 윤년이면 true
 */
export const isLeapYear = (year: number): boolean => {
  year = toInt(year);
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

/**
 * 해당 양력 월의 일 수를 반환합니다.
 * @param year 양력 연도
 * @param month 양력 월 (1 ~ 12)
 * @returns 월의 일 수 (28 ~ 31)
 */
export const getMonthDays = (year: number, month: number): number => {
  month = toInt(month);
  let day = month === 2 && isLeapYear(year) ? LEAP_FEBRUARY_DAY : MONTH_DAYS[month - 1];
  return day;
};

/**
 * 해당 양력 연도의 일 수를 반환합니다.
 * @param year 양력 연도
 * @returns 연도의 일 수 (365 또는 366)
 */
export const getYearDays = (year: number): number => {
  let day = isLeapYear(year) ? LEAP_YEAR_DAY : YEAR_DAY;
  return day;
};

/**
 * 연도별 누적 일 수를 초기에 룩업 테이블로 생성하여
 * O(1)으로 누적 일 수를 가져오게 변환함
 */
totalDaysBeforeYear[0] = 0;
for (let y = BASE_YEAR + 1; y <= MAX_YEAR; y++) {
  const idx = y - BASE_YEAR;
  totalDaysBeforeYear[idx] = totalDaysBeforeYear[idx - 1] + getYearDays(y - 1);
}

/**
 * 1890년부터 해당 연도 전까지의 누적 일 수를 반환합니다.
 * @param year 양력 연도 (1890 ~ 2050)
 * @returns 해당 연도 전까지의 누적 일 수
 */
export const getTotalDaysBeforeYear = (year: number): number => {
  year = toInt(year);
  return totalDaysBeforeYear[year - BASE_YEAR];
};

/**
 * 해당 연도 1월 1일부터 해당 월 전까지의 일 수를 반환합니다.
 * @param year 양력 연도
 * @param month 양력 월 (1 ~ 12)
 * @returns 해당 월 전까지의 일 수
 */
export const getTotalDaysBeforeMonth = (year: number, month: number): number => {
  let day = 0;
  for (let m = 1; m < month; m++) {
    day += getMonthDays(year, m);
  }
  return day;
};

/**
 * 기준일(1890-01-01)부터 해당 날짜까지의 누적 일 수를 반환합니다 (1890-01-01 = 1).
 * @param year 양력 연도 (1890 ~ 2050)
 * @param month 양력 월 (1 ~ 12)
 * @param day 양력 일
 * @returns 누적 일 수
 */
export const getTotalDays = (year: number, month: number, day: number): number => {
  let days = getTotalDaysBeforeYear(year) + getTotalDaysBeforeMonth(year, month) + day;
  return days;
};

/**
 * 날짜가 지원하는 범위 내에 있는지를 반환합니다.
 * 날짜의 유효성 (존재 여부)은 검사하지 않습니다.
 * @returns 날짜가 범위 내에 있으면 true
 */
export const isDateInRange = (year: number, month: number, day: number): boolean => {
  year = toInt(year);
  month = toInt(month);
  day = toInt(day);
  const value = year * 10000 + month * 100 + day;
  return value >= BASE_VALUE && value <= MAX_VALUE;
};

/**
 * 실제로 존재하는 유효한 날짜인지를 반환합니다.
 * @returns 유효한 날짜이면 true
 */
export const isValidDate = (year: number, month: number, day: number): boolean => {
  year = toInt(year);
  month = toInt(month);
  day = toInt(day);
  if (year < BASE_YEAR || year > MAX_YEAR) return false;

  if (year === BASE_YEAR) {
    if (month < BASE_MONTH) return false;
    if (month === BASE_MONTH && day < BASE_DAY) return false;
  }

  if (year === MAX_YEAR) {
    if (month > MAX_MONTH) return false;
    if (month === MAX_MONTH && day > MAX_DAY) return false;
  }

  if (month < 1 || month > 12) return false;
  if (day < 1) return false;

  const endDay = getMonthDays(year, month);
  return day <= endDay;
};
