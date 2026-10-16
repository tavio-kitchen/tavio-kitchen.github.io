import { businessDetails } from "./business-details.js";

function formatTime(value) {
  if (typeof value !== "string" || !/^([01]\d|2[0-3]):[0-5]\d$/.test(value))
    return null;
  const [hour, minute] = value.split(":").map(Number);
  return `${hour % 12 || 12}${minute ? `:${String(minute).padStart(2, "0")}` : ""} ${hour >= 12 ? "pm" : "am"}`;
}

function updateDetails() {
  const today = new Intl.DateTimeFormat("en-CA", {
    weekday: "long",
    timeZone: businessDetails.timeZone,
  })
    .format(new Date())
    .toLowerCase();
  let confirmedDays = 0;

  document.querySelectorAll("[data-hours-day]").forEach((row) => {
    const day = row.dataset.hoursDay;
    const isToday = day === today;
    row.classList.toggle("is-today", isToday);
    row.querySelector(".today-label").hidden = !isToday;
    if (isToday) row.setAttribute("aria-current", "date");
    else row.removeAttribute("aria-current");

    const hours = businessDetails.hours[day];
    const open = formatTime(hours?.open);
    const close = formatTime(hours?.close);
    const value = row.querySelector(".hours-value");
    if (hours?.closed === true) {
      value.textContent = "Closed";
      confirmedDays++;
    } else if (open && close) {
      value.textContent = `${open} – ${close}`;
      confirmedDays++;
    } else {
      value.textContent = "To be confirmed";
    }
  });

  const status = document.querySelector("#hours-status");
  status.textContent =
    confirmedDays === 7
      ? "All times are local to Toronto."
      : "Our opening hours are being confirmed. Please check back before planning your pickup.";
  document.querySelector("#hours-pending").hidden = confirmedDays === 7;

  const callLink = document.querySelector("#call-restaurant");
  const validPhone =
    typeof businessDetails.telephone === "string" &&
    /^\+[1-9]\d{6,14}$/.test(businessDetails.telephone);
  if (validPhone) {
    const number =
      businessDetails.telephoneDisplay || businessDetails.telephone;
    document.querySelector("#phone-number").textContent = number;
    callLink.href = `tel:${businessDetails.telephone}`;
    callLink.setAttribute("aria-label", `Call Tavio Kitchen at ${number}`);
    callLink.hidden = false;
    document.querySelector("#contact-status").textContent =
      "Questions about your pickup? Give us a call.";
  } else {
    document.querySelector("#phone-number").textContent = "Number coming soon";
    callLink.hidden = true;
    callLink.removeAttribute("href");
    document.querySelector("#contact-status").textContent =
      "Our telephone number is being confirmed. Please check back soon.";
  }
}

updateDetails();
// Keep the highlighted day correct if someone leaves the page open overnight.
setInterval(updateDetails, 60_000);
