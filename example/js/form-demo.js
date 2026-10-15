const form = document.querySelector("#contact-form");
const result = document.querySelector("#form-result");

// The browser's own checks run first. This only runs when they pass,
// and keeps the practice form on the page instead of reloading it.
form.addEventListener("submit", function (event) {
  event.preventDefault();
  result.textContent = "All checks passed. Nothing was sent.";
});

form.addEventListener("input", function () {
  result.textContent = "";
});
