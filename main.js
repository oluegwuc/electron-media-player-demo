const {
  app,
  BrowserWindow,
  Menu,
  ipcMain,
  dialog,
  shell,
  MenuItem,
} = require("electron");

const path = require("path");
const url = require("url");
let showConfirm = true;

const isDev = require("electron-is-dev");

let mainWindow, settingWindow, aboutWindow;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    show: false,
    frame: false,
    alwaysOnTop: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webviewTag: true,
    },
    width: 1024,
    height: 627,
    minWidth: 1024,
    minHeight: 627,
    backgroundColor: "#d8d8d8",
    icon: __dirname + "/images/icon.ico",
  });

  // Main window Url from index.html

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "index.html"),
      protocol: "file",
      slashes: true,
    })
  );

  //Show with Drag or Selected file on the Desktop Icon
  mainWindow.once("ready-to-show", () => {
    mainWindow.webContents.send("open-with-path", process.argv);
    mainWindow.show();
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
  //Show DevTools
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  ipcMain.on("about-ready", (evt, msg) => {
    aboutWindow.webContents.send("version", app.getVersion());
  });

  // Change Max -restore Icon
  mainWindow.on("maximize", () => {
    mainWindow.webContents.send("isMaximized");
  });

  mainWindow.on("unmaximize", () => {
    mainWindow.webContents.send("isRestored");
  });
}

/////////////////////////////////////////////////////////////////////////////////

// Create Mainwindow when app is ready
app.whenReady().then(createMainWindow);

// handle mac
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

//open Setting
function openSetting() {
  settingWindow = new BrowserWindow({
    modal: true,
    parent: mainWindow,
    show: false,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    width: 300,
    height: 450,
    resizable: false,
    backgroundColor: "#d8d8d8",
    icon: __dirname + "/images/icon.ico",
  });

  // Main window Url from index.html

  settingWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "components/setting/setting.html"),
      protocol: "file",
      slashes: true,
    })
  );

  settingWindow.once("ready-to-show", () => {
    settingWindow.show();
  });

  settingWindow.on("closed", () => {
    settingWindow = null;
  });
  // settingWindow.webContents.openDevTools()
}

//open About
function openAbout() {
  aboutWindow = new BrowserWindow({
    modal: true,
    parent: mainWindow,
    show: false,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    width: 600,
    height: 400,
    resizable: false,
    backgroundColor: "#d8d8d8",
    icon: __dirname + "/images/icon.ico",
  });

  // Main window Url from index.html

  aboutWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "components/about/about.html"),
      protocol: "file",
      slashes: true,
    })
  );

  aboutWindow.once("ready-to-show", () => {
    aboutWindow.show();
  });

  aboutWindow.on("closed", () => {
    aboutWindow = null;
  });
  //  aboutWindow.webContents.openDevTools()
}

//Show Menu windows
ipcMain.on("show-menu", () => {
  let menuTemplate = [
    {
      label: "Open File...",
      click() {
        openFile();
      },
    },

    { type: "separator" },

    {
      label: "Setting..",
      click() {
        openSetting();
      },
    },

    { type: "separator" },

    {
      label: "About",
      click() {
        openAbout();
      },
    },

    { type: "separator" },
    isDev
      ? { role: "reload" }
      : {
          label: "Home Page",
          click() {
            shell.openExternal("http://ocawebtech.ga");
          },
        },
    { type: "separator" },
    {
      label: "Exit",
      click() {
        showConfirm ? showCloseConfirm() : app.quit();
      },
    },
  ];

  if (isDev) {
    // let menuItem = menu.getMenuItemById('helpMenu')
    menuTemplate[5] = { role: "toggleDevTools" };
  }
  //let menu = new Menu();
  let menuConfig = Menu.buildFromTemplate(menuTemplate);
  menuConfig.popup({
    x: 26,
    y: 50,
  });
});

// Open File Function
function openFile() {
  // mainWindow.webContents.send("open-file")
  dialog
    .showOpenDialog(mainWindow, {
      title: "Open Media files",
      buttonLabel: "Select Media files",
      properties: ["openFile", "multiSelections"],
      filters: [
        {
          name: "Medias",
          extensions: [
            "mp3",
            "wav",
            "amr",
            "aac",
            "wma",
            "mp4",
            "mov",
            "mwv",
            "avi",
            "webm",
          ],
        },
      ],
    })
    .then((result) => {
      if (result && result.filePaths[0]) {
        mainWindow.webContents.send("media-paths", result.filePaths);
      }
    });
}

// Open file By Clicking the Play Button
ipcMain.on("open-file", () => {
  openFile();
});

// Minimize app
ipcMain.on("minimize", () => {
  mainWindow.minimize();
});

// Max/Restore
ipcMain.on("maximize-restore", () => {
  if (mainWindow.isMaximized()) {
    mainWindow.restore();
  } else {
    mainWindow.maximize();
  }
});

// SetFullScreen
ipcMain.on("set-full-screen", () => {
  if (mainWindow.fullScreen) {
    mainWindow.setFullScreen(false);
    mainWindow.webContents.send("normal-mode");
  } else {
    mainWindow.setFullScreen(true);
    mainWindow.webContents.send("full-screen-mode");
  }
});

// open About Url
ipcMain.on("open-url", () => {
  shell.openExternal("http://ocawebtech.ga");
});

ipcMain.on("dblclick", () => {
  mainWindow.isMaximized() ? mainWindow.restore() : mainWindow.maximize();
});

// close app
ipcMain.on("close-app", () => {
  showConfirm ? showCloseConfirm() : app.quit();
});

//Set to Top
ipcMain.on("set-to-top", () => {
  mainWindow.setAlwaysOnTop(true);
  // settingWindow.close()
});

// Set To bottom
ipcMain.on("set-to-bottom", () => {
  mainWindow.setAlwaysOnTop(false);
  // settingWindow.close()
});

// close seeting nwindow
ipcMain.on("close-setting", () => {
  settingWindow.close();
});

// Close About
ipcMain.on("close-about", () => {
  aboutWindow.close();
});

// Set Show Confirm
ipcMain.on("showconfirm", () => {
  showConfirm = true;
});
ipcMain.on("do-not-show-confirm", () => {
  showConfirm = false;
});

const createContextMenu = () => {
  const ctxMenu = new Menu();

  ctxMenu.append(
    new MenuItem({
      label: "Setting",
      click: openSetting,
    })
  );

  ctxMenu.append(
    new MenuItem({
      label: "Quit",
      click: () => {
        showConfirm ? showCloseConfirm() : app.quit();
      },
    })
  );

  ctxMenu.popup(mainWindow);
};

ipcMain.on("open-context", () => {
  createContextMenu();
});

//Close  Confirmation Function
function showCloseConfirm() {
  dialog
    .showMessageBox(mainWindow, {
      icon: "images/warning.png",
      message: "Are you sure you want to close?",
      type: "info",
      buttons: ["Yes", "No"],
      defaultId: 1,
      title: "Confirm",
      // detail: "You will lost your progress by closing this app",
    })
    .then((res) => {
      if (res.response == 0) {
        app.quit();
      }
    })
    .catch((err) => console.log(err));
}

//Run app packager
//electron-packager . electron-app --win32 --asar
//electron-packager . Media-Player --win32 --asar --icon="images/icon.ico"
//electron-packager . Media-Player --win32 --asar --arch=ia32  --prune=true --icon="images/icon.ico"
