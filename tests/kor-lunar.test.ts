import { describe, it, expect } from "vitest";
import { toLunar, toSolar, fromJulianDay, LunarTable, SolarTable } from "../src/kor-lunar";

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

// prettier-ignore
const GAN_HANJA: Record<string, string> = { 갑: "甲", 을: "乙", 병: "丙", 정: "丁", 무: "戊", 기: "己", 경: "庚", 신: "辛", 임: "壬", 계: "癸" };
// prettier-ignore
const JI_HANJA: Record<string, string> = { 자: "子", 축: "丑", 인: "寅", 묘: "卯", 진: "辰", 사: "巳", 오: "午", 미: "未", 신: "申", 유: "酉", 술: "戌", 해: "亥" };
const ganjiHanja = (ganji: string) => (ganji ? GAN_HANJA[ganji[0]] + JI_HANJA[ganji[1]] : "");
const withHanja = (lunar: (typeof fixtures)[number]["lunar"]) => ({
  ...lunar,
  sechaHanja: ganjiHanja(lunar.secha),
  wolgeonHanja: ganjiHanja(lunar.wolgeon),
  iljinHanja: ganjiHanja(lunar.iljin),
});

describe("toLunar", () => {
  it.each(fixtures)("양력 $solar -> 음력", ({ solar, lunar }) => {
    expect(toLunar(solar.year, solar.month, solar.day)).toEqual(withHanja(lunar));
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
  it("isLeapMonth 생략 시 평달로 처리", () => {
    expect(toSolar(2025, 8, 15)).toEqual(toSolar(2025, 8, 15, false));
  });

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

describe("fromJulianDay", () => {
  it.each(fixtures)("julianDay $lunar.julianDay -> 음력", ({ lunar }) => {
    expect(fromJulianDay(lunar.julianDay)).toEqual(withHanja(lunar));
  });

  it("경계값: 지원 범위 시작일 (julianDay = 2411389)", () => {
    const result = fromJulianDay(2411389);
    expect(result.year).toBe(LunarTable.BASE_YEAR);
    expect(result.month).toBe(LunarTable.BASE_MONTH);
    expect(result.day).toBe(LunarTable.BASE_DAY);
  });

  it("경계값: 지원 범위 마지막일", () => {
    const lastLunar = toLunar(SolarTable.MAX_YEAR, SolarTable.MAX_MONTH, SolarTable.MAX_DAY);
    expect(() => fromJulianDay(lastLunar.julianDay)).not.toThrow();
  });

  it("범위 밖 julianDay는 RangeError", () => {
    expect(() => fromJulianDay(2411388)).toThrow(RangeError);
    expect(() => fromJulianDay(2411389 + 100000)).toThrow(RangeError);
  });

  it("지원 범위 상수가 문서화된 값과 일치", () => {
    // fromJulianDay JSDoc에 명시된 범위: 2411389 ~ 2470172
    expect(LunarTable.BASE_JULIAN_DAY).toBe(2411389);
    expect(LunarTable.MAX_JULIAN_DAY).toBe(2470172);
    // 상한 = 음력 2050-11-18 (양력 2050-12-31)
    const last = fromJulianDay(LunarTable.MAX_JULIAN_DAY);
    expect(last.year).toBe(2050);
    expect(last.month).toBe(11);
    expect(last.day).toBe(18);
    expect(() => fromJulianDay(LunarTable.MAX_JULIAN_DAY + 1)).toThrow(RangeError);
  });
});

describe("LunarTable.getIljin", () => {
  it.each(fixtures)("음력 날짜로 직접 조회한 일진 $lunar.iljin", ({ lunar }) => {
    const iljin = LunarTable.getIljin(lunar.year, lunar.month, lunar.day, lunar.isLeapMonth);
    expect(iljin).toBe(lunar.iljin);
  });

  it("전체 지원 범위에서 toLunar 경유 일진과 일치", () => {
    const date = new Date(SolarTable.BASE_YEAR, SolarTable.BASE_MONTH - 1, SolarTable.BASE_DAY);
    const end = new Date(SolarTable.MAX_YEAR, SolarTable.MAX_MONTH - 1, SolarTable.MAX_DAY);

    while (date <= end) {
      const y = date.getFullYear();
      const m = date.getMonth() + 1;
      const d = date.getDate();

      const lunar = toLunar(y, m, d);
      const iljin = LunarTable.getIljin(lunar.year, lunar.month, lunar.day, lunar.isLeapMonth);
      expect(iljin, `getIljin 불일치: ${y}-${m}-${d}`).toBe(lunar.iljin);

      date.setDate(date.getDate() + 1);
    }
  });
});

describe("한자 간지", () => {
  it("천간 '신'은 辛, 지지 '신'은 申으로 구분", () => {
    // 1971년 세차 "신해" - 천간 신
    expect(LunarTable.getSecha(1971)).toBe("신해");
    expect(LunarTable.getSechaHanja(1971)).toBe("辛亥");
    // 음력 2025-08-15 일진 "무신" - 지지 신
    expect(LunarTable.getIljin(2025, 8, 15, false)).toBe("무신");
    expect(LunarTable.getIljinHanja(2025, 8, 15, false)).toBe("戊申");
  });

  it("윤달의 wolgeonHanja는 빈 문자열", () => {
    const lunar = toLunar(2025, 7, 25); // 음력 2025년 윤6월 1일
    expect(lunar.isLeapMonth).toBe(true);
    expect(lunar.wolgeonHanja).toBe("");
  });

  it("60일 동안 일진 한자가 60갑자를 모두 순환", () => {
    const seen = new Set<string>();
    for (let jd = 2460705; jd < 2460705 + 60; jd++) {
      seen.add(LunarTable.getIljinHanjaByJulianDay(jd));
    }
    expect(seen.size).toBe(60);
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

  it("전체 지원 범위에서 toLunar -> fromJulianDay 일치", () => {
    const date = new Date(SolarTable.BASE_YEAR, SolarTable.BASE_MONTH - 1, SolarTable.BASE_DAY);
    const end = new Date(SolarTable.MAX_YEAR, SolarTable.MAX_MONTH - 1, SolarTable.MAX_DAY);

    while (date <= end) {
      const y = date.getFullYear();
      const m = date.getMonth() + 1;
      const d = date.getDate();

      const lunar = toLunar(y, m, d);
      const fromJD = fromJulianDay(lunar.julianDay);
      expect(fromJD, `fromJulianDay 불일치: julianDay=${lunar.julianDay}`).toEqual(lunar);

      date.setDate(date.getDate() + 1);
    }
  });
});
