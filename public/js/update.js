// find the form
const form = document.getElementById("updateForm")
// add a listeners
form.addEventListener("change", function () {
  const updateBtn = document.getElementById("updateBtn")
  updateBtn.removeAttribute("disabled")
})