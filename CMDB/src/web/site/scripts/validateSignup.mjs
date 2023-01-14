window.addEventListener('load', signupHandler)
/**
 * Get username text box
 * get username text box value
 * check if username is duplicated(services.checkDuplicates())
 * if duplicated -> change box border to solid red (box.style.border = solid red)
 * if not -> fetch(/signup,method=post, blablabla)
 */
let usernameText;
let passwordText;
let passwordConfirmText;

function signupHandler() {
    usernameText = document.getElementById('textUsername');
    passwordText = document.getElementById('password');
    passwordConfirmText = document.getElementById('passwordConfirm');
    document.querySelector('#signupBtn').addEventListener('click', signup);
}

async function signupHandler() {
    const username = usernameText.value;
    const password = passwordText.value;
    const passwordConfirm = passwordConfirmText.value;

    if (username.includes(' ')) {
        // provisório
        usernameText.style.border = 'solid red';
    } else {
        usernameText.style.border = 'solid green';
    }

    if (password.includes(' ')) {
        passwordText.style.border = 'solid red';
    } else {
        passwordText.style.border = 'solid green';
    }

    if (passwordConfirm.includes(' ')) {
        passwordConfirm.style.border = 'solid red';
    } else {
        passwordConfirm.style.border = 'solid green';
    }

    if (password !== passwordConfirm) {
        // provisório
        alert('Passwords do not match');
        return;
    }

    const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username,
            password
        })
    });
    if (response.status == 201) {
        window.location = '/login';
    } else {
        alert('Username already exists');
    }
}

