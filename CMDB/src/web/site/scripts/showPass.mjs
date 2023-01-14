window.addEventListener("load", showPassHandler);

function showPassHandler() {
  let checkBox = document.getElementById("showPass");
  let pass = document.getElementById("password");
  checkBox.addEventListener("change", function () {
    if (checkBox.checked) {
      pass.type = "text";
    } else {
      pass.type = "password";
    }
  });
}
