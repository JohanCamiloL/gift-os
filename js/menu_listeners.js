const changeDisplayDropdownTheme = () => {
    let elem = document.getElementById("dropdown-theme");
    if (elem.style.display === "") {
        elem.style.display = "grid";
    } else if (elem.style.display === "grid") {
        elem.style.display = "";
    }
}

document.getElementById("dropdown").addEventListener("click", changeDisplayDropdownTheme);

document.getElementById("button-day").addEventListener("click", () => {
    changeTheme("light-theme");
    changeDisplayDropdownTheme()
});

document.getElementById("button-night").addEventListener("click", () => {
    changeTheme("dark-theme");
    changeDisplayDropdownTheme()
});

document.getElementById("crear-guifos").addEventListener("click", () => {
    window.location.href = "./mis_guifos.html";
    window.localStorage.setItem("create-guifo-state", true);
});

document.getElementById("mis-guifos-button").addEventListener("click", () => {
    window.localStorage.setItem("create-guifo-state", false);
    document.getElementById("crear-guifo-window").style.display = "none";
});

[...document.getElementsByClassName("page-logo")].forEach(elem => {
    elem.addEventListener("click", () => {
        window.location.href = "./";
    });
});