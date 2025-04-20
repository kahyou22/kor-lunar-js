import { LunarData } from "./lunar-data";
import { SolarData } from "./solar-data";

const SOLAR_LUNAR_DAY_DIFF = 20;

interface LunarDate {
  year: number;
  month: number;
  day: number;
  isLeapMonth: boolean;
  secha: string;
  wolgeon: string;
  iljin: string;
}

interface SolarDate {
  year: number;
  month: number;
  day: number;
}

const toLunar = (solYear: number, solMonth: number, solDay: number): LunarDate => {
  if (!SolarData.isDateInRange(solYear, solMonth, solDay)) {
    throw new RangeError(`지원되지 않는 날짜입니다. 입력한 날짜: ${solYear}-${solMonth}-${solDay}`);
  }

  let year = LunarData.BASE_YEAR;
  let month = LunarData.BASE_MONTH;
  let day = LunarData.BASE_DAY + SolarData.getTotalDays(solYear, solMonth, solDay) - SOLAR_LUNAR_DAY_DIFF - 1;

  let dayIndex = day - 1;

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
    iljin: LunarData.getIljinByDayIndex(dayIndex),
  };
};

const toSolar = (lunYear: number, lunMonth: number, lunDay: number, isLeapMonth: boolean): SolarDate => {
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

export type { LunarDate, SolarDate };
export { toLunar, toSolar, LunarData, SolarData };
