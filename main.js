const electron = require('electron')
const path = require('path')
const url = require('url')

const { app, BrowserWindow, Menu, ipcMain } = electron

let mainWindow;
let addWindow;

// listen for app to be ready
app.on('ready', function() {
    // create new window
    mainWindow = new BrowserWindow({
        height: 750,
        width: 1520,
        minWidth: 600,
        minHeight: 200,
        center: true
    });
    // Load html file
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'app/login/login.html'),
        protocol: 'file',
        slashes: true // file://dirname/mainWindow.html
    }))

    // Quit App when closed
    mainWindow.on('closed', function() {
        app.quit();
    })

    // Build menu from temp
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)
        // insert menu
    Menu.setApplicationMenu(mainMenu)
})

// Handle Create Add Window
function createAddWindow() {
    // create new window
    addWindow = new BrowserWindow({
        width: 400,
        height: 300,
        title: 'Add Shopping List'
    });
    // Load html file
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'app/home/addWindow.html'),
        protocol: 'file',
        slashes: true // file://dirname/mainWindow.html
    }))

    // Garbage Collection handle
    addWindow.on('close', function() {
        addWindow = null
    })
}

// Login Users
ipcMain.on('login:users', function(e, data) {
    console.log(data)
    mainWindow.webContents.send('login:users', data)
})

// Catch Item
ipcMain.on('item:add', function(e, item) {
    // console.log(item)
    mainWindow.webContents.send('item:add', item)
    addWindow.close()
})

const mainMenuTemplate = [{
    label: 'File',
    submenu: [{
            label: 'Add Item',
            click() {
                createAddWindow()
            }
        },
        {
            label: 'Clear Item',
            click() {
                mainWindow.webContents.send('item:clear')
            }
        },
        {
            label: 'Quit',
            accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
            click() {
                app.quit()
            }
        }
    ]
}]

// if mac , add empty object to menu
if (process.platform == 'darwin') {
    mainMenuTemplate.unshift()
}

// if mac , add empty object to menu
if (process.env.NODE_ENV !== 'production') {
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu: [{
            label: 'Toggle devTools',
            accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
            click(item, focusedWindow) {
                focusedWindow.toggleDevTools()
            }
        }, {
            role: 'reload'
        }]
    })
}