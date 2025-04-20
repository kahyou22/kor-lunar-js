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
});
