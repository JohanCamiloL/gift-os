/* eslint-disable linebreak-style */
const searchButton = document.getElementById('search-gif-button');
const searchResult = document.getElementById('related-search-words');
const searchInput = document.getElementById('search-gif-input');

/**
 * Show or hide some elements on search section when is active or not.
 * @param {string} inputText Actual text on input element.
 */
const setSearchInputElements = async (inputText) => {
  searchButton.disabled = !inputText;
  await setSimilarResultElementsValue(inputText);
  setDisplayValue('related-search-words', inputText ? 'grid' : 'none');
};

/**
 * Sets the value on similar results elements from given word.
 * @param {string} inputText Word to search similar results.
 */
const setSimilarResultElementsValue = async (inputText) => {
  const searchResultElements = [
    ...document.querySelectorAll('#related-search-words p'),
  ];
  const searchResults = await getSimilarResults(inputText);
  searchResults.forEach((result, index) => (searchResultElements[index].innerText = result));
};

/**
 * This function hide and display necessary HTML elements to show the searched gifs.
 */
const displaySearchElements = () => {
  setDisplayValue('tendencies');
  setDisplayValue('suggestions');
  setDisplayValue('related-search-words');
  setDisplayValue('search-results', 'block');
  setDisplayValue('related-tags', 'block');
};

const showSearchedGifs = async () => {
  const relatedTags = getHtmlElementsList('#related-tags button');
  const searchedText = searchInput.value;
  const relatedTerms = await getRelatedTerms(searchedText);

  relatedTerms.forEach((term, index) => (relatedTags[index].innerText = `#${term}`));

  document.getElementById('search-word').innerText = searchedText;
  document // This deletes old gif elements.
    .querySelector('#search-results .gifs-container').innerHTML = '';
  putSearchedGifsOnWebPage(searchedText);

  displaySearchElements();
};

searchInput.addEventListener('input', (e) => setSearchInputElements(e.target.value));

searchResult.addEventListener('click', (e) => {
  if (e.target.matches('p')) {
    setDisplayValue('related-search-words', 'none');
    searchInput.value = e.target.innerText;
  }
});

searchButton.addEventListener('click', showSearchedGifs);
