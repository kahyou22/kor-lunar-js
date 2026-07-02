(() => {
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  const { LunarCalendar } = korLunar;

  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");

  // 지원 범위 첫 달 / 마지막 달의 1일
  const firstMonth = LunarCalendar.MIN;
  const lastMonth = LunarCalendar.of(
    LunarCalendar.MAX.year,
    LunarCalendar.MAX.month,
    1,
    LunarCalendar.MAX.isLeapMonth,
  );

  // 표시 중인 음력 월의 1일 (불변 LunarCalendar)
  let first;

  function init() {
    const today = LunarCalendar.today();
    first = LunarCalendar.of(today.year, today.month, 1, today.isLeapMonth);
  }

  function render() {
    const today = LunarCalendar.today();
    const isThisMonth =
      first.year === today.year &&
      first.month === today.month &&
      first.isLeapMonth === today.isLeapMonth;

    // 라벨 갱신
    document.getElementById("month-label").textContent = `${first.year}년 ${first.month}월${first.isLeapMonth ? " (윤달)" : ""
      }`;

    // 지원 범위 경계에서 이동 버튼 비활성화
    prevBtn.disabled = first.equals(firstMonth);
    nextBtn.disabled = first.equals(lastMonth);

    // 달력 렌더링
    const ROWS = 6;
    const container = document.querySelector("#lunarCalendar .calendar");
    const endDay = first.daysInMonth;
    let html = "";
    // 요일 헤더
    for (const day of weekdays) {
      html += `<div class="day header">${day}</div>`;
    }
    // 빈 칸
    for (let i = 0; i < first.dayOfWeek; i++) {
      html += `<div class="day"></div>`;
    }
    // 날짜 칸
    for (let d = 1; d <= endDay; d++) {
      const isToday = isThisMonth && d === today.day;
      html += `<div class="day${isToday ? " today" : ""}">${d}</div>`;
    }
    // 빈 칸
    const remaining = ROWS * 7 - first.dayOfWeek - endDay;
    for (let i = 0; i < remaining; i++) {
      html += `<div class="day"></div>`;
    }
    container.innerHTML = html;
  }

  function changeMonth(offset) {
    first = first.addMonths(offset);
    render();
  }

  document.getElementById("today").addEventListener("click", () => {
    init();
    render();
  });
  prevBtn.addEventListener("click", () => changeMonth(-1));
  nextBtn.addEventListener("click", () => changeMonth(1));

  // 초기 렌더링
  init();
  render();
})();
