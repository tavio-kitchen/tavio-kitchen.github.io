const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".main-navigation");

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
