(() => {
    const { BASE_YEAR, MAX_YEAR } = korLunar.LunarTable;

    const container = document.querySelector("#leapMonths .leap-list");

    for (let year = BASE_YEAR; year <= MAX_YEAR; year++) {
        const leapMonth = korLunar.LunarTable.getLeapMonth(year);
        if (leapMonth === 0) continue;

        const row = document.createElement("div");
        row.className = "leap-row";

        const yearEl = document.createElement("span");
        yearEl.className = "leap-year";
        yearEl.textContent = `${year}년`;

        const monthEl = document.createElement("span");
        monthEl.className = "leap-month";
        monthEl.textContent = `${leapMonth}월`;

        row.appendChild(yearEl);
        row.appendChild(monthEl);
        container.appendChild(row);
    }
})();
