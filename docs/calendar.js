(() => {
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

  const getMonthData = (year, monthIndex) => {
    const { month, isLeapMonth } = korLunar.LunarTable.getMonthFromIndex(year, monthIndex);

    let startDays = korLunar.LunarTable.getTotalDays(year, month, 1, isLeapMonth);
    let endDay;
    if (!isLeapMonth) {
      endDay = korLunar.LunarTable.getMonthDays(year, month);
    } else {
      endDay = korLunar.LunarTable.getLeapMonthDays(year, month);
    }
    return {
      month,
      isLeapMonth,
      startDayOfWeekIndex: (startDays + 1) % 7,
      endDay,
      startDays,
    };
  };

  let today = new Date();
  let lunarToday;

  let currentYear;
  let currentMonthIndex;

  function init() {
    lunarToday = korLunar.toLunar(today.getFullYear(), today.getMonth() + 1, today.getDate());

    currentYear = lunarToday.year;
    currentMonthIndex = korLunar.LunarTable.getMonthIndex(currentYear, lunarToday.month, lunarToday.isLeapMonth);
  }

  function render() {
    const data = getMonthData(currentYear, currentMonthIndex);

    // 라벨 갱신
    document.getElementById("month-label").textContent = `${currentYear}년 ${data.month}월${data.isLeapMonth ? " (윤달)" : ""
      }`;

    // 달력 렌더링
    const ROWS = 6;
    const container = document.querySelector("#lunarCalendar .calendar");
    let html = "";
    // 요일 헤더
    for (const day of weekdays) {
      html += `<div class="day header">${day}</div>`;
    }
    // 빈 칸
    for (let i = 0; i < data.startDayOfWeekIndex; i++) {
      html += `<div class="day"></div>`;
    }
    // 날짜 칸
    for (let d = 1; d <= data.endDay; d++) {
      const isToday =
        currentYear === lunarToday.year &&
        data.month === lunarToday.month &&
        d === lunarToday.day &&
        data.isLeapMonth === lunarToday.isLeapMonth;
      html += `<div class="day${isToday ? " today" : ""}">${d}</div>`;
    }
    // 빈 칸
    const remaining = ROWS * 7 - data.startDayOfWeekIndex - data.endDay;
    for (let i = 0; i < remaining; i++) {
      html += `<div class="day"></div>`;
    }
    container.innerHTML = html;
  }

  function changeMonth(offset) {
    // 현재 연도 윤달 정보
    const hasLeap = korLunar.LunarTable.hasLeapMonth(currentYear);
    const totalMonths = hasLeap ? 12 : 11;

    currentMonthIndex += offset;
    if (currentMonthIndex < 0) {
      currentYear--;
      const prevHasLeap = korLunar.LunarTable.hasLeapMonth(currentYear);
      currentMonthIndex = prevHasLeap ? 12 : 11;
    } else if (currentMonthIndex > totalMonths) {
      currentYear++;
      currentMonthIndex = 0;
    }
    render();
  }

  document.getElementById("today").addEventListener("click", () => {
    init();
    render();
  });
  document.getElementById("prev").addEventListener("click", () => changeMonth(-1));
  document.getElementById("next").addEventListener("click", () => changeMonth(1));

  // 초기 렌더링
  init();
  render();
})();

