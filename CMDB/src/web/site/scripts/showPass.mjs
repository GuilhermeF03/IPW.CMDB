window.addEventListener("load", loadHandler);

function loadHandler() {
  let showPass = document.querySelectorAll("#showPass");
  let pass = document.querySelectorAll("#password");
  showPass.forEach((elem, index) => {
    elem.addEventListener("change", function () {
      showPassHandler(elem, pass[index]);
    });
  });
}

function showPassHandler(showpass, pass) {
  if (showpass.checked) {
    pass.type = "text";
  } else {
    pass.type = "password";
  }
}
