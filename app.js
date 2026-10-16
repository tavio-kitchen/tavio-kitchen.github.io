const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".main-navigation");
const dialog = document.querySelector("#order-dialog");
const dialogTitle = document.querySelector("#dialog-heading");
const dialogDescription = document.querySelector("#dialog-description");
const dialogOptions = document.querySelector(".dialog-options");

function closeNavigation() {
  navigation.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
}

menuToggle.addEventListener("click", () => {
  const open = menuToggle.getAttribute("aria-expanded") !== "true";
  navigation.classList.toggle("is-open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute(
    "aria-label",
    open ? "Close navigation" : "Open navigation",
  );
});

document.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    closeNavigation();
    if (dialog.open) dialog.close();
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navigation.classList.contains("is-open")) {
    closeNavigation();
    menuToggle.focus();
  }
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".site-header")) closeNavigation();
});

matchMedia("(min-width: 601px)").addEventListener("change", (event) => {
  if (event.matches) closeNavigation();
});

document.querySelectorAll("[data-order]").forEach((button) => {
  button.addEventListener("click", () => {
    const mode = button.dataset.order;
    const choosing = mode === "choose";
    dialogTitle.textContent = choosing
      ? "What’s for dinner?"
      : mode === "pickup"
        ? "Your favourites, to go."
        : "Comfort food, delivered.";
    dialogDescription.textContent = choosing
      ? "Online ordering is coming soon. In the meantime, find your favourites on the menu and visit us on Queen East."
      : mode === "pickup"
        ? "Online pickup ordering is coming soon. Explore our favourites below, then come see us at 1918 Queen St E, Toronto."
        : "Online delivery is coming soon. Explore our favourites below, or visit us at 1918 Queen St E, Toronto.";
    dialogOptions.hidden = !choosing;
    if (!dialog.open) dialog.showModal();
    if (!choosing) document.querySelector(".dialog-close").focus();
  });
});

document
  .querySelector(".dialog-close")
  .addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target !== dialog) return;
  const bounds = dialog.getBoundingClientRect();
  if (
    event.clientX < bounds.left ||
    event.clientX > bounds.right ||
    event.clientY < bounds.top ||
    event.clientY > bounds.bottom
  )
    dialog.close();
});

function updateActiveNavigation() {
  const anchor = location.hash || "#home";
  const pageHref = document.body.classList.contains("menu-page")
    ? "/menu.html"
    : document.body.classList.contains("our-story-page")
      ? "/our-story.html"
      : document.body.classList.contains("visit-us-page")
        ? "/visit-us.html"
        : null;
  document.querySelectorAll(".nav-link").forEach((link) => {
    const active = pageHref
      ? link.getAttribute("href") === pageHref
      : link.getAttribute("href") === anchor;
    link.classList.toggle("is-active", active);
    if (active)
      link.setAttribute("aria-current", pageHref ? "page" : "location");
    else link.removeAttribute("aria-current");
  });
}
addEventListener("hashchange", updateActiveNavigation);
updateActiveNavigation();
