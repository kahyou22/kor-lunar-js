import { describe, it, expect } from "vitest";
import { toLunar, toSolar, LunarTable, SolarTable } from "../src/kor-lunar";

// prettier-ignore
const fixtures = [
  // 설날 (음력 1월 1일)
  { solar: { year: 1890, month: 1, day: 21 }, lunar: { year: 1890, month: 1, day: 1, isLeapMonth: false, secha: "경인", wolgeon: "무인", iljin: "임인", julianDay: 2411389, dayOfWeek: 2 } },
  { solar: { year: 1920, month: 2, day: 20 }, lunar: { year: 1920, month: 1, day: 1, isLeapMonth: false, secha: "경신", wolgeon: "무인", iljin: "무신", julianDay: 2422375, dayOfWeek: 5 } },
  { solar: { year: 1950, month: 2, day: 17 }, lunar: { year: 1950, month: 1, day: 1, isLeapMonth: false, secha: "경인", wolgeon: "무인", iljin: "계미", julianDay: 2433330, dayOfWeek: 5 } },
  { solar: { year: 1980, month: 2, day: 16 }, lunar: { year: 1980, month: 1, day: 1, isLeapMonth: false, secha: "경신", wolgeon: "무인", iljin: "기미", julianDay: 2444286, dayOfWeek: 6 } },
  { solar: { year: 2000, month: 2, day: 5 }, lunar: { year: 2000, month: 1, day: 1, isLeapMonth: false, secha: "경진", wolgeon: "무인", iljin: "계사", julianDay: 2451580, dayOfWeek: 6 } },
  { solar: { year: 2020, month: 1, day: 25 }, lunar: { year: 2020, month: 1, day: 1, isLeapMonth: false, secha: "경자", wolgeon: "무인", iljin: "정묘", julianDay: 2458874, dayOfWeek: 6 } },
  { solar: { year: 2025, month: 1, day: 29 }, lunar: { year: 2025, month: 1, day: 1, isLeapMonth: false, secha: "을사", wolgeon: "무인", iljin: "무술", julianDay: 2460705, dayOfWeek: 3 } },
  { solar: { year: 2040, month: 2, day: 12 }, lunar: { year: 2040, month: 1, day: 1, isLeapMonth: false, secha: "경신", wolgeon: "무인", iljin: "경오", julianDay: 2466197, dayOfWeek: 0 } },
  { solar: { year: 2050, month: 1, day: 23 }, lunar: { year: 2050, month: 1, day: 1, isLeapMonth: false, secha: "경오", wolgeon: "무인", iljin: "계묘", julianDay: 2469830, dayOfWeek: 0 } },
  // 추석 (음력 8월 15일)
  { solar: { year: 1890, month: 9, day: 28 }, lunar: { year: 1890, month: 8, day: 15, isLeapMonth: false, secha: "경인", wolgeon: "을유", iljin: "임자", julianDay: 2411639, dayOfWeek: 0 } },
  { solar: { year: 1920, month: 9, day: 26 }, lunar: { year: 1920, month: 8, day: 15, isLeapMonth: false, secha: "경신", wolgeon: "을유", iljin: "정해", julianDay: 2422594, dayOfWeek: 0 } },
  { solar: { year: 1950, month: 9, day: 26 }, lunar: { year: 1950, month: 8, day: 15, isLeapMonth: false, secha: "경인", wolgeon: "을유", iljin: "갑자", julianDay: 2433551, dayOfWeek: 2 } },
  { solar: { year: 1980, month: 9, day: 23 }, lunar: { year: 1980, month: 8, day: 15, isLeapMonth: false, secha: "경신", wolgeon: "을유", iljin: "기해", julianDay: 2444506, dayOfWeek: 2 } },
  { solar: { year: 2000, month: 9, day: 12 }, lunar: { year: 2000, month: 8, day: 15, isLeapMonth: false, secha: "경진", wolgeon: "을유", iljin: "계유", julianDay: 2451800, dayOfWeek: 2 } },
  { solar: { year: 2020, month: 10, day: 1 }, lunar: { year: 2020, month: 8, day: 15, isLeapMonth: false, secha: "경자", wolgeon: "을유", iljin: "정축", julianDay: 2459124, dayOfWeek: 4 } },
  { solar: { year: 2025, month: 10, day: 6 }, lunar: { year: 2025, month: 8, day: 15, isLeapMonth: false, secha: "을사", wolgeon: "을유", iljin: "무신", julianDay: 2460955, dayOfWeek: 1 } },
  { solar: { year: 2040, month: 9, day: 21 }, lunar: { year: 2040, month: 8, day: 15, isLeapMonth: false, secha: "경신", wolgeon: "을유", iljin: "임자", julianDay: 2466419, dayOfWeek: 5 } },
  { solar: { year: 2049, month: 9, day: 11 }, lunar: { year: 2049, month: 8, day: 15, isLeapMonth: false, secha: "기사", wolgeon: "계유", iljin: "기축", julianDay: 2469696, dayOfWeek: 6 } },
  // 윤달 전 평달
  { solar: { year: 1890, month: 2, day: 19 }, lunar: { year: 1890, month: 2, day: 1, isLeapMonth: false, secha: "경인", wolgeon: "기묘", iljin: "신미", julianDay: 2411418, dayOfWeek: 3 } },
  { solar: { year: 1917, month: 2, day: 22 }, lunar: { year: 1917, month: 2, day: 1, isLeapMonth: false, secha: "정사", wolgeon: "계묘", iljin: "을미", julianDay: 2421282, dayOfWeek: 4 } },
  { solar: { year: 1944, month: 4, day: 23 }, lunar: { year: 1944, month: 4, day: 1, isLeapMonth: false, secha: "갑신", wolgeon: "기사", iljin: "정사", julianDay: 2431204, dayOfWeek: 0 } },
  { solar: { year: 1971, month: 5, day: 24 }, lunar: { year: 1971, month: 5, day: 1, isLeapMonth: false, secha: "신해", wolgeon: "갑오", iljin: "기유", julianDay: 2441096, dayOfWeek: 1 } },
  { solar: { year: 1998, month: 5, day: 26 }, lunar: { year: 1998, month: 5, day: 1, isLeapMonth: false, secha: "무인", wolgeon: "무오", iljin: "계유", julianDay: 2450960, dayOfWeek: 2 } },
  { solar: { year: 2025, month: 6, day: 25 }, lunar: { year: 2025, month: 6, day: 1, isLeapMonth: false, secha: "을사", wolgeon: "계미", iljin: "을축", julianDay: 2460852, dayOfWeek: 3 } },
  // 윤달
  { solar: { year: 1890, month: 3, day: 21 }, lunar: { year: 1890, month: 2, day: 1, isLeapMonth: true, secha: "경인", wolgeon: "", iljin: "신축", julianDay: 2411448, dayOfWeek: 5 } },
  { solar: { year: 1917, month: 3, day: 23 }, lunar: { year: 1917, month: 2, day: 1, isLeapMonth: true, secha: "정사", wolgeon: "", iljin: "갑자", julianDay: 2421311, dayOfWeek: 5 } },
  { solar: { year: 1944, month: 5, day: 22 }, lunar: { year: 1944, month: 4, day: 1, isLeapMonth: true, secha: "갑신", wolgeon: "", iljin: "병술", julianDay: 2431233, dayOfWeek: 1 } },
  { solar: { year: 1971, month: 6, day: 23 }, lunar: { year: 1971, month: 5, day: 1, isLeapMonth: true, secha: "신해", wolgeon: "", iljin: "기묘", julianDay: 2441126, dayOfWeek: 3 } },
  { solar: { year: 1998, month: 6, day: 24 }, lunar: { year: 1998, month: 5, day: 1, isLeapMonth: true, secha: "무인", wolgeon: "", iljin: "임인", julianDay: 2450989, dayOfWeek: 3 } },
  { solar: { year: 2025, month: 7, day: 25 }, lunar: { year: 2025, month: 6, day: 1, isLeapMonth: true, secha: "을사", wolgeon: "", iljin: "을미", julianDay: 2460882, dayOfWeek: 5 } },
  // 윤달 다음달
  { solar: { year: 1890, month: 4, day: 19 }, lunar: { year: 1890, month: 3, day: 1, isLeapMonth: false, secha: "경인", wolgeon: "경진", iljin: "경오", julianDay: 2411477, dayOfWeek: 6 } },
  { solar: { year: 1917, month: 4, day: 21 }, lunar: { year: 1917, month: 3, day: 1, isLeapMonth: false, secha: "정사", wolgeon: "갑진", iljin: "계사", julianDay: 2421340, dayOfWeek: 6 } },
  { solar: { year: 1944, month: 6, day: 21 }, lunar: { year: 1944, month: 5, day: 1, isLeapMonth: false, secha: "갑신", wolgeon: "경오", iljin: "병진", julianDay: 2431263, dayOfWeek: 3 } },
  { solar: { year: 1971, month: 7, day: 22 }, lunar: { year: 1971, month: 6, day: 1, isLeapMonth: false, secha: "신해", wolgeon: "을미", iljin: "무신", julianDay: 2441155, dayOfWeek: 4 } },
  { solar: { year: 1998, month: 7, day: 23 }, lunar: { year: 1998, month: 6, day: 1, isLeapMonth: false, secha: "무인", wolgeon: "기미", iljin: "신미", julianDay: 2451018, dayOfWeek: 4 } },
  { solar: { year: 2025, month: 8, day: 23 }, lunar: { year: 2025, month: 7, day: 1, isLeapMonth: false, secha: "을사", wolgeon: "갑신", iljin: "갑자", julianDay: 2460911, dayOfWeek: 6 } },
];

describe("toLunar", () => {
  it.each(fixtures)("양력 $solar -> 음력", ({ solar, lunar }) => {
    expect(toLunar(solar.year, solar.month, solar.day)).toEqual(lunar);
  });

  it("경계값: 지원 범위 시작일", () => {
    const result = toLunar(SolarTable.BASE_YEAR, SolarTable.BASE_MONTH, SolarTable.BASE_DAY);
    expect(result.year).toBe(LunarTable.BASE_YEAR);
    expect(result.month).toBe(LunarTable.BASE_MONTH);
    expect(result.day).toBe(LunarTable.BASE_DAY);
  });

  it("경계값: 지원 범위 마지막일", () => {
    expect(() => toLunar(SolarTable.MAX_YEAR, SolarTable.MAX_MONTH, SolarTable.MAX_DAY)).not.toThrow();
  });

  it("범위 밖 날짜는 RangeError", () => {
    let beforeY = SolarTable.BASE_YEAR;
    let beforeM = SolarTable.BASE_MONTH - 1;
    if (beforeM === 0) {
      beforeM = 12;
      beforeY--;
    }
    expect(() => toLunar(beforeY, beforeM, 1)).toThrow(RangeError);

    let afterY = SolarTable.MAX_YEAR;
    let afterM = SolarTable.MAX_MONTH + 1;
    if (afterM === 13) {
      afterM = 1;
      afterY++;
    }
    expect(() => toLunar(afterY, afterM, 1)).toThrow(RangeError);
  });
});

describe("toSolar", () => {
  it.each(fixtures)("음력 -> 양력 $solar", ({ solar, lunar }) => {
    expect(toSolar(lunar.year, lunar.month, lunar.day, lunar.isLeapMonth)).toEqual(solar);
  });

  it("범위 밖 날짜는 RangeError", () => {
    let beforeY = LunarTable.BASE_YEAR;
    let beforeM = LunarTable.BASE_MONTH - 1;
    if (beforeM === 0) {
      beforeM = 12;
      beforeY--;
    }
    expect(() => toSolar(beforeY, beforeM, 1, false)).toThrow(RangeError);

    let afterY = LunarTable.MAX_YEAR;
    let afterM = LunarTable.MAX_MONTH + 1;
    if (afterM === 13) {
      afterM = 1;
      afterY++;
    }
    expect(() => toSolar(afterY, afterM, 1, false)).toThrow(RangeError);
  });
});

describe("왕복 변환 테스트", () => {
  it("전체 지원 범위에서 toLunar -> toSolar", () => {
    const date = new Date(SolarTable.BASE_YEAR, SolarTable.BASE_MONTH - 1, SolarTable.BASE_DAY);
    const end = new Date(SolarTable.MAX_YEAR, SolarTable.MAX_MONTH - 1, SolarTable.MAX_DAY);

    while (date <= end) {
      const y = date.getFullYear();
      const m = date.getMonth() + 1;
      const d = date.getDate();

      const lunar = toLunar(y, m, d);
      const solar = toSolar(lunar.year, lunar.month, lunar.day, lunar.isLeapMonth);
      expect(solar, `왕복 실패: ${y}-${m}-${d}`).toEqual({ year: y, month: m, day: d });

      date.setDate(date.getDate() + 1);
    }
  });
});
