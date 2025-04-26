import * as LunarData from "./lunar-data";
import * as SolarData from "./solar-data";
import { toInt } from "./utils";

const SOLAR_LUNAR_DAY_DIFF = 20;
const JULIAN_DAY_DIFF = 2411389;

export interface LunarDate {
  year: number;
  month: number;
  day: number;
  isLeapMonth: boolean;
  secha: string;
  wolgeon: string;
  iljin: string;
  julianDay: number;
  dayOfWeek: number;
}

export interface SolarDate {
  year: number;
  month: number;
  day: number;
}

/**
 * 양력을 음력으로 변환합니다.
 * 양력 지원 날짜 범위: 1890년 1월 21일 ~ 2050년 1월 22일
 * @param solYear 양력 연도
 * @param solMonth 양력 월
 * @param solDay 양력 일
 * @returns 음력 날짜
 */
export const toLunar = (solYear: number, solMonth: number, solDay: number): LunarDate => {
  solYear = toInt(solYear);
  solMonth = toInt(solMonth);
  solDay = toInt(solDay);

  if (!SolarData.isDateInRange(solYear, solMonth, solDay)) {
    throw new RangeError(`지원되지 않는 날짜입니다. 입력한 날짜: ${solYear}-${solMonth}-${solDay}`);
  }

  let year = LunarData.BASE_YEAR;
  let month = LunarData.BASE_MONTH;
  let day = LunarData.BASE_DAY + SolarData.getTotalDays(solYear, solMonth, solDay) - SOLAR_LUNAR_DAY_DIFF - 1;

  let julianDay = JULIAN_DAY_DIFF + day - 1;
  let dayOfWeek = (day + 1) % 7;

  let yearDays = LunarData.getYearDays(year);

  while (day > yearDays) {
    year++;
    day -= yearDays;
    yearDays = LunarData.getYearDays(year);
  }

  let isLeapMonth = false;
  let leapMonth = LunarData.getLeapMonth(year);
  let monthDays = LunarData.getMonthDays(year, month);

  while (day > monthDays) {
    day -= monthDays;
    isLeapMonth = false;

    if (month === leapMonth) {
      leapMonth = 0;
      monthDays = LunarData.getLeapMonthDays(year, month);
      isLeapMonth = true;
      continue;
    }

    month++;

    if (month > 12) {
      month = 1;
      year++;
      leapMonth = LunarData.getLeapMonth(year);
    }

    monthDays = LunarData.getMonthDays(year, month);
  }

  return {
    year,
    month,
    day,
    isLeapMonth,
    secha: LunarData.getSecha(year),
    wolgeon: isLeapMonth ? "" : LunarData.getWolgeon(year, month),
    iljin: LunarData.getIljinByJulianDay(julianDay),
    julianDay,
    dayOfWeek,
  };
};

/**
 * 음력을 양력으로 변환합니다.
 * 음력 지원 날짜 범위: 1890년 1월 1일 ~ 2049년 12월 29일
 * @param lunYear 음력 연도
 * @param lunMonth 음력 월
 * @param lunDay 음력 일
 * @param isLeapMonth 음력 윤달 여부, 윤달이면 true
 * @returns 양력 날짜
 */
export const toSolar = (lunYear: number, lunMonth: number, lunDay: number, isLeapMonth: boolean): SolarDate => {
  lunYear = toInt(lunYear);
  lunMonth = toInt(lunMonth);
  lunDay = toInt(lunDay);

  if (!LunarData.isDateInRange(lunYear, lunMonth, lunDay)) {
    throw new RangeError(`지원되지 않는 날짜입니다. 입력한 날짜: ${lunYear}-${lunMonth}-${lunDay}`);
  }

  let year = SolarData.BASE_YEAR;
  let month = SolarData.BASE_MONTH;
  let day = SolarData.BASE_DAY + LunarData.getTotalDays(lunYear, lunMonth, lunDay, isLeapMonth) - 1;

  let yearDays = SolarData.getYearDays(year);

  while (day > yearDays) {
    day -= yearDays;
    year++;
    yearDays = SolarData.getYearDays(year);
  }

  let monthDays = SolarData.getMonthDays(year, month);

  while (day > monthDays) {
    day -= monthDays;
    month++;

    if (month > 12) {
      month = 1;
      year++;
    }

    monthDays = SolarData.getMonthDays(year, month);
  }

  return { year, month, day };
};

export * as LunarData from "./lunar-data";
export * as SolarData from "./solar-data";
