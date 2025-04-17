import { LunarData } from "./lunar-data";
import { SolarData } from "./solar-data";

const SOLAR_LUNAR_DAY_DIFF = 20;

interface LunarDate {
  year: number;
  month: number;
  day: number;
  isLeapMonth: boolean;
}

const toLunar = (solYear: number, solMonth: number, solDay: number): LunarDate => {
  let year = LunarData.BASE_YEAR;
  let month = LunarData.BASE_MONTH;
  let day = LunarData.BASE_DAY + SolarData.getTotalDays(solYear, solMonth, solDay) - SOLAR_LUNAR_DAY_DIFF - 1;

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

  return { year, month, day, isLeapMonth };
};

export const korLunar = { toLunar };
