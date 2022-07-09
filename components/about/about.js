

const { ipcRenderer } = require("electron")
let closeAboutBtn = document.querySelector(".close-about-btn")
let openAbout = document.querySelector("#open-about-page")

closeAboutBtn.addEventListener("click", () => {
    ipcRenderer.send("close-about")
})
openAbout.addEventListener("click", (e) => {
    e.preventDefault()
    ipcRenderer.send("open-url")
})

document.addEventListener("DOMContentLoaded", () => {
    ipcRenderer.send("about-ready", "From Abou Page")
})


ipcRenderer.on("version", (evt, version) => {
    // ipcRenderer.send("version", version)
    // alert(version)
    document.getElementById("version").innerText = version
})