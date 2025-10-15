(() => {
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

  const getMonthIndex = (year, month, isLeapMonth) => {
    if (korLunar.LunarData.hasLeapMonth(year)) {
      const leapMonth = korLunar.LunarData.getLeapMonth(year);
      if ((isLeapMonth && month === leapMonth) || month > leapMonth) {
        month++;
      }
    }
    return month - 1;
  };

  const getMonth = (year, monthIndex) => {
    const hasLeapMonth = korLunar.LunarData.hasLeapMonth(year);
    const leapMonth = korLunar.LunarData.getLeapMonth(year);
    let isLeapMonth = false;
    if (hasLeapMonth) {
      if (monthIndex === leapMonth) {
        isLeapMonth = true;
      }
      if (monthIndex >= leapMonth) {
        monthIndex--;
      }
    }
    return {
      month: monthIndex + 1,
      isLeapMonth,
    };
  };

  const getMonthData = (year, monthIndex) => {
    const { month, isLeapMonth } = getMonth(year, monthIndex);

    let startDays = korLunar.LunarData.getTotalDays(year, month, 1, isLeapMonth);
    let endDay;
    if (!isLeapMonth) {
      endDay = korLunar.LunarData.getMonthDays(year, month);
    } else {
      endDay = korLunar.LunarData.getLeapMonthDays(year, month);
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
    currentMonthIndex = getMonthIndex(currentYear, lunarToday.month, lunarToday.isLeapMonth);
  }

  function updateLabel() {
    const data = getMonthData(currentYear, currentMonthIndex);
    document.getElementById("month-label").textContent = `${currentYear}년 ${data.month}월${
      data.isLeapMonth ? " (윤달)" : ""
    }`;
  }

  function renderCalendar() {
    const container = document.querySelector("#lunarCalendar .calendar");
    container.innerHTML = "";
    // 요일 헤더
    weekdays.forEach((day) => {
      const header = document.createElement("div");
      header.className = "day header";
      header.textContent = day;
      container.appendChild(header);
    });
    // 달 데이터
    const data = getMonthData(currentYear, currentMonthIndex);
    // 빈 칸
    for (let i = 0; i < data.startDayOfWeekIndex; i++) {
      const empty = document.createElement("div");
      empty.className = "day";
      container.appendChild(empty);
    }
    // 날짜 칸
    for (let d = 1; d <= data.endDay; d++) {
      const cell = document.createElement("div");
      cell.className = "day";
      if (
        currentYear === lunarToday.year &&
        data.month === lunarToday.month &&
        d === lunarToday.day &&
        data.isLeapMonth === lunarToday.isLeapMonth
      ) {
        cell.classList.add("today");
      }
      cell.textContent = d;
      container.appendChild(cell);
    }
    // 빈 칸
    const remaining = 42 - data.startDayOfWeekIndex - data.endDay;
    for (let i = 0; i < remaining; i++) {
      const empty = document.createElement("div");
      empty.className = "day";
      container.appendChild(empty);
    }
  }

  function changeMonth(offset) {
    // 현재 연도 윤달 정보
    const hasLeap = korLunar.LunarData.hasLeapMonth(currentYear);
    const totalMonths = hasLeap ? 12 : 11;

    currentMonthIndex += offset;
    if (currentMonthIndex < 0) {
      currentYear--;
      const prevHasLeap = korLunar.LunarData.hasLeapMonth(currentYear);
      currentMonthIndex = prevHasLeap ? 12 : 11;
    } else if (currentMonthIndex > totalMonths) {
      currentYear++;
      currentMonthIndex = 0;
    }
    updateLabel();
    renderCalendar();
  }

  document.getElementById("today").addEventListener("click", reset);
  document.getElementById("prev").addEventListener("click", () => changeMonth(-1));
  document.getElementById("next").addEventListener("click", () => changeMonth(1));

  function reset() {
    init();
    updateLabel();
    renderCalendar();
  }

  // 초기 렌더링
  reset();
})();
