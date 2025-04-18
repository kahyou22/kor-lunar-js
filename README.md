# kor-lunar

이 라이브러리는 학습용으로 제작되었으며, 한국천문연구원(KASI)의 음력·양력 데이터를 기반으로 한 자바스크립트 라이브러리입니다. 오프라인 환경에서도 사용할 수 있도록 구현되었습니다.

> **⚠️ 주의:** 데이터는 2016년 이후로 갱신되지 않아 최신 변경 사항이 반영되지 않을 수 있습니다. 중요한 작업에는 아래 [한국천문연구원 공식 API](#출처-및-참고-자료)를 사용하시기 바랍니다.

## 특징

- 음력 ↔ 양력 변환 지원
- 윤달 처리 가능 (`isLeapMonth` 옵션)
- 오프라인 환경에서도 사용 가능

## 지원 날짜 범위

- **toLunar**: `양력 → 음력` 날짜 범위 1890년 1월 21일 ~ 2050년 1월 22일
- **toSolar**: `음력 → 양력` 날짜 범위 1890년 1월 1일 ~ 2049년 12월 29일

_범위를 벗어난 날짜가 입력될 경우 `RangeError`가 발생하며, 오류 메시지에 입력한 날짜 정보가 포함됩니다._

## 설치

```bash
npm install kor-lunar
```

## 사용법

### 모듈 불러오기

```js
import korLunar from "kor-lunar";
// 또는
const korLunar = require("kor-lunar");
```

### 브라우저 CDN

```html
<script src="https://cdn.jsdelivr.net/npm/kor-lunar/dist/kor-lunar.min.js"></script>
```

## 예제

```js
import korLunar from "kor-lunar";

// 양력 → 음력 (isLeapMonth: false = 평달, true = 윤달)
console.log(korLunar.toLunar(2025, 6, 25));
// { year: 2025, month: 6, day: 1, isLeapMonth: false }
console.log(korLunar.toLunar(2025, 7, 25));
// { year: 2025, month: 6, day: 1, isLeapMonth: true }

// 음력 → 양력
console.log(korLunar.toSolar(2025, 6, 1, false));
// { year: 2025, month: 6, day: 25 }
console.log(korLunar.toSolar(2025, 6, 1, true));
// { year: 2025, month: 7, day: 25 }
```

## 라이선스

[MIT](LICENSE)

## 출처 및 참고 자료

- 한국천문연구원: https://www.kasi.re.kr
- 공공데이터포털: https://www.data.go.kr/data/15012679/openapi.do
