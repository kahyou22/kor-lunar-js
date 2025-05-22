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
 * 양력 지원 날짜 범위: 1890년 1월 21일 ~ 2050년 12월 31일
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

  let year = Math.min(solYear, LunarData.MAX_YEAR);
  let month = solYear > LunarData.MAX_YEAR ? LunarData.MAX_MONTH : solMonth;
  let day = 1;

  const lunTotalDays = LunarData.getTotalDays(year, month, day, true);
  const solTotalDays = SolarData.getTotalDays(solYear, solMonth, solDay);

  const diffDays = solTotalDays - SOLAR_LUNAR_DAY_DIFF - lunTotalDays;
  day += diffDays;

  let day2 = solTotalDays - SOLAR_LUNAR_DAY_DIFF;

  let julianDay = JULIAN_DAY_DIFF + day2 - 1;
  let dayOfWeek = (day2 + 1) % 7;

  let isLeapMonth = month === LunarData.getLeapMonth(year);
  let monthDays;

  while (day < 1) {
    if (isLeapMonth) {
      isLeapMonth = false;
    } else {
      month--;

      if (month === 0) {
        month = 12;
        year--;
      }

      isLeapMonth = month === LunarData.getLeapMonth(year);
    }

    monthDays = isLeapMonth ? LunarData.getLeapMonthDays(year, month) : LunarData.getMonthDays(year, month);
    day += monthDays;
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
 * 음력 지원 날짜 범위: 1890년 1월 1일 ~ 2050년 11월 18일
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

  const lunTotalDays = LunarData.getTotalDays(lunYear, lunMonth, lunDay, isLeapMonth);
  const solTotalDays = SolarData.getTotalDays(lunYear, lunMonth, lunDay);

  const diffDays = lunTotalDays - (solTotalDays - SOLAR_LUNAR_DAY_DIFF);

  let year = lunYear;
  let month = lunMonth;
  let day = lunDay + diffDays;

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
