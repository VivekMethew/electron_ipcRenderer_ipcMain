const electron = require('electron')
const { ipcRenderer } = electron;

const form = document.querySelector('#login-form')

form.addEventListener('submit', submitForm)

function submitForm(e) {
    e.preventDefault()
    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;
    ipcRenderer.send('login:users', { username: username, password: password })
        // console.log({ username, password })
}

// get result
ipcRenderer.on('login:users', function(e, data) {
    console.log(e)
    console.log(data)
    location.href = '../home/index.html'
})