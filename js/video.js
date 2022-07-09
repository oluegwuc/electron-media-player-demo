/* OCA WEBTECH  

Several ways of loading files into the PlayList Array
*/
// Library to Read File Metadata
const path = require("path");
const fluent = require("fluent-ffmpeg");
const { shell } = require("electron");
const ffmpeg = fluent()
ffmpeg.setFfprobePath(`C:\\ffmpeg\\ffprobe.exe`)
let mediaFile = document.querySelector(".video")
let dropZones = document.querySelectorAll(".drop-zone")
let footer = document.querySelector(".footer")
let header = document.querySelector(".header")
let listBtn = document.querySelector(".list-btn")

mediaFile.volume = volume.value
// Global Vars
let count = 0
let isPlaying = false
let repeat = false
let  mediaType
let isFullScreen = false
let listShown = false


let playList = []
try {
    
// Filtering for Required Files Extensions Functions Called when file selected
let requireFileExtesions =  [".mp3", ".wav", ".amr", ".aac", ".wma",".mp4", ".mov", ".mwv", ".avi", ".webm"]
const removeUnwantedFileExtensions = (files) => {
let filterFile = files.filter((file) => requireFileExtesions.includes(path.extname(file)) )
playList = filterFile
}

const getUnwantedfiles =  (files) => {
    let wrongFormat = files.filter((file) => !requireFileExtesions.includes(path.extname(file)) )
  return wrongFormat
    }

dropZones.forEach(dropZone => {
    // Drag and Drop to Selected File
dropZone.addEventListener("drop", (e) => {
    e.preventDefault()
    e.stopPropagation()
    playList = []
    for(let file of e.dataTransfer.files){
        playList.push(file.path)
       
    }
   removeUnwantedFileExtensions(playList)
    playMediaFile(playList[0])
    isPlaying = true
    
})

dropZone.addEventListener("dragover", (e) => {
    e.preventDefault()
    e.stopPropagation()
})
})

// Open file with Open file menu item 
ipcRenderer.on("media-paths", (evt, paths) => {
    playList = []
for (file of paths){
    playList.push(file)
  
}
 removeUnwantedFileExtensions(playList)
playMediaFile(playList[0])
isPlaying = true

})

// Open file By dragging to app icon or Open with app
ipcRenderer.on("open-with-path", (evt, paths) => {
    for (file of paths){
        playList.push(file)
    }
    removeUnwantedFileExtensions(playList)
    playMediaFile(playList[0])
    isPlaying = true
})

// Open File By Clicking the play Pause Button
playPauseBtn.addEventListener("click", () => {
    if(playList.length == 0){
        ipcRenderer.send("open-file")
        isPlaying = true
    }else{
        //Pause the media
        playPauseMedia()
        // hideLogoTitle()
        // showMediaInfo(playList[count])
    }
     
})

const playMediaFile = (currentPath) => {
    if(playList.length > 0){
        mediaFile.src = currentPath//files[count]
        mediaFile.play()
        showMediaInfo(currentPath)  //showMediaInfo(files[count])
    }else{
        console.warn("Cannot Play Any of the selected Files")  
    }
    }
        
const showMediaInfo = (path) => {
 //Read metadata
 ffmpeg.input(path)
 .ffprobe((err, metadata) => {
     if (!err) {
          mediaType = metadata.streams[0].codec_type
         if(mediaType == "audio"){
             // Show Audio Info and Hide Video Info
             showAudioInfo(metadata)
            }else if (mediaType == "video"){
                // Show Video Info and Hide Audio Info
                showVideoInfo(metadata)
         }
     } else {
         console.error(err)
     }
 }) 
}

const showAudioInfo = (metadata) => {
    // mediaInfoContainer.style.display = "flex"
    playPauseBtn.innerHTML = `<i class="fa-solid fa-pause"></i>`
    playPauseBtn.title = "Pause"
    disc.classList.add("animate-disc")
    mediaFile.style.display = "none"
    hideInfo()
    // Read Audio Infor from Augument
    title.innerHTML  = path.basename(metadata.format.filename)
    if(metadata.format.tags){
        let {title, artist, album, genre, track} =  metadata.format.tags
        tagsDetails =`
        <ul class="tags"> 
        <p>${title ? "Title: " + title : ""} </p>
        <p>${artist ? "Artist: " + artist : ""} </p>
        <p>${album ? "Album: " +album : ""} </p>
        <p>${genre ? "Genre: " +genre : ""} </p>
        <p>${track ? "Track: " +track : ""} </p>
    
        </ul>
        `
        audioInfo.innerHTML = tagsDetails
    }else{
        audioInfo.innerHTML = path.basename(metadata.format.filename)
    }
}


const showVideoInfo = (metadata) => {
hideInfo()
playPauseBtn.innerHTML = `<i class="fa-solid fa-pause"></i>`
playPauseBtn.title = "Pause"
disc.classList.remove("animate-disc")
title.innerHTML  = path.basename(metadata.format.filename)
}
//Hide Logo Title Function
function hideInfo(){
    if(mediaType == "audio"){
        mediaFile.style.display = "none"
        mediaInfoContainer.style.display = "flex"
        logoTitle.style.display = "none"
      }else{
        mediaFile.style.display = "block"
        mediaInfoContainer.style.display = "none"
        logoTitle.style.display = "none"
      }
}

//Handle Logo Title
function showLogoTitle(){
    mediaFile.style.display = "none"
    mediaInfoContainer.style.display = "none"
    logoTitle.style.display = "flex"
}

// Pause media Funtion
const pauseMedia = () => {
    mediaFile.pause()
    playPauseBtn.innerHTML = `<i class="fa-solid fa-play"></i>`
    playPauseBtn.title = "Play"
    disc.classList.remove("animate-disc") 
    isPlaying = false
  }

const playMedia = () => {
    mediaFile.play()
    playPauseBtn.title = "Pause"
    playPauseBtn.innerHTML = `<i class="fa-solid fa-pause"></i>`
    disc.classList.add("animate-disc")
    isPlaying = true
        
}

  const playPauseMedia = () => {
      if(isPlaying){
          isPlaying = true
        pauseMedia()
      }else{
          isPlaying = false
          playMedia()
         hideInfo()
        
      }
  }
//   Stop Media function
const stopMedia = () => {
    mediaFile.currentTime = 0
    isPlaying = false
    pauseMedia()
    durationTimeEle.innerHTML = "00:00:00"
    currentTimeEle.innerHTML = "00:00:00"
   showLogoTitle()
   if(isFullScreen){
       ipcRenderer.send("set-full-screen")
   }
}
// Go Previou Funtion
const gotToPrevious = () => {
    count--
    if(count < 0){
        count = playList.length - 1
    }
    playMediaFile(playList)
}

const goToNext = () => {
    count ++
    if(count > playList.length -1){
        count = 0
    }
    playMediaFile(playList[count])
}

stopBtn.addEventListener("click", stopMedia)
PrevBtn.addEventListener("click", gotToPrevious)
nextBtn.addEventListener("click", goToNext)

//togglerepeat
toggleRepeatBtn.addEventListener("click", () => {
    if(repeat){
        repeat = false
        toggleRepeatBtn.classList.remove("repeat-on")
    }else{
        repeat = true
        toggleRepeatBtn.classList.add("repeat-on")
    }

})
  // Pause Play Video with SpaceBar
function playPauseOnKeyUp(event) {
    if (event.key === " ") {
        if (mediaFile.paused) {
           playMedia()
          
        } else {
          pauseMedia()
        }
    }
}
window.addEventListener('keyup', playPauseOnKeyUp, true);

// volume implementation
volume.addEventListener("input", (e) => {
    mediaFile.volume = e.target.value;
});
volume.addEventListener("input", () => {
    let volumePercentage = volume.value * 100
    document.querySelector(".volume-percent").innerHTML = `${volumePercentage.toFixed()}%`
})

// Media Update Timer
let updateCurrentTime = () => {
    let currentMinutes = Math.floor(mediaFile.currentTime / 60);
    let currentSeconds = Math.floor(mediaFile.currentTime - currentMinutes * 60);
    let durationMinutes = Math.floor(mediaFile.duration / 60);
    let durationSeconds = Math.floor(mediaFile.duration - durationMinutes * 60);
    let durationHours = Math.floor(durationMinutes / 60)
    let currentHours = Math.floor(currentMinutes / 60)
    let durationMinutes_ = durationMinutes % 60
    let currentMinutes_ = currentMinutes % 60

    currentTimeEle.innerHTML = `${currentHours}:${currentMinutes_ < 10 ? "0" + currentMinutes_ : currentMinutes_}:${currentSeconds < 10 ? "0" + currentSeconds : currentSeconds
        }`;
    if (isNaN(durationSeconds)) {
        durationTimeEle.innerHTML = "00:00:00"
    } else {

        durationTimeEle.innerHTML = `${durationHours}:${durationMinutes_ < 10 ? "0" + durationMinutes_ : durationMinutes_}:${durationSeconds}`;
    }

};
// Update Progress
function progressUpdate() {
    let { currentTime, duration } = mediaFile;
    let progressPercentage = (currentTime / duration) * 100;
    progress.style.width = `${Math.floor(progressPercentage)}%`;
}

// Set Progress and Seek
function setProgress(e) {
    let width = this.clientWidth;
    let clickX = e.offsetX;
    let duration = mediaFile.duration;
    mediaFile.currentTime = (clickX / width) * duration;
    
}
// Set Progress and Seek
function seekProgress(e) {
    let width = this.clientWidth;
    let clickX = e.offsetX;
    let duration = mediaFile.duration;

    hoverTimer.style.left = `${clickX + 10}px`
    let videoDuration = (clickX / width) * duration;
    hoverTimer.innerHTML = `${Math.floor(videoDuration / 60 / 60)} : ${Math.floor(videoDuration / 60 % 60)} : ${Math.floor(videoDuration % 60)}`
    if (isPlaying){

        hoverTimer.style.display = "inline"
    }
 
}

mediaFile.addEventListener("timeupdate", () => {
    updateCurrentTime();
    progressUpdate();
});

progressContainer.addEventListener("click", setProgress);
progressContainer.addEventListener("mousemove", seekProgress);
progressContainer.addEventListener("mouseleave", () => {
    hoverTimer.style.display = "none"
});

// Ended Action
mediaFile.addEventListener("ended", () =>{
    count++   
if(playList.length > 0  && repeat){
    if(count > playList.length - 1){
        count = 0
    }
    if(count < 0){
        count = playList.length - 1
    }
    playMediaFile(playList[count])
}else if(playList.length > 0 && !repeat){
    if(count > playList.length - 1){
        window.location.reload()
    }
    playMediaFile(playList[count])

}
    
})

// Maximize on Double Click
mediaFile.addEventListener("dblclick", () => {
    ipcRenderer.send("set-full-screen")
});

        //Toggle Fullscreen
    toggleFullscreenBtn.addEventListener("click", () =>{
        if(mediaType.toLowerCase() == "video" && isPlaying){

            ipcRenderer.send("set-full-screen")
        }

    })
    
let Container = document.querySelector(".container")
ipcRenderer.on("full-screen-mode", () => {
    isFullScreen = true
    footer.classList.add("footer-full-screen")
    header.classList.add("header-full-screen")
    Container.classList.add("height")
    mediaFile.className += " fullscreen"
    setTimeout(() => {
            footer.style.top = "40px" 
        }, 1000);
        setTimeout(() => {
            footer.style.top = "-20px"

        }, 5000);
    
})
ipcRenderer.on("normal-mode", () => {
    isFullScreen = false
    footer.classList.remove("footer-full-screen")
    header.classList.remove("header-full-screen")
   Container.classList.remove("height")
   mediaFile.classList.remove("fullscreen")
})

footer.addEventListener("mouseenter", () => {
    if(isFullScreen){
        footer.style.top = "40px"
    }
})


footer.addEventListener("mouseleave", () => {
    if(isFullScreen){
        footer.style.top = "-20px"
    }
})


let mediaList = document.querySelector(".media-list")

listBtn.addEventListener("click", () => {
    listShown = !listShown

    let html = ""
    let listNames = []
    playList.forEach(list => {
        listNames.push(path.basename(list))
        html +=` <p id="${list}" class="list-item">${path.basename(list)} <span id="${list}" class="view-location">Open Location </span></p>`
    })
    if(playList.length == 0){

        mediaList.innerHTML = "Play List is Empty.."
    }else mediaList.innerHTML = html
if(!listShown){

    mediaList.style.display = "none"
}else{
    mediaList.style.display = "block"

}
})

mediaList.addEventListener("click", (e) => {

    if(e.target.className.includes("list-item")){
        playMediaFile(playList[playList.indexOf(e.target.id)])
        mediaList.style.display = "none"
        listShown = false
        e.target.classList.add("active")
        e.target.innerHTML += " Playing..."
    } else if (e.target.className.includes("view-location")){
        shell.showItemInFolder(e.target.id, (err) => {
            if(!err){
                console.log("File Open in ")
            }
        })

    }



})

} catch (error) {
  console.log("Catched Error", error)
}

