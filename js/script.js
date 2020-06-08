"use strict";
const GIF_URL = "https://api.giphy.com/v1/gifs";

/**
 * Set the class name on body element.
 * @param {string} theme The theme to be set on the web page.
 */
function changeTheme(theme) {
    window.localStorage.setItem("theme", theme);
    document.getElementsByTagName("body")[0].setAttribute("class", theme);
    changeLogo(theme);
}

/**
 * Set the logo image on web page.
 * @param {string} theme The theme to be set on web page.
 */
function changeLogo(theme) {
    if (theme === "dark-theme") {
        document.getElementById("day-logo").style.display = "none";
        document.getElementById("night-logo").style.display = "block";
    } else {
        document.getElementById("day-logo").style.display = "block";
        document.getElementById("night-logo").style.display = "none";
    }
}

/**
 * Creates an object from gif response.
 * @param {object} gif
 * @returns Gif object.
 */
const createGifObjectFromResponse = (gif) => {
    return {
        title: gif.title.split(" GIF")[0],
        src: gif.images["downsized_large"].url,
        link: gif.url
    }
}

/**
 * Makes a get request to Giphy API to obtain gifs.
 * @param {string} url Url where get request will be performed.
 * @return Gif objects.
 */
const getGifs = async (url) => {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        throw new Error(error);
    }
}

/**
 * Create gif elements from random Giphy to be displayed on suggestions section.
 * @returns An array with gif objects.
 */
const getSuggestionsGifs = async () => {
    const arrGifs = new Array();
    for (let i = 0; i < 4; i++) {
        const gif = await getGifs(`${GIF_URL}/random?api_key=sOVe2WHH24F3yDpkJH5gNryTxaEt4CmN`);
        arrGifs.push(createGifObjectFromResponse(gif.data));
    }
    return arrGifs;
}

/**
 * Get trending gif list from Giphy API.
 * @returns Objects list with usefull information about gifs
 */
const getTrendingGifs = async () => {
    const limit = Math.floor(Math.random() * (18)) + 8;
    const gifs = await getGifs(`${GIF_URL}/trending?api_key=sOVe2WHH24F3yDpkJH5gNryTxaEt4CmN&limit=${limit}`)
    return gifs.data.map(gif => createGifObjectFromResponse(gif));
}

/**
 * This function iterate over gif object list and call a function to locate every gif element on web page
 */
const putSuggestionGifsOnWebPage = async () => {
    const suggGifs = await getSuggestionsGifs();
    suggGifs.forEach(gif => createGifSuggestionElement(suggGifs.indexOf(gif) + 1, gif));
}

/**
 * This function 
 */
const putTrendingGifsOnWebPage = async () => {
    const trendGifs = await getTrendingGifs();
    trendGifs.forEach(gif => createGifElement(gif, "tendencies"));
}

/**
 * This function gets gifs in base a word
 * @param {*} word Word which gifs are searched.
 * @returns An Array of gif objects.
 */
const getSearchedGifs = async (word) => {
    const gifs = await getGifs(`${GIF_URL}/search?api_key=sOVe2WHH24F3yDpkJH5gNryTxaEt4CmN&q=${word}`);
    return gifs.data.map(gif => createGifObjectFromResponse(gif));
}

/**
 * Load suggestion and trending gifs on web page.
 */
const loadInitialGifs = () => {
    Promise.all([putSuggestionGifsOnWebPage(), putTrendingGifsOnWebPage()]);
}

/**
 * This gets the actual theme from Local Storage.
 */
const getActualThemeFromLS = () => {
    const themeLS = window.localStorage.getItem("theme");
    return themeLS ? themeLS : "light-theme";
}

/**
 * This loads all necessary stuff on index page.
 */
const onLoadIndex = () => {
    changeTheme(getActualThemeFromLS());
    loadInitialGifs();
}

/**
 * This loads all necessary stuff on mis_guifos page.
 */
const onLoadMisGuifos = () => {
    changeTheme(getActualThemeFromLS());
    createGifMenuState();
}

/**
 * Searchs and shows searched gifs on web page
 * @param {string} word Word which gifs are searcheds
 */
const putSearchedGifsOnWebPage = async (word) => {
    const searchedGifs = await getSearchedGifs(word);
    searchedGifs.forEach(gif => createGifElement(gif, "search-results"));
}

/**
 * This function creates and places an HTML element for gif image and info.
 * @param {object} gifElement Gif object.
 * @param {string} section Section where gif will pe placed.
 */
const createGifElement = (gifElement, section) => {
    const divElement = createHtmlElement("div", ["gif"]);
    const imgElement = createGifImage(gifElement.src, "Gif image", ["gif-image"]);
    const pContent = gifElement.title.split(" ").map(word => `#${word} `).join("").toLowerCase();
    const pElement = createHtmlElement("p", ["gif-hashtags"], "", pContent);

    divElement.appendChild(imgElement);
    divElement.appendChild(pElement);

    document.getElementById(section).lastElementChild.appendChild(divElement);
}

/**
 * This function creates and adds a element which contains the gif information.
 * @param {number} position   Position in which the element will be added.
 * @param {object} gifElement The gif object
 */
const createGifSuggestionElement = (position, gifElement) => {
    const divElement = createHtmlElement("div", ["gif-info", `column-start-${position}`], "", "");
    const pElement = createHtmlElement("p", [], "", `#${gifElement.title}`);
    const gifPlace = createHtmlElement("div", ["gif-place"]);
    const buttonGif = createHtmlElement("button", [], "", "Ver más...");
    const gifImage = createGifImage(gifElement.src);
    const closeGifButton = createHtmlElement("button", [], "", "X");


    divElement.appendChild(pElement);
    gifPlace.appendChild(buttonGif);
    gifPlace.appendChild(gifImage);
    divElement.appendChild(gifPlace);
    divElement.appendChild(closeGifButton);
    document.getElementById("suggestions").lastElementChild.appendChild(divElement);
}

/**
 * This function creates a certain HTML element to be added on DOM.
 * @param {string} element Name of element to be created
 * @param {Array} classes  List of classes which the element belongs.
 * @param {string} id           HTML element ID.
 * @param {string} content      Text content that belongs to the element.
 * @returns A new HTML element.
 */
function createHtmlElement(element, classes = [], id = "", content = "") {
    let elem = document.createElement(element);

    classes.forEach(classItem => {
        elem.classList.add(classItem);
    });

    elem.id = id;
    elem.textContent = content;

    return elem;
}

/**
 * This function creates an image HTML element.
 * @param {string} source The image source url.
 * @param {string} alt    The image alt text.
 * @returns A image HTML element.
 */
function createGifImage(source, alt = "Altern text for image", classes = []) {
    let htmlElement = createHtmlElement("img", classes, "", "");
    htmlElement.setAttribute("src", source);
    htmlElement.setAttribute("alt", alt);
    return htmlElement;
}

/**
 * This functions displays or hide create gif menu.
 */
const createGifMenuState = () => {
    const displayState = window.localStorage.getItem("create-guifo-state");
    document.getElementById("crear-guifo-window").style.display = displayState === "true" ? "grid" : "none";
    document.getElementById("back-arrow").style.display = displayState === "true" ? "block" : "none";
}

function stateSuggestionsAndTendencies(displayState) {
    document.getElementById("suggestions").style.display = displayState;
    document.getElementById("tendencies").style.display = displayState;
}

function hideOrDisplayElement(elementId, displayState) {
    document.getElementById(elementId).style.display = displayState;
}