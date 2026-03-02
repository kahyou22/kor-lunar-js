# kor-lunar

[![NPM Version](https://img.shields.io/npm/v/kor-lunar.svg)](https://www.npmjs.com/package/kor-lunar)
[![NPM Downloads](https://img.shields.io/npm/dm/kor-lunar.svg)](https://www.npmjs.com/package/kor-lunar)
[![License](https://img.shields.io/npm/l/kor-lunar.svg)](https://github.com/kahyou22/kor-lunar-js/blob/main/LICENSE)

이 라이브러리는 학습용으로 제작되었으며, 한국천문연구원(KASI)의 음력·양력 변환 데이터를 기반으로 한 자바스크립트 라이브러리입니다.  
네트워크 요청 없이 **오프라인에서도 동작**하고, 별도의 외부 의존성이 없습니다.

> **⚠️ 주의:** 데이터는 **2025년 5월 20일 기준**으로 갱신되었습니다.  
> 이후의 중요한 변경 사항이 반영되지 않을 수 있으므로,  
> 중요한 작업에는 아래 [한국천문연구원 공식 API](#출처-및-참고-자료)를 사용하시기 바랍니다.

## 특징

- **음력 ↔ 양력 변환** — `toLunar`, `toSolar`
- **LunarCalendar 클래스** — 음력 날짜 연산 객체 (생성, 연산, 비교)
- **윤달 처리** — `isLeapMonth` 옵션
- **음력 간지 출력** — 세차(`secha`), 월건(`wolgeon`), 일진(`iljin`)
  - 윤달인 경우 `wolgeon`은 빈 문자열로 반환됩니다
- **TypeScript 지원** — 타입 정의 기본 제공
- **Zero Dependencies** — 외부 의존성 없음
- **CJS / ESM / UMD** — 다양한 환경에서 사용 가능

- [예제 사이트](https://kahyou22.github.io/kor-lunar-js/)

## 지원 날짜 범위

- **toLunar**: `양력 → 음력` 날짜 범위 1890년 1월 21일 ~ 2050년 12월 31일
- **toSolar**: `음력 → 양력` 날짜 범위 1890년 1월 1일 ~ 2050년 11월 18일

_범위를 벗어난 날짜가 입력될 경우 `RangeError`가 발생하며, 오류 메시지에 입력한 날짜 정보가 포함됩니다._

## 설치

```bash
npm install kor-lunar
```

### 브라우저 CDN

```html
<script src="https://cdn.jsdelivr.net/npm/kor-lunar@1.5/dist/kor-lunar.min.js"></script>
```

CDN 사용 시 전역 변수 `korLunar`로 접근할 수 있습니다.

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

---

## 예제

[예제 사이트](https://kahyou22.github.io/kor-lunar-js/)

### 양력 → 음력 (`toLunar`)

```js
import { toLunar } from "kor-lunar";

console.log(toLunar(2025, 6, 25));
// {
//   year: 2025,
//   month: 6,
//   day: 1,
//   isLeapMonth: false,
//   secha: '을사',
//   wolgeon: '계미',
//   iljin: '을축',
//   julianDay: 2460852,
//   dayOfWeek: 3
// }
```

### 양력 → 음력 (윤달)

```js
console.log(toLunar(2025, 7, 25));
// {
//   year: 2025,
//   month: 6,
//   day: 1,
//   isLeapMonth: true,
//   secha: '을사',
//   wolgeon: '',        // 윤달인 경우 월건은 빈 문자열
//   iljin: '을미',
//   julianDay: 2460882,
//   dayOfWeek: 5
// }
```

### 음력 → 양력 (`toSolar`)

```js
import { toSolar } from "kor-lunar";

console.log(toSolar(2025, 6, 1, false));
// { year: 2025, month: 6, day: 25 }

console.log(toSolar(2025, 6, 1, true));
// { year: 2025, month: 7, day: 25 }
```

> 권장되진 않지만, `korLunar.LunarTable`과 `korLunar.SolarTable` 같은 내부 함수에 직접 접근할 수도 있습니다.  
> 이를 통해 단순 음력 변환 뿐만 아니라, 더 다양한 기능을 구현할 수 있습니다.  
> [예제 사이트: 음력 달력](https://kahyou22.github.io/kor-lunar-js/#lunarCalendar)

---

## LunarCalendar

음력 날짜를 다루기 위한 **불변(immutable) 클래스**입니다.  
날짜 연산, 비교, 변환 등을 지원하며, 모든 변경 메서드는 원본을 수정하지 않고 새 객체를 반환합니다.

### 예제

```js
import { LunarCalendar } from "kor-lunar";

// 음력 날짜로 생성 (2025년 8월 15일, 추석)
const chuseok = LunarCalendar.of(2025, 8, 15);

// 속성 접근
chuseok.year; // 2025
chuseok.month; // 8
chuseok.day; // 15
chuseok.isLeapMonth; // false
chuseok.dayOfWeek; // 0 (일요일)
chuseok.secha; // '을사'
chuseok.wolgeon; // '을유'
chuseok.iljin; // '무신'

// 양력 변환
chuseok.toSolar(); // { year: 2025, month: 10, day: 6 }

// 문자열 표현
chuseok.toString(); // '2025-08-15' (윤달인 경우 2025-윤06-01)

// 날짜 연산 (원본은 변경되지 않음)
const nextDay = chuseok.addDays(1);
const nextMonth = chuseok.addMonths(1);
const nextYear = chuseok.addYears(1);

// 비교
chuseok.isBefore(nextDay); // true
chuseok.equals(chuseok); // true
nextDay.diffDays(chuseok); // 1
```

#### addMonths 동작 방식

- 윤달도 하나의 독립적인 월로 취급합니다
- 대상 월의 일수가 현재 일보다 적으면 마지막 날로 클램핑됩니다

```js
// 2025년에는 윤6월이 있음
const june = LunarCalendar.of(2025, 6, 1); // 6월 평달
const leapJune = june.addMonths(1); // 6월 윤달
const july = june.addMonths(2); // 7월 평달

// day 클램핑: 1월 30일 + 1개월 -> 2월의 마지막 날
const jan30 = LunarCalendar.of(2025, 1, 30);
const feb = jan30.addMonths(1);
feb.day; // 29 (2025년 음력 2월이 29일까지인 경우)
```

#### addYears 동작 방식

- 같은 월/일을 유지하려 시도합니다
- 윤달인데 대상 연도에 해당 윤달이 없으면 평달로 폴백합니다
- 대상 월의 일수가 현재 일보다 적으면 마지막 날로 클램핑됩니다

```js
// 윤달 → 대상 연도에 해당 윤달이 없으면 평달로
const leapJune = LunarCalendar.of(2025, 6, 1, true);
const nextYear = leapJune.addYears(1);
nextYear.isLeapMonth; // false (2026년에 윤6월이 없으므로 평달)
```

## 라이선스

[MIT](LICENSE)

## 출처 및 참고 자료

- 한국천문연구원: https://www.kasi.re.kr
- 공공데이터포털: https://www.data.go.kr/data/15012679/openapi.do
