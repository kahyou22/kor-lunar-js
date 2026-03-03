import * as LunarTable from "./lunar-table";
import { toLunar, toSolar, fromJulianDay, LunarDate, SolarDate } from "./kor-lunar";
import { padLeft } from "./utils";

export class LunarCalendar {
  private readonly _julianDay: number;
  private _cache?: LunarDate;

  private constructor(julianDay: number) {
    if (julianDay < LunarTable.BASE_JULIAN_DAY || julianDay > LunarTable.MAX_JULIAN_DAY) {
      throw new RangeError(`지원되지 않는 julianDay입니다. 입력한 값: ${julianDay}`);
    }
    this._julianDay = julianDay;
  }

  /**
   * 음력 날짜로 생성합니다.
   * @param year 음력 연도 (1890 ~ 2050)
   * @param month 음력 월 (1 ~ 12)
   * @param day 음력 일
   * @param isLeapMonth 윤달 여부 (기본값: false)
   * @returns 음력 날짜 객체
   */
  static of(year: number, month: number, day: number, isLeapMonth = false): LunarCalendar {
    if (!LunarTable.isValidDate(year, month, day, isLeapMonth)) {
      const leapStr = isLeapMonth ? "(윤)" : "";
      throw new RangeError(`유효하지 않은 음력 날짜입니다: ${year}-${month}-${day}${leapStr}`);
    }
    const totalDays = LunarTable.getTotalDays(year, month, day, isLeapMonth);
    const julianDay = LunarTable.BASE_JULIAN_DAY + totalDays - 1;
    return new LunarCalendar(julianDay);
  }

  /**
   * LunarDate 객체에서 생성합니다.
   * @param lunarDate 음력 날짜 객체
   * @returns 음력 날짜 객체
   */
  static from(lunarDate: LunarDate): LunarCalendar {
    return new LunarCalendar(lunarDate.julianDay);
  }

  /**
   * 양력 날짜로 생성합니다.
   * @param year 양력 연도
   * @param month 양력 월
   * @param day 양력 일
   * @returns 음력 날짜 객체
   */
  static fromSolar(year: number, month: number, day: number): LunarCalendar {
    const lunar = toLunar(year, month, day);
    return new LunarCalendar(lunar.julianDay);
  }

  /**
   * julianDay(율리우스 일)로 생성합니다.
   * @param julianDay 율리우스 일
   * @returns 음력 날짜 객체
   */
  static fromJulianDay(julianDay: number): LunarCalendar {
    return new LunarCalendar(julianDay);
  }

  /**
   * 오늘의 음력 날짜를 반환합니다.
   * @returns 오늘의 음력 날짜 객체
   */
  static today(): LunarCalendar {
    const now = new Date();
    return LunarCalendar.fromSolar(now.getFullYear(), now.getMonth() + 1, now.getDate());
  }

  private _resolve(): LunarDate {
    if (!this._cache) {
      this._cache = fromJulianDay(this._julianDay);
    }
    return this._cache;
  }

  /** 음력 연도 */
  get year(): number {
    return this._resolve().year;
  }

  /** 음력 월 (1 ~ 12) */
  get month(): number {
    return this._resolve().month;
  }

  /** 음력 일 */
  get day(): number {
    return this._resolve().day;
  }

  /** 윤달 여부 */
  get isLeapMonth(): boolean {
    return this._resolve().isLeapMonth;
  }

  /** 율리우스 일 */
  get julianDay(): number {
    return this._julianDay;
  }

  /** 요일 (0: 일요일 ~ 6: 토요일) */
  get dayOfWeek(): number {
    return this._resolve().dayOfWeek;
  }

  /** 세차 (예: "을사") */
  get secha(): string {
    return this._resolve().secha;
  }

  /** 월건 (윤달이면 빈 문자열) */
  get wolgeon(): string {
    return this._resolve().wolgeon;
  }

  /** 일진 */
  get iljin(): string {
    return this._resolve().iljin;
  }

  /**
   * 일 수를 더한 새 음력 날짜를 반환합니다.
   * @param days 더할 일 수 (음수면 빼기)
   * @returns 새 음력 날짜 객체
   */
  addDays(days: number): LunarCalendar {
    return new LunarCalendar(this._julianDay + days);
  }

  /**
   * 월 수를 더한 새 음력 날짜를 반환합니다.
   * 윤달도 하나의 독립적인 월로 취급합니다.
   * 대상 월의 일수가 현재 일보다 적으면 마지막 날로 클램핑됩니다.
   * @param months 더할 월 수 (음수면 빼기)
   * @returns 새 음력 날짜 객체
   */
  addMonths(months: number): LunarCalendar {
    const cur = this._resolve();
    const totalMonths = LunarTable.getTotalMonths(cur.year, cur.month, cur.isLeapMonth);
    const targetTotalMonths = totalMonths + months;

    const { year, month, isLeapMonth } = LunarTable.fromTotalMonths(targetTotalMonths);

    // day 클램핑
    const maxDay = isLeapMonth
      ? LunarTable.getLeapMonthDays(year, month)
      : LunarTable.getMonthDays(year, month);
    const day = Math.min(cur.day, maxDay);

    return LunarCalendar.of(year, month, day, isLeapMonth);
  }

  /**
   * 연 수를 더한 새 음력 날짜를 반환합니다.
   * 같은 월/일을 유지하려 시도하며, 윤달이 대상 연도에 없으면 평달로 폴백합니다.
   * 대상 월의 일수가 현재 일보다 적으면 마지막 날로 클램핑됩니다.
   * @param years 더할 연 수 (음수면 빼기)
   * @returns 새 음력 날짜 객체
   */
  addYears(years: number): LunarCalendar {
    const cur = this._resolve();
    const targetYear = cur.year + years;

    // 윤달인데, 대상 연도에 해당 윤달이 없으면 -> 평달로 폴백
    let isLeapMonth = cur.isLeapMonth;
    if (isLeapMonth && LunarTable.getLeapMonth(targetYear) !== cur.month) {
      isLeapMonth = false;
    }

    // day 클램핑
    const maxDay = isLeapMonth
      ? LunarTable.getLeapMonthDays(targetYear, cur.month)
      : LunarTable.getMonthDays(targetYear, cur.month);
    const day = Math.min(cur.day, maxDay);

    return LunarCalendar.of(targetYear, cur.month, day, isLeapMonth);
  }

  /**
   * 양력 날짜로 변환합니다.
   * @returns 양력 날짜
   */
  toSolar(): SolarDate {
    const cur = this._resolve();
    return toSolar(cur.year, cur.month, cur.day, cur.isLeapMonth);
  }

  /**
   * LunarDate 인터페이스로 변환합니다.
   * @returns 음력 날짜
   */
  toLunarDate(): LunarDate {
    return { ...this._resolve() };
  }

  /**
   * 두 음력 날짜가 같은 날인지 비교합니다.
   * @returns 같은 날이면 true
   */
  equals(other: LunarCalendar): boolean {
    return this._julianDay === other._julianDay;
  }

  /**
   * 이 날짜가 other보다 이전인지 비교합니다.
   * @returns 이전이면 true
   */
  isBefore(other: LunarCalendar): boolean {
    return this._julianDay < other._julianDay;
  }

  /**
   * 이 날짜가 other보다 이후인지 비교합니다.
   * @returns 이후이면 true
   */
  isAfter(other: LunarCalendar): boolean {
    return this._julianDay > other._julianDay;
  }

  /**
   * 두 날짜 사이의 일수 차이를 반환합니다.
   * this가 other보다 이후이면 양수, 이전이면 음수를 반환합니다.
   * @returns 일수 차이
   */
  diffDays(other: LunarCalendar): number {
    return this._julianDay - other._julianDay;
  }

  /**
   * @experimental 출력 형식이 변경될 수 있습니다.
   * 음력 날짜의 문자열 표현을 반환합니다.
   * 평달인 경우: "2025-08-15"
   * 윤달인 경우: "2025-윤06-01"
   * @returns 음력 날짜의 문자열 표현
   */
  toString(): string {
    const cur = this._resolve();
    const mm = padLeft(cur.month.toString(), 2, "0");
    const dd = padLeft(cur.day.toString(), 2, "0");
    const monthStr = cur.isLeapMonth ? `윤${mm}` : mm;
    return `${cur.year}-${monthStr}-${dd}`;
  }

  /**
   * @experimental 출력 형식이 변경될 수 있습니다.
   * 한국 전통 방식으로 음력 날짜를 읽기 쉽게 문자열로 반환합니다.
   * 예: "을사년 정월 보름", "갑진년 윤삼월 초하루"
   * @returns 한국 전통 방식의 음력 날짜 문자열 표현
   */
  toTraditionalString(): string {
    const cur = this._resolve();

    const monthNames = ["정월", "이월", "삼월", "사월", "오월", "유월", "칠월", "팔월", "구월", "시월", "동짓달", "섣달"];

    const dayNames = ["하루", "이틀", "사흘", "나흘", "닷새", "엿새", "이레", "여드레", "아흐레", "열흘"];

    const monthPrefix = cur.isLeapMonth ? "윤" : "";
    const monthStr = monthPrefix + monthNames[cur.month - 1];

    const maxDay = cur.isLeapMonth
      ? LunarTable.getLeapMonthDays(cur.year, cur.month)
      : LunarTable.getMonthDays(cur.year, cur.month);

    let dayStr;
    if (cur.day === maxDay) {
      dayStr = "그믐";
    } else if (cur.day <= 10) {
      dayStr = "초" + dayNames[cur.day - 1];
    } else if (cur.day === 15) {
      dayStr = "보름";
    } else if (cur.day < 20) {
      dayStr = "열" + dayNames[cur.day - 11];
    } else if (cur.day === 20) {
      dayStr = "스무날";
    } else {
      dayStr = "스무" + dayNames[cur.day - 21];
    }

    return `${cur.secha}년 ${monthStr} ${dayStr}`;
  }
}
