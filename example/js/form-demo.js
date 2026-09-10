const form = document.querySelector("#contact-form");
const result = document.querySelector("#form-result");

// Keep this practice form local, including keyboard submission.
form.addEventListener("submit", function (event) {
  event.preventDefault();
});

document.querySelector("#check-form").addEventListener("click", function () {
  result.textContent = "";
  if (form.reportValidity()) {
    result.textContent = "Inputs pass the browser checks. Nothing was sent.";
  }
});

form.addEventListener("input", function () {
  result.textContent = "";
});