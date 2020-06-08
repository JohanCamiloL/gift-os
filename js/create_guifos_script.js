let recorder; // Global variable to start and stop recording gif.
let blob; // Global variable to set and manage the blob generated by RecordRTC
let gifLocalUrl;

document.getElementById("back-arrow").addEventListener("click", () => {
    window.location.href = "./mis_guifos.html";
});

[...document.getElementsByClassName("page-logo")].forEach(elem => {
    elem.addEventListener("click", () => {
        window.location.href = "./";
    });
});

[...document.getElementsByClassName("record")].forEach(elem => {
    elem.addEventListener("click", () => {
        document.getElementById("stop-recording-section").style.display = "grid";
        document.getElementById("recording-buttons").style.display = "none";
        changeElementContent("rec-guifo-title", "Capturando Tu Guifo");
        startRecording();
    });
});

[...document.getElementsByClassName("stop-record")].forEach(elem => {
    elem.addEventListener("click", () => {
        console.log("Button stop recording pressed");
        document.getElementById("stop-recording-section").style.display = "none";
        document.getElementById("gif-recorded-section").style.display = "grid";
        document.querySelector("#div-video video").style.display = "none";
        document.getElementById("gif-preview").style.display = "block";
        changeElementContent("rec-guifo-title", "Vista Previa");
        stopRecording();
    });
});

document.getElementById("save-guifo-button").addEventListener("click", () => {
    document.querySelector("video").style.display = "none";
    document.getElementById("uploading-guifo-section").style.display = "grid";
    changeElementContent("rec-guifo-title", "Subiendo Guifo");
    document.getElementById("gif-recorded-section").style.display = "none";
    document.getElementById("cancel-uploading").style.display = "block";
    document.getElementById("gif-preview").style.display = "none";
    uploadGuifo();
});

document.getElementById("restart-recording-button").addEventListener("click", () => {
    recorder = null;
    blob = null;
    document.getElementById("gif-recorded-section").style.display = "none";
    document.getElementById("recording-buttons").style.display = "grid";
    document.querySelector("#div-video video").style.display = "block";
    document.getElementById("gif-preview").style.display = "none";
});

document.getElementById("uploaded-done-button").addEventListener("click", () => {
    window.location.href = "./mis_guifos.html";
});

/**
 * This function sets the HTML element content.
 * @param {string} id The HTML id element
 * @param {string} content The new content.
 */
const changeElementContent = (id, content) => {
    document.getElementById(id).innerText = content;
}

/**
 * Starts the stream Promise
 */
const startStream = () => {
    return navigator.mediaDevices.getUserMedia({ video: true });
}

/**
 * This function turns on the web cam.
 */
const showWebCamVideo = () => {
    startStream()
        .then((mediaStream) => {
            var video = document.querySelector('video');
            video.srcObject = mediaStream;
            video.onloadedmetadata = _ => { video.play(); };
        })
        .catch((error) => console.log(`${error.name}:${error.message}`));
}

/**
 * This object creates a nuew RecordRTC object that allow us to capture video as gif.
 */
const createRecorderRTCObject = (stream) => {
    return new RecordRTC(stream,
        {
            type: 'gif',
            frameRate: 1,
            quality: 10,
            width: 360,
            hidden: 240,
            onGifRecordingStarted: function () {
                console.log('Recording started')
            }
        }
    )
}

/**
 * This function starts the recording Promise to capture video through web cam.
 */
const startRecording = async () => {
    const stream = await startStream();
    recorder = createRecorderRTCObject(stream);
    recorder.startRecording();
}

/**
 * This function stops capturing the gif video.
 */
const stopRecording = async () => {
    recorder.stopRecording(() => {
        blob = recorder.getBlob();
        gifLocalUrl = URL.createObjectURL(blob);
        document.getElementById("gif-preview").setAttribute("src", gifLocalUrl);
        document.getElementById("gif-preview").style.display = "block"
    });
}

/**
 * This loads all necessary stuff on create_guifos page.
 */
const onLoadCreateGuifos = () => {
    changeTheme(getActualThemeFromLS());
    hideOrDisplayElement("back-arrow", "block");
    showWebCamVideo();
}

/**
 * 
 */
const uploadGuifo = () => {
    fetch("https://upload.giphy.com/v1/gifs?api_key=sOVe2WHH24F3yDpkJH5gNryTxaEt4CmN", {
        method: "POST",
        body: blob,
        headers: {
            "Access-Control-Allow-Origin": "*"
        }
    })
        .then(response => {
            return response.json();
        })
        .then(response => {
            if (!window.localStorage.getItem("gifs")) {
                window.localStorage.setItem("gifs", "{gifs:[]}")
            }
            let localStorageGifs = JSON.parse(window.localStorage.getItem("gifs"));
            localStorageGifs.gifs.push(response["response_id"]);
            window.localStorage.setItem("gifs", JSON.stringify(localStorageGifs));
            document.getElementById("div-video").style.display = "none";
            document.getElementById("cancel-uploading").style.display = "none";
            document.getElementById("guifo-uploaded").style.display = "grid";
            document.querySelector("#guifo-uploaded img").setAttribute("src", gifLocalUrl);
            recorder = null;
            blob = null;
        })
        .catch(error => {
            throw new Error(`Error uploading the gif: ${error}`)
        })
}