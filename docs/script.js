document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const container = btn.closest(".card-container");
      const output = container.querySelector(".code");
      const containerId = container.id;

      // 양력 → 음력
      if (containerId === "solarLunar") {
        // 탭에 따라 입력 형태 결정
        const mode = container.querySelector('input[name="sol-type"]:checked').value;
        let y, m, d;

        if (mode === "date") {
          const dateStr = container.querySelector("#solDate").value;
          if (!dateStr) {
            alert("날짜를 선택해주세요.");
            return;
          }
          [y, m, d] = dateStr.split("-").map(Number);
        } else {
          y = Number(container.querySelector("#solYear").value);
          m = Number(container.querySelector("#solMonth").value);
          d = Number(container.querySelector("#sonDay").value);
          if (!y || !m || !d) {
            alert("년·월·일을 모두 입력해주세요.");
            return;
          }
        }

        try {
          const lunar = korLunar.toLunar(y, m, d);
          output.textContent = JSON.stringify(lunar, null, 2);
        } catch (error) {
          output.textContent = error.message;
        }
      }

      // 음력 → 양력
      else if (containerId === "lunarSolar") {
        const y = Number(container.querySelector("#lunYear").value);
        const m = Number(container.querySelector("#lunMonth").value);
        const d = Number(container.querySelector("#sonDay").value);
        const leapMode = container.querySelector('input[name="leap"]:checked').value;
        if (!y || !m || !d) {
          alert("년·월·일을 모두 입력해주세요.");
          return;
        }

        try {
          if (leapMode === "normal") {
            const solar = korLunar.toSolar(y, m, d, false);
            output.textContent = JSON.stringify(solar, null, 2);
          }
          if (leapMode === "leap") {
            const solar = korLunar.toSolar(y, m, d, true);
            output.textContent = JSON.stringify(solar, null, 2);
          }
          if (leapMode === "all") {
            const solar = [korLunar.toSolar(y, m, d, false), korLunar.toSolar(y, m, d, true)];
            output.textContent = JSON.stringify(solar, null, 2);
          }
        } catch (error) {
          output.textContent = error.message;
        }
      }
    });
  });

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
});
