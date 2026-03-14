# kor-lunar

[![NPM Version](https://img.shields.io/npm/v/kor-lunar.svg)](https://www.npmjs.com/package/kor-lunar)
[![NPM Downloads](https://img.shields.io/npm/dm/kor-lunar.svg)](https://www.npmjs.com/package/kor-lunar)
[![License](https://img.shields.io/npm/l/kor-lunar.svg)](https://github.com/kahyou22/kor-lunar-js/blob/main/LICENSE)

한국천문연구원(KASI)의 음력·양력 변환 데이터를 기반으로 한 자바스크립트 라이브러리입니다.  
네트워크 요청 없이 **오프라인에서도 동작**하고, 별도의 외부 의존성이 없습니다.

> **⚠️ 주의:** 데이터는 **2025년 5월 20일 기준**으로 갱신되었습니다.  
> 이후의 중요한 변경 사항이 반영되지 않을 수 있으므로,  
> 중요한 작업에는 아래 [한국천문연구원 공식 API](#출처-및-참고-자료)를 사용하시기 바랍니다.

## 특징

- **음력 ↔ 양력 변환** — `toLunar`, `toSolar`
- **LunarCalendar 클래스** — 음력 날짜 연산 객체 (생성, 연산, 비교)
- **윤달 처리** — `isLeapMonth` 옵션
- **음력 간지 출력** — 세차(`secha`), 월건(`wolgeon`), 일진(`iljin`)
- **TypeScript 지원** — 타입 정의 기본 제공
- **Zero Dependencies** — 외부 의존성 없음
- **CJS / ESM / UMD** — 다양한 환경에서 사용 가능

[예제 사이트](https://kahyou22.github.io/kor-lunar-js/)

## 지원 날짜 범위

| 함수                    | 범위                               |
| ----------------------- | ---------------------------------- |
| `toLunar` (양력 → 음력) | 1890년 1월 21일 ~ 2050년 12월 31일 |
| `toSolar` (음력 → 양력) | 1890년 1월 1일 ~ 2050년 11월 18일  |

_범위를 벗어난 날짜가 입력될 경우 `RangeError`가 발생합니다._

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

// 윤달인 경우
console.log(toLunar(2025, 7, 25));
// { ..., month: 6, isLeapMonth: true, wolgeon: '' }
// 윤달인 경우 wolgeon은 빈 문자열로 반환됩니다
```

### 음력 → 양력 (`toSolar`)

```js
import { toSolar } from "kor-lunar";

console.log(toSolar(2025, 6, 1, false));
// { year: 2025, month: 6, day: 25 }

console.log(toSolar(2025, 6, 1, true));
// { year: 2025, month: 7, day: 25 }
```

### LunarCalendar

음력 날짜를 다루기 위한 **불변(immutable) 클래스**입니다.  
날짜 연산, 비교, 변환 등을 지원하며,  
모든 변경 메서드는 원본을 수정하지 않고 새 객체를 반환합니다.

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

> `korLunar.LunarTable`과 `korLunar.SolarTable`을 통해 내부 유틸 함수에 직접 접근할 수도 있습니다.  
> 이를 통해 더 다양한 기능을 구현할 수 있습니다 — [예제: 음력 달력](https://kahyou22.github.io/kor-lunar-js/#lunarCalendar)

## 기여

버그 제보, 기능 제안, PR 등 모두 환영합니다.

- 🔍 버그 제보 → [Issues](https://github.com/kahyou22/kor-lunar-js/issues)
- 💡 기능 제안 → [Issues](https://github.com/kahyou22/kor-lunar-js/issues) 또는 [Discussions](https://github.com/kahyou22/kor-lunar-js/discussions)
- 💬 질문 · 의견 → [Discussions](https://github.com/kahyou22/kor-lunar-js/discussions)

자유롭게 남겨주세요.

## 라이선스

[MIT](LICENSE)

## 출처 및 참고 자료

- 한국천문연구원: https://www.kasi.re.kr
- 공공데이터포털: https://www.data.go.kr/data/15012679/openapi.do
