const path = require('path');
const { app, BrowserWindow, ipcMain, clipboard } = require('electron');
const isDev = require('electron-is-dev');
const { setup: setupPushReceiver } = require('electron-push-receiver');
const sqlite3 = require('sqlite3');


const database = new sqlite3.Database('./public/db.sqlite3', (err) => {
    if (err) console.error('Database opening error: ', err);
});


function initDatabase() {
    database.run("CREATE TABLE IF NOT EXISTS `notes` ( `id` INTEGER PRIMARY KEY AUTOINCREMENT,`note` VARCHAR(10000),`time` VARCHAR(20),`receivedFrom` VARCHAR(20));")
}

initDatabase()

function createWindow() {

    const icon = path.join(__dirname + '/appImage.icns')
    console.log(icon)
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        title: "Text Bridge",
        webPreferences: { nodeIntegration: true, contextIsolation: false, preload: path.join(__dirname, 'renderer.js') },
        icon
    });

    setupPushReceiver(win.webContents);

    win.loadURL(
        isDev
            ? 'http://localhost:3000'
            : `file://${path.join(__dirname, '../build/index.html')}`
    );
    if (isDev) {
        win.webContents.openDevTools({ mode: 'right' });
    }
    setupPushReceiver(win.webContents);
}


app.whenReady().then(createWindow);



app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

ipcMain.on('current-text', (event, arg) => {
    event.returnValue = clipboard.readText()
})

ipcMain.on('save-text', (event, arg) => {
    console.log("Received Args ", arg)
    const query = "INSERT INTO notes (note,time) VALUES ('" + arg.note + "'," + "'" + arg.time + "')"
    database.run(query, (rows, error) => { })
})


ipcMain.handle("get-all-texts", (event, args) => {
    return new Promise((resolve, reject) => {
        database.all("SELECT * from notes order by time", (error, rows) => {
            console.log("Found Values : ", rows)
            resolve(rows)
        })
    })
})