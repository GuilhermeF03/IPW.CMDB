window.addEventListener('load', loadHandler)
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
    const passwords = document.querySelectorAll('#password')
    username = document.getElementById('textUsername');
    password = passwords[0]
    passwordConfirm = passwords[1];
    document.querySelector('#signupBtn').addEventListener('click', signupHandler);
}

async function signupHandler() {
    const usernameText = username.value;
    const passwordText = password.value;
    const passwordConfirmText = passwordConfirm.value;

    if (usernameText.includes(' ')) 
        username.style.border = 'solid red';
    else username.style.border = 'solid green';
    
    if (passwordText.includes(' ')) 
        password.style.border = 'solid red';
    else password.style.border = 'solid green';
    
    if (passwordConfirmText.includes(' ')) 
        passwordConfirm.style.border = 'solid red';
    else passwordConfirm.style.border = 'solid green';

    if (passwordText !== passwordConfirmText) {
        // provisório
        alert('Passwords do not match');
        return;
    }

    const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept:'application/json',
        },
        body: JSON.stringify({
            usernameText,
            passwordText
        })
    });
    if (response.status == 201) {
        window.location.href = '/login';
    } else {
        alert('Username already exists');
    }
}

