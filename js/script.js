let ACTUAL_THEME = "day";

function changeTheme() {
    let arr = [["day-background-image", "night-background-image"],
    ["day-color-body", "night-color-body"],
    ["day-menu-button-color", "night-menu-button-color"],
    ["day-menu-a", "night-menu-a"],
    ["day-background-search-menu", "night-background-search-menu"],
    ["day-suggestions-p", "night-suggestions-p"],
    ["day-suggestions-div", "night-suggestions-div"],
    ["day-search-button", "night-search-button"]];

    getClassesToRepaceThem(ACTUAL_THEME, arr);
}

function getClassesToRepaceThem(theme, arrClasses) {
    arrClasses.forEach(classPair => {
        if (theme === "day") {
            ACTUAL_THEME = "night";
            let arr = document.getElementsByClassName(classPair[0]);
            replaceNameClass(arr, classPair[0], classPair[1]);
        } else {
            ACTUAL_THEME = "day";
            let arr = document.getElementsByClassName(classPair[1]);
            replaceNameClass(arr, classPair[1], classPair[0]);
        }
    })
}

function replaceNameClass(arr, oldClass, newClass) {
    while (arr.length !== 0) {
        arr[0].classList.replace(oldClass, newClass);
        arr = document.getElementsByClassName(oldClass);
    }
}