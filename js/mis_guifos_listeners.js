document.getElementById("cancel-create-guifo").addEventListener("click", () => {
    document.getElementById("mis-guifos-button").click();
})

document.getElementById("start-create-guifo").addEventListener("click", () => {
    window.location.href = "./create_gif.html"
})

document.getElementById("mis-guifos-button").addEventListener("click", () => {
    document.getElementById("back-arrow").style.display = "none";
});

document.getElementById("back-arrow").addEventListener("click", () => {
    window.location.href = "./";
});