window.addEventListener("load", loadHandler);
/**
 * Get username text box
 * get username text box value
 * check if username is duplicated(services.checkDuplicates())
 * if duplicated -> change box border to solid red (box.style.border = solid red)
 * if not -> fetch(/signup,method=post, blablabla)
 */
let username;
let password;
let passwordConfirm;

function loadHandler() {
  const passwords = document.querySelectorAll("#password");
  username = document.getElementById("textUsername");
  password = passwords[0];
  passwordConfirm = passwords[1];
  document.querySelector("#signupBtn").addEventListener("click", signupHandler);
}

async function signupHandler() {
  const badPass = false;
  const usernameText = username.value;
  const passwordText = password.value;
  const passwordConfirmText = passwordConfirm.value;

  if (usernameText.includes(" ")) {
    username.style.border = "solid red";
    badPass = true;
    alert("Username cannot contain spaces");
  } else username.style.border = "solid green";

  if (passwordText.includes(" ")) {
    password.style.border = "solid red";
    badPass = true;
    alert("Password cannot contain spaces");
  } else password.style.border = "solid green";

  if (passwordText != passwordConfirmText) {
    passwordConfirm.style.border = "solid red";
    badPass = true;
    alert("Passwords do not match");
  }else passwordConfirm.style.border = "solid green";

  if(badPass){
    const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        },
        body: JSON.stringify({
        username: usernameText,
        password: passwordText,
        }),
    });
    if (response.status == 201) {
        window.location.href = "/login";
    } else {
        alert("Username already exists");
    }
    }else return
}
