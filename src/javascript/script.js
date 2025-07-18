let startHour, startMinute, endHour, endMinute;

function getUserTimes() {
  const savedStart = localStorage.getItem("startTime");
  const savedEnd = localStorage.getItem("endTime");

  if (savedStart && savedEnd) {
    [startHour, startMinute] = savedStart.split(":").map(Number);
    [endHour, endMinute] = savedEnd.split(":").map(Number);
    return;
  }

  let startTimeInput = prompt("Qual horário do inicio do expediente?", "09:00");
  let [sHour, sMinute] = startTimeInput.split(":").map(Number);

  if (
    isNaN(sHour) ||
    isNaN(sMinute) ||
    sHour < 0 ||
    sHour > 23 ||
    sMinute < 0 ||
    sMinute > 59
  ) {
    alert("Horário inválido!");
    window.location.reload();
    return;
  }

  let endTimeInput = prompt("Qual horário do final do expediente?", "18:00");
  let [eHour, eMinute] = endTimeInput.split(":").map(Number);

  if (
    isNaN(eHour) ||
    isNaN(eMinute) ||
    eHour < 0 ||
    eHour > 23 ||
    eMinute < 0 ||
    eMinute > 59
  ) {
    alert("Horário inválido!");
    window.location.reload();
    return;
  }

  startHour = sHour;
  startMinute = sMinute;
  endHour = eHour;
  endMinute = eMinute;

  localStorage.setItem("startTime", `${sHour}:${sMinute}`);
  localStorage.setItem("endTime", `${eHour}:${eMinute}`);
}

getUserTimes();

function getSecondsLeft(endHour, endMinute) {
  const now = new Date();
  const end = new Date();
  end.setHours(endHour, endMinute, 0, 0);
  return Math.floor((end - now) / 1000);
}

function getSecondsToWeekend() {
  const now = new Date();
  const currentDay = now.getDay();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  const endTime = endHour * 60 + endMinute;

  if (currentDay === 6 || currentDay === 0) {
    return -1;
  }

  if (currentDay === 5 && currentTime >= endTime) {
    return -1;
  }

  const daysUntilFriday = (5 - currentDay + 7) % 7;
  const weekend = new Date(now);
  weekend.setDate(now.getDate() + daysUntilFriday);
  weekend.setHours(endHour, endMinute, 0, 0);

  return Math.floor((weekend - now) / 1000);
}

function formatTime(seconds) {
  if (seconds <= 0) return "Já encerrou!";
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(
    2,
    "0"
  )}:${String(secs).padStart(2, "0")}`;
}

function updateWorkdayCountdown() {
  const secondsLeft = getSecondsLeft(endHour, endMinute);
  const countdownSpan = document.querySelectorAll(".hours span")[0];
  countdownSpan.textContent =
    secondsLeft <= 0 ? "Expediente encerrado! 🎉" : formatTime(secondsLeft);
}

function updateWeekendCountdown() {
  const secondsToWeekend = getSecondsToWeekend();
  const weekendSpan = document.querySelectorAll(".hours span")[1];
  weekendSpan.textContent =
    secondsToWeekend === -1
      ? "Já é fim de semana! 🍻"
      : formatTime(secondsToWeekend);
}

function updateAllCountdowns() {
  updateWorkdayCountdown();
  updateWeekendCountdown();
}

setInterval(updateAllCountdowns, 1000);
updateAllCountdowns();
