const { app, BrowserWindow, Tray, nativeImage, screen, globalShortcut } = require('electron')
const path = require('path')

const config = {
    trayWindowWidth: 440,
    trayWindowHeight: 300,
    trayWindowMargin: 15,
    shortCutKey: "Super+W"
}

const createWindow = () => {
    const window = new BrowserWindow({
        width: config.trayWindowWidth,
        height: config.trayWindowHeight,
        resizable: false,
        minimizable: false,
        alwaysOnTop: false,
        skipTaskbar: false,
        transparent: true,
        frame: false,
    })
    window.loadFile('index.html')
    positionWindow(window);
}

const toggleWindow = () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        return createWindow()
    } else {
        BrowserWindow.getAllWindows().forEach(element => {
            return element.close();
        });
    }
};

const positionWindow = (window) => {
    let cursor = screen.getCursorScreenPoint();
    let distScreen = screen.getDisplayNearestPoint({ x: cursor.x, y: cursor.y });
    let windowPosition = {
        x: distScreen.workArea.width - config.trayWindowMargin - config.trayWindowWidth,
        y: distScreen.workArea.y + config.trayWindowMargin
    }
    window.setPosition(windowPosition.x, windowPosition.y, true);
}


app.whenReady().then(() => {
    let tray
    const icon = nativeImage.createFromPath(path.join(__dirname, 'backstage.png'))
    tray = new Tray(icon);

    tray.on('click', (e) => {
        toggleWindow();
    })

    const ret = globalShortcut.register(config.shortCutKey, () => {
        console.log(`${config.shortCutKey} was pressed`)
        toggleWindow();
    })

    if (!ret) {
        console.log('registration failed')
    }
})

//prevent app from exiting when all windows are closed
app.on('window-all-closed', e => e.preventDefault())

app.on('browser-window-blur', () => {
    toggleWindow();
})

app.on('will-quit', () => {
    // Unregister all shortcuts.
    globalShortcut.unregisterAll()
})
