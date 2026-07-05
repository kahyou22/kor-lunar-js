# kor-lunar

[![NPM Version](https://img.shields.io/npm/v/kor-lunar.svg)](https://www.npmjs.com/package/kor-lunar)
[![NPM Downloads](https://img.shields.io/npm/dm/kor-lunar.svg)](https://www.npmjs.com/package/kor-lunar)
[![License](https://img.shields.io/npm/l/kor-lunar.svg)](https://github.com/kahyou22/kor-lunar-js/blob/main/LICENSE)

한국천문연구원(KASI) 데이터 기반의 **음력 ↔ 양력 변환**과 **음력 날짜 연산**(가감·비교·간지) 라이브러리입니다.

**1890 ~ 2050년 · 오프라인 동작 · 경량 번들 · Zero Dependencies · TypeScript 타입 내장**

> 변환 데이터는 한국천문연구원(KASI) 공개 데이터를 기반으로 하며, 기준일은 **2025년 5월 20일**입니다.  
> 기준일 이후의 데이터 개정은 반영되지 않았을 수 있습니다 — 최신 데이터는 [KASI 공식 API](https://www.data.go.kr/data/15012679/openapi.do)에서 확인할 수 있습니다.

[예제 사이트](https://kahyou22.github.io/kor-lunar-js/)에서 바로 사용해볼 수 있습니다.

## 설치

```bash
npm install kor-lunar
```

### 브라우저 CDN

```html
<script src="https://cdn.jsdelivr.net/npm/kor-lunar@1.6/dist/kor-lunar.min.js"></script>
```

CDN 사용 시 전역 변수 `korLunar`로 접근할 수 있습니다.  
예기치 않은 변경을 방지하기 위해 **메이저 버전을 고정**하는 것을 권장합니다.

## 사용법

### 모듈 불러오기

```js
import korLunar from "kor-lunar";
// 또는
const korLunar = require("kor-lunar");
```

Named export도 지원합니다:

```js
import { toLunar, toSolar, LunarCalendar } from "kor-lunar";
```

### 양력 → 음력

```js
toLunar(2025, 10, 6);
// {
//   year: 2025,
//   month: 8,
//   day: 15,
//   isLeapMonth: false,
//   secha: '을사',
//   sechaHanja: '乙巳',
//   wolgeon: '을유',
//   wolgeonHanja: '乙酉',
//   iljin: '무신',
//   iljinHanja: '戊申',
//   julianDay: 2460955,
//   dayOfWeek: 1
// }

// 윤달인 경우
toLunar(2025, 7, 25);
// { ..., month: 6, isLeapMonth: true, wolgeon: '' }
// 윤달인 경우 wolgeon은 빈 문자열로 반환됩니다
```

### 음력 → 양력

```js
toSolar(2025, 6, 1);       // { year: 2025, month: 6, day: 25 } — 평달 (기본값)
toSolar(2025, 6, 1, true); // { year: 2025, month: 7, day: 25 } — 윤6월
```

### 음력 날짜 연산 — `LunarCalendar`

불변(immutable) 클래스입니다. 모든 연산은 원본을 바꾸지 않고 새 객체를 반환합니다.

```js
const today = LunarCalendar.today();           // 오늘의 음력 날짜
const chuseok = LunarCalendar.of(2025, 8, 15); // 음력으로 생성
LunarCalendar.fromSolar(2025, 10, 6);          // 양력으로 생성 (위와 같은 날)

chuseok.toSolar();     // { year: 2025, month: 10, day: 6 }
chuseok.daysInMonth;   // 29 — 이 달의 일 수
chuseok.secha;         // '을사' (sechaHanja: '乙巳')
chuseok.toString();    // '2025-08-15' (윤달은 '2025-윤06-01')

chuseok.addDays(1);    // 하루 뒤 — addMonths(n), addYears(n)도 동일한 방식
chuseok.addYears(1);   // 내년 같은 음력 날짜 (윤달이 없는 해는 평달로, 일수가 부족하면 말일로)

chuseok.diffDays(today);        // 일수 차이 (this가 이후면 양수)
chuseok.diffMonths(today);      // 달력상 월 차이 (윤달도 한 달로 카운트)
chuseok.isBefore(today);        // false
LunarCalendar.isValid(2025, 1, 1, true); // false — 2025년에 윤1월은 없음
```

### 명절 날짜 구하기

```js
const seollal = LunarCalendar.of(2026, 1, 1); // 설날 = 음력 1월 1일
seollal.toSolar();                            // { year: 2026, month: 2, day: 17 }

// 설 연휴 (전날 ~ 다음날)
[seollal.addDays(-1), seollal, seollal.addDays(1)].map((d) => d.toSolar());

LunarCalendar.of(2026, 8, 15).toSolar(); // 추석 → { year: 2026, month: 9, day: 25 }
```

## 알아둘 것

- **지원 범위**: 양력 1890-01-21 ~ 2050-12-31, 음력 1890-01-01 ~ 2050-11-18. 벗어나면 `RangeError`가 발생합니다.
- **`toLunar` / `toSolar`는 날짜의 실존 여부를 검증하지 않습니다** (예: 없는 윤달, 30일이 없는 달의 30일). 검증이 필요하면 `LunarCalendar.isValid`(boolean) 또는 `LunarCalendar.of`(RangeError)를 사용하세요.
- **윤달에는 공식 월건이 없어** `wolgeon`/`wolgeonHanja`가 빈 문자열입니다. 앞 달의 월건을 따르는 관례가 필요하면 `LunarTable.getWolgeon(year, month)`를 직접 호출하세요.
- **`LunarCalendar.today()`는 실행 환경의 로컬 시간 기준**입니다. UTC 서버에서 한국 기준 '오늘'이 필요하면 KST로 변환한 날짜를 `fromSolar`에 넘기세요.
- **저수준 유틸**(월별 일수, 윤달 위치, 간지 계산 등)은 `LunarTable` / `SolarTable` 네임스페이스로 직접 접근할 수 있습니다 — [예제: 윤달이 있는 해](https://kahyou22.github.io/kor-lunar-js/#leapMonths)

## 기여 · 라이선스

버그 제보, 기능 제안, 질문 모두 환영합니다 — [Issues](https://github.com/kahyou22/kor-lunar-js/issues) · [Discussions](https://github.com/kahyou22/kor-lunar-js/discussions)

[MIT](LICENSE) · 출처: [한국천문연구원](https://www.kasi.re.kr) · [공공데이터포털 음양력 API](https://www.data.go.kr/data/15012679/openapi.do)
