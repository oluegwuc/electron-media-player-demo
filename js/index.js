const { ipcRenderer } = require("electron")
//Windows Size Btns
let minimizeBtn = document.querySelector(".minimize-btn")
let maximizeRestoreBtn = document.querySelector(".restore-btn")
let closeBtn = document.querySelector(".close-btn")

let openMenuBtn = document.querySelector(".open-menu-btn")
let mediaLabel = document.querySelector("#media-label")
let fileInput = document.querySelector("#media")
let volume = document.querySelector(".volume-bar");
let title = document.querySelector(".title")
let audioInfo = document.querySelector(".media-info")
let logoTitle = document.querySelector(".logo-title")

// control Btns
let playPauseBtn = document.querySelector(".play-pause-btn")
let PrevBtn = document.querySelector(".prev-btn")
let stopBtn = document.querySelector(".stop-btn")
let nextBtn = document.querySelector(".next-btn")
let toggleRepeatBtn = document.querySelector(".toggle-repeat-btn")
let toggleFullscreenBtn = document.querySelector(".toggle-fullscreen-btn")
let lastTimeBtn = document.querySelector(".last-btn")


let progressContainer = document.querySelector(".progress-bar-container")
let progress = document.querySelector(".progress")
let currentTimeEle = document.querySelector(".current-time")
let durationTimeEle = document.querySelector(".duration")
let hoverTimer = document.querySelector(".hover-timer")
let mediaInfoContainer = document.querySelector(".media-info-container")
let disc = document.querySelector(".disc")

// Open 
openMenuBtn.addEventListener("click", () => {
  ipcRenderer.send("show-menu")
})

minimizeBtn.addEventListener("click", function () {
  ipcRenderer.send("minimize");
});

maximizeRestoreBtn.addEventListener("click", function () {
  ipcRenderer.send("maximize-restore");
});

closeBtn.addEventListener("click", function (event) {
  ipcRenderer.send("close-app");
});

//  Show Confirm
if (localStorage.getItem("showconfirm") == "True") {
  ipcRenderer.send("showconfirm")
} else {
  ipcRenderer.send("do-not-show-confirm")
}


window.oncontextmenu = () => {
  ipcRenderer.send("open-context")
}

