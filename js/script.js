const GIF_URL = 'https://api.giphy.com/v1';
const API_KEY = 'sOVe2WHH24F3yDpkJH5gNryTxaEt4CmN';

/**
 * Set the logo image on web page.
 * @param {string} theme The theme to be set on web page.
 */
const changeLogo = (theme) => {
  if (theme === 'dark-theme') {
    setDisabledState('day-logo');
    setDisabledState('night-logo', 'block');
  } else {
    setDisabledState('day-logo', 'block');
    setDisabledState('night-logo');
  }
};

/**
 * Set the class name on body element.
 * @param {string} theme The theme to be set on the web page.
 */
const changeTheme = (theme) => {
  window.localStorage.setItem('theme', theme);
  document.querySelector('body').setAttribute('class', theme);
  changeLogo(theme);
};

/**
 * This function gets similar words as word provided.
 * @param {string} word The word to compare.
 * @returns A list of strings.
 */
const getSimilarResults = async (word) => {
  const response = await getRequest(
    `${GIF_URL}/gifs/search/tags?api_key=${API_KEY}&q=${word}`,
  );
  return response.data.map((word) => word.name).slice(0, 3);
};

/**
 * Ths function gets related terms from a given word.
 * @param {string} word Word to search related terms.
 * @returns A list of strings.
 */
const getRelatedTerms = async (word) => {
  const response = await getRequest(
    `${GIF_URL}/tags/related/${word}?api_key=${API_KEY}`,
  );
  return response.data.map((word) => word.name).slice(0, 3);
};

/**
 * Creates an object from gif response.
 * @param {object} gif
 * @returns Gif object.
 */
const createGifObjectFromResponse = (gif) => ({
  title: gif.title.split(' GIF')[0],
  src: gif.images.fixed_width_downsampled.url,
  link: gif.url,
});

/**
 * Create gif elements from random Giphy to be displayed on suggestions section.
 * @returns An array with gif objects.
 */
const getSuggestionsGifs = async () => {
  const arrGifs = [];
  const URL = `${GIF_URL}/gifs/random?api_key=${API_KEY}`;
  for (let i = 0; i < 4; i += 1) {
    const gif = await getRequest(URL);
    arrGifs.push(createGifObjectFromResponse(gif.data));
  }
  return arrGifs;
};

/**
 * Get trending gif list from Giphy API.
 * @returns Objects list with usefull information about gifs
 */
const getTrendingGifs = async () => {
  const limit = Math.floor(Math.random() * 18) + 8;
  const URL = `${GIF_URL}/gifs/trending?api_key=${API_KEY}&limit=${limit}`;
  const gifs = await getRequest(URL);

  return gifs.data.map((gif) => createGifObjectFromResponse(gif));
};

/**
 * This function creates and adds a element which contains the gif information.
 * @param {number} position   Position in which the element will be added.
 * @param {object} gifElement The gif object
 */
const createGifSuggestionElement = (position, gifElement) => {
  const divElement = createHtmlElement('div', ['gif-info', `column-start-${position}`], '', '');
  const pElement = createHtmlElement('p', [], '', `#${gifElement.title}`);
  const gifPlace = createHtmlElement('div', ['gif-place']);
  const buttonGif = createHtmlElement('button', [], '', 'Ver más...');
  const gifImage = createGifImage(gifElement.src);
  const closeGifButton = createHtmlElement('button', [], '', 'X');

  divElement.appendChild(pElement);
  gifPlace.appendChild(buttonGif);
  gifPlace.appendChild(gifImage);
  divElement.appendChild(gifPlace);
  divElement.appendChild(closeGifButton);
  document.getElementById('suggestions').lastElementChild.appendChild(divElement);
};

/**
 * This function iterate over gif object list and call a function to locate every gif element on
 * web page
 */
const putSuggestionGifsOnWebPage = async () => {
  const suggGifs = await getSuggestionsGifs();
  suggGifs.forEach((gif) => createGifSuggestionElement(suggGifs.indexOf(gif) + 1, gif));
};

/**
 * This function
 */
const putTrendingGifsOnWebPage = async () => {
  const trendGifs = await getTrendingGifs();
  trendGifs.forEach((gif) => createGifElement(gif, 'tendencies'));
};

/**
 * This function gets gifs in base a word
 * @param {string} word Word which gifs are searched.
 * @returns An Array of gif objects.
 */
const getSearchedGifs = async (word) => {
  const gifs = await getRequest(
    `${GIF_URL}/gifs/search?api_key=${API_KEY}&q=${word}`,
  );
  return gifs.data.map((gif) => createGifObjectFromResponse(gif));
};

/**
 * Load suggestion and trending gifs on web page.
 */
const loadInitialGifs = () => {
  Promise.all([putSuggestionGifsOnWebPage(), putTrendingGifsOnWebPage()]);
};

/**
 * This loads all necessary stuff on index page.
 */
const onLoadIndex = () => {
  changeTheme(getActualThemeFromLS());
  loadInitialGifs();
};

/**
 * This loads all necessary stuff on mis_guifos page.
 */
const onLoadMisGuifos = () => {
  changeTheme(getActualThemeFromLS());
  createGifMenuState();
  loadMisGuifos();
};

const loadMisGuifos = async () => {
  const object = JSON.parse(window.localStorage.getItem('gifs'));
  const idsArray = object.gifs;
  const ids = idsArray.join(',');

  const gifs = await getRequest(`${GIF_URL}/gifs?api_key=${API_KEY}&ids=${ids}`);
  const gifObjects = gifs.data.map((gif) => createGifObjectFromResponse(gif));

  const images = gifObjects.map((gif) => createGifImage(gif.src, 'Gif image'));
  images.forEach((image) => document.querySelector('#mis-guifos div').appendChild(image));
};

/**
 * Searchs and shows searched gifs on web page
 * @param {string} word Word which gifs are searcheds
 */
const putSearchedGifsOnWebPage = async (word) => {
  const searchedGifs = await getSearchedGifs(word);
  searchedGifs.forEach((gif) => createGifElement(gif, 'search-results'));
};

/**
 * This function creates and places an HTML element for gif image and info.
 * @param {object} gifElement Gif object.
 * @param {string} section Section where gif will pe placed.
 */
const createGifElement = (gifElement, section) => {
  const divElement = createHtmlElement('div', ['gif']);
  const imgElement = createGifImage(gifElement.src, 'Gif image', ['gif-image']);
  const pContent = gifElement.title.split(' ').map((word) => `#${word} `).join('').toLowerCase();
  const pElement = createHtmlElement('p', ['gif-hashtags'], '', pContent);

  divElement.appendChild(imgElement);
  divElement.appendChild(pElement);

  document.getElementById(section).lastElementChild.appendChild(divElement);
};

/**
 * This function creates an image HTML element.
 * @param {string} source The image source url.
 * @param {string} alt    The image alt text.
 * @returns A image HTML element.
 */
function createGifImage(source, alt = 'Altern text for image', classes = []) {
  const htmlElement = createHtmlElement('img', classes, '', '');
  htmlElement.setAttribute('src', source);
  htmlElement.setAttribute('alt', alt);
  return htmlElement;
}

/**
 * This functions displays or hide create gif menu.
 */
const createGifMenuState = () => {
  const displayState = window.localStorage.getItem('create-guifo-state');
  document.getElementById('crear-guifo-window').style.display = displayState === 'true' ? 'grid' : 'none';
  document.getElementById('back-arrow').style.display = displayState === 'true' ? 'block' : 'none';
};
