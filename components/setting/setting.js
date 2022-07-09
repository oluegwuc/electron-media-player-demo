

const { ipcRenderer } = require("electron")
let alwaysOnTopCheckBoxxInput = document.getElementById("top")
let closeSettingBtn = document.getElementById("close-setting-btn")
let toggleCloseConfirmInput = document.getElementById("toggle-close-confirm")

closeSettingBtn.addEventListener("click", () => {
    ipcRenderer.send("close-setting")
})


if (localStorage.getItem("onTop") == "True") {
    alwaysOnTopCheckBoxxInput.checked = true
    ipcRenderer.send("set-to-top")
} else {
    ipcRenderer.send("set-to-bottom")
    alwaysOnTopCheckBoxxInput.checked = false
}

alwaysOnTopCheckBoxxInput.addEventListener("change", () => {
    if (alwaysOnTopCheckBoxxInput.checked) {
        ipcRenderer.send("set-to-top")
        localStorage.setItem("onTop", "True")
    }
    else {
        ipcRenderer.send("set-to-bottom")
        localStorage.setItem("onTop", "False")
    }
})


toggleCloseConfirmInput.addEventListener("change", () => {
    if (toggleCloseConfirmInput.checked) {
        ipcRenderer.send("showconfirm")
        localStorage.setItem("showconfirm", "True")
    }
    else {
        ipcRenderer.send("do-not-show-confirm")
        localStorage.setItem("showconfirm", "False")
    }
})


if (localStorage.getItem("showconfirm") == "True") {
    toggleCloseConfirmInput.checked = true
    ipcRenderer.send("showconfirm")
} else {
    ipcRenderer.send("do-not-show-confirm")
    toggleCloseConfirmInput.checked = false
}
