const path = require('path');
const { app, BrowserWindow, ipcMain, clipboard } = require('electron');
const isDev = require('electron-is-dev');
const { setup: setupPushReceiver } = require('electron-push-receiver');
const sqlite3 = require('sqlite3');


const database = new sqlite3.Database('./public/db.sqlite3', (err) => {
    if (err) console.error('Database opening error: ', err);
});


function initDatabase(){
    database.run("CREATE TABLE IF NOT EXISTS `notes` ( `id` INT,`note` VARCHAR(10000),`time` VARCHAR(20));")

}

initDatabase()

function createWindow() {

    const icon  = path.join(__dirname+'/appImage.icns')
    console.log(icon)
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        title: "Text Bridge",
        webPreferences: { nodeIntegration: true, contextIsolation: false,preload:path.join(__dirname, 'renderer.js') },
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

 database.run(`INSERT INTO notes (id,note,time) VALUES (1,"asdasfasdas","2008-11-11")`,(rows,error)=>{
    database.all("SELECT * from notes",(error,rows)=>{
        console.log("Data Received : ",rows)
    })
 })

 