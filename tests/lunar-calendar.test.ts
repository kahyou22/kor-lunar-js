import { describe, it, expect } from "vitest";
import { LunarCalendar } from "../src/lunar-calendar";
import { toLunar, toSolar, LunarTable } from "../src/kor-lunar";

describe("LunarCalendar", () => {

  describe("of", () => {
    it("음력 날짜로 생성", () => {
      const lc = LunarCalendar.of(2025, 1, 1);
      expect(lc.year).toBe(2025);
      expect(lc.month).toBe(1);
      expect(lc.day).toBe(1);
      expect(lc.isLeapMonth).toBe(false);
    });

    it("윤달로 생성", () => {
      const lc = LunarCalendar.of(2025, 6, 1, true);
      expect(lc.year).toBe(2025);
      expect(lc.month).toBe(6);
      expect(lc.day).toBe(1);
      expect(lc.isLeapMonth).toBe(true);
    });

    it("유효하지 않은 날짜는 RangeError", () => {
      expect(() => LunarCalendar.of(2025, 13, 1)).toThrow(RangeError);
      expect(() => LunarCalendar.of(2025, 1, 31)).toThrow(RangeError);
      // 2025년에 윤1월은 없음
      expect(() => LunarCalendar.of(2025, 1, 1, true)).toThrow(RangeError);
    });
  });

  describe("fromSolar", () => {
    it("양력에서 생성하면 toLunar 결과와 일치", () => {
      const lc = LunarCalendar.fromSolar(2025, 1, 29);
      const lunar = toLunar(2025, 1, 29);
      expect(lc.year).toBe(lunar.year);
      expect(lc.month).toBe(lunar.month);
      expect(lc.day).toBe(lunar.day);
      expect(lc.isLeapMonth).toBe(lunar.isLeapMonth);
      expect(lc.julianDay).toBe(lunar.julianDay);
    });
  });

  describe("fromJulianDay", () => {
    it("julianDay에서 생성", () => {
      const lc = LunarCalendar.fromJulianDay(2460705);
      expect(lc.year).toBe(2025);
      expect(lc.month).toBe(1);
      expect(lc.day).toBe(1);
    });

    it("범위 밖 julianDay는 RangeError", () => {
      expect(() => LunarCalendar.fromJulianDay(2411388)).toThrow(RangeError);
    });
  });

  describe("today", () => {
    it("오늘 날짜 생성", () => {
      const lc = LunarCalendar.today();
      const now = new Date();
      const expected = toLunar(now.getFullYear(), now.getMonth() + 1, now.getDate());
      expect(lc.julianDay).toBe(expected.julianDay);
    });
  });

  describe("속성", () => {
    it("간지 관련 속성", () => {
      const lc = LunarCalendar.of(2025, 8, 15);
      expect(lc.secha).toBe("을사");
      expect(lc.wolgeon).toBe("을유");
      expect(lc.iljin).toBe("무신");
    });

    it("윤달의 wolgeon은 빈 문자열", () => {
      const lc = LunarCalendar.of(2025, 6, 1, true);
      expect(lc.wolgeon).toBe("");
    });

    it("dayOfWeek", () => {
      // 2025-01-01 음력 = 양력 2025-01-29 (수요일 = 3)
      const lc = LunarCalendar.of(2025, 1, 1);
      expect(lc.dayOfWeek).toBe(3);
    });
  });

  describe("addDays", () => {
    it("양수 일 더하기", () => {
      const lc = LunarCalendar.of(2025, 1, 1);
      const next = lc.addDays(29);
      // 2025년 음력 1월은 29일
      expect(next.year).toBe(2025);
      expect(next.month).toBe(1);
      expect(next.day).toBe(30);
    });

    it("월 경계 넘기기", () => {
      const lc = LunarCalendar.of(2025, 1, 1);
      const monthDays = LunarTable.getMonthDays(2025, 1);
      const next = lc.addDays(monthDays);
      expect(next.month).toBe(2);
      expect(next.day).toBe(1);
    });

    it("음수 일 빼기", () => {
      const lc = LunarCalendar.of(2025, 2, 1);
      const prev = lc.addDays(-1);
      expect(prev.month).toBe(1);
      expect(prev.day).toBe(30);
    });

    it("원본 불변", () => {
      const lc = LunarCalendar.of(2025, 1, 15);
      lc.addDays(100);
      expect(lc.day).toBe(15);
    });

    it("범위 초과 시 RangeError", () => {
      const lc = LunarCalendar.of(2050, 11, 18);
      expect(() => lc.addDays(1)).toThrow(RangeError);
    });
  });

  describe("addMonths", () => {
    it("평달에서 다음 달로", () => {
      const lc = LunarCalendar.of(2025, 5, 15);
      const next = lc.addMonths(1);
      expect(next.year).toBe(2025);
      expect(next.month).toBe(6);
      expect(next.day).toBe(15);
      expect(next.isLeapMonth).toBe(false);
    });

    it("평달에서 윤달로 (2025 윤6월)", () => {
      const lc = LunarCalendar.of(2025, 6, 1);
      const next = lc.addMonths(1);
      // 2025년 윤6월이 있으므로 6평 -> 6윤
      expect(next.year).toBe(2025);
      expect(next.month).toBe(6);
      expect(next.day).toBe(1);
      expect(next.isLeapMonth).toBe(true);
    });

    it("윤달에서 다음 평달로", () => {
      const lc = LunarCalendar.of(2025, 6, 1, true);
      const next = lc.addMonths(1);
      expect(next.year).toBe(2025);
      expect(next.month).toBe(7);
      expect(next.day).toBe(1);
      expect(next.isLeapMonth).toBe(false);
    });

    it("연도 경계 넘기기", () => {
      const lc = LunarCalendar.of(2025, 12, 1);
      const next = lc.addMonths(1);
      expect(next.year).toBe(2026);
      expect(next.month).toBe(1);
      expect(next.day).toBe(1);
    });

    it("day 클램핑 (30일 -> 29일 월)", () => {
      // 2025년 1월이 30일이라 가정하고, 다음 달이 29일인 경우
      const lc = LunarCalendar.of(2025, 1, 30);
      const next = lc.addMonths(1);
      const maxDay = LunarTable.getMonthDays(2025, 2);
      expect(next.day).toBe(Math.min(30, maxDay));
    });

    it("음수 월 빼기", () => {
      const lc = LunarCalendar.of(2025, 1, 15);
      const prev = lc.addMonths(-1);
      expect(prev.year).toBe(2024);
      expect(prev.month).toBe(12);
      expect(prev.day).toBe(15);
    });

    it("여러 달 한번에", () => {
      const lc = LunarCalendar.of(2025, 1, 1);
      const next = lc.addMonths(13);
      // 2025년은 윤6월이 있어 총 13개월이므로 +13은 다음해 1월
      expect(next.year).toBe(2026);
      expect(next.month).toBe(1);
      expect(next.day).toBe(1);
    });

    it("원본 불변", () => {
      const lc = LunarCalendar.of(2025, 6, 15);
      lc.addMonths(3);
      expect(lc.month).toBe(6);
    });
  });

  describe("addYears", () => {
    it("같은 월/일 유지", () => {
      const lc = LunarCalendar.of(2025, 8, 15);
      const next = lc.addYears(1);
      expect(next.year).toBe(2026);
      expect(next.month).toBe(8);
      expect(next.day).toBe(15);
      expect(next.isLeapMonth).toBe(false);
    });

    it("윤달 -> 대상 연도에 같은 윤달 없으면 평달 폴백", () => {
      const lc = LunarCalendar.of(2025, 6, 1, true);
      const next = lc.addYears(1);
      // 2026년에 윤6월이 없으므로 평달 6월로
      expect(next.year).toBe(2026);
      expect(next.month).toBe(6);
      expect(next.isLeapMonth).toBe(false);
    });

    it("day 클램핑", () => {
      const lc = LunarCalendar.of(2025, 1, 30);
      const next = lc.addYears(1);
      const maxDay = LunarTable.getMonthDays(2026, 1);
      expect(next.day).toBe(Math.min(30, maxDay));
    });

    it("음수 연 빼기", () => {
      const lc = LunarCalendar.of(2025, 8, 15);
      const prev = lc.addYears(-1);
      expect(prev.year).toBe(2024);
      expect(prev.month).toBe(8);
      expect(prev.day).toBe(15);
    });

    it("원본 불변", () => {
      const lc = LunarCalendar.of(2025, 1, 1);
      lc.addYears(5);
      expect(lc.year).toBe(2025);
    });
  });

  describe("toSolar", () => {
    it("toSolar 함수와 결과 일치", () => {
      const lc = LunarCalendar.of(2025, 8, 15);
      const solar = lc.toSolar();
      const expected = toSolar(2025, 8, 15, false);
      expect(solar).toEqual(expected);
    });
  });

  describe("toLunarDate", () => {
    it("LunarDate 형태로 변환", () => {
      const lc = LunarCalendar.of(2025, 1, 1);
      const ld = lc.toLunarDate();
      expect(ld).toEqual({
        year: 2025,
        month: 1,
        day: 1,
        isLeapMonth: false,
        secha: "을사",
        wolgeon: "무인",
        iljin: "무술",
        julianDay: 2460705,
        dayOfWeek: 3,
      });
    });
  });

  describe("비교", () => {
    const a = LunarCalendar.of(2025, 1, 1);
    const b = LunarCalendar.of(2025, 1, 15);
    const c = LunarCalendar.of(2025, 1, 1);

    it("equals", () => {
      expect(a.equals(c)).toBe(true);
      expect(a.equals(b)).toBe(false);
    });

    it("isBefore / isAfter", () => {
      expect(a.isBefore(b)).toBe(true);
      expect(b.isAfter(a)).toBe(true);
      expect(a.isAfter(b)).toBe(false);
    });

    it("diffDays", () => {
      expect(b.diffDays(a)).toBe(14);
      expect(a.diffDays(b)).toBe(-14);
    });
  });

  describe("toString", () => {
    it("평달", () => {
      const lc = LunarCalendar.of(2025, 8, 15);
      expect(lc.toString()).toBe("2025-08-15");
    });

    it("윤달", () => {
      const lc = LunarCalendar.of(2025, 6, 1, true);
      expect(lc.toString()).toBe("2025-윤06-01");
    });
  });

  describe("toTraditionalString", () => {
    it("간지 연도 + 정월 초하루", () => {
      const lc = LunarCalendar.of(2025, 1, 1);
      expect(lc.toTraditionalString()).toBe("을사년 정월 초하루");
    });

    it("보름 (15일)", () => {
      const lc = LunarCalendar.of(2025, 8, 15);
      expect(lc.toTraditionalString()).toBe("을사년 팔월 보름");
    });

    it("스무날 (20일)", () => {
      const lc = LunarCalendar.of(2025, 3, 20);
      expect(lc.toTraditionalString()).toBe("을사년 삼월 스무날");
    });

    it("초닷새 (5일)", () => {
      const lc = LunarCalendar.of(2025, 5, 5);
      expect(lc.toTraditionalString()).toBe("을사년 오월 초닷새");
    });

    it("열이틀 (12일)", () => {
      const lc = LunarCalendar.of(2025, 7, 12);
      expect(lc.toTraditionalString()).toBe("을사년 칠월 열이틀");
    });

    it("스무사흘 (23일)", () => {
      const lc = LunarCalendar.of(2025, 9, 23);
      expect(lc.toTraditionalString()).toBe("을사년 구월 스무사흘");
    });

    it("큰달(30일) 그믐", () => {
      // 2025년 1월은 30일 (큰달)
      const maxDay = LunarTable.getMonthDays(2025, 1);
      expect(maxDay).toBe(30);
      const lc = LunarCalendar.of(2025, 1, 30);
      expect(lc.toTraditionalString()).toBe("을사년 정월 그믐");
    });

    it("작은달(29일) 그믐", () => {
      // 2025년 2월은 29일 (작은달)
      const maxDay = LunarTable.getMonthDays(2025, 2);
      expect(maxDay).toBe(29);
      const lc = LunarCalendar.of(2025, 2, 29);
      expect(lc.toTraditionalString()).toBe("을사년 이월 그믐");
    });

    it("윤달 표기", () => {
      const lc = LunarCalendar.of(2025, 6, 1, true);
      expect(lc.toTraditionalString()).toBe("을사년 윤유월 초하루");
    });

    it("섣달 (12월)", () => {
      const lc = LunarCalendar.of(2025, 12, 1);
      expect(lc.toTraditionalString()).toBe("을사년 섣달 초하루");
    });

    it("동짓달 (11월)", () => {
      const lc = LunarCalendar.of(2025, 11, 10);
      expect(lc.toTraditionalString()).toBe("을사년 동짓달 초열흘");
    });

    it("다른 간지 연도 (갑진년)", () => {
      const lc = LunarCalendar.of(2024, 1, 15);
      expect(lc.toTraditionalString()).toBe("갑진년 정월 보름");
    });
  });

  describe("왕복 변환", () => {
    it("of -> toSolar -> fromSolar 왕복", () => {
      const cases = [
        { y: 2024, m: 6, d: 1, leap: false },
        { y: 2025, m: 1, d: 1, leap: false },
        { y: 2025, m: 6, d: 1, leap: true },
        { y: 2025, m: 8, d: 15, leap: false },
        { y: 1890, m: 1, d: 1, leap: false },
        { y: 2050, m: 11, d: 18, leap: false },
      ];

      for (const { y, m, d, leap } of cases) {
        const lc = LunarCalendar.of(y, m, d, leap);
        const solar = lc.toSolar();
        const back = LunarCalendar.fromSolar(solar.year, solar.month, solar.day);
        expect(back.equals(lc), `왕복 실패: ${y}-${m}-${d} (윤달=${leap})`).toBe(true);
      }
    });

    it("addDays(n).addDays(-n) 원복", () => {
      const lc = LunarCalendar.of(2025, 6, 15, true);
      const result = lc.addDays(100).addDays(-100);
      expect(result.equals(lc)).toBe(true);
    });
  });
});
