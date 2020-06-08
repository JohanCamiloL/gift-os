"use strict";
const searchResultElements = [...document.querySelectorAll("#search-result p")];

document.getElementById("search-gif-input").addEventListener("input", async (elem) => {
    const searchButton = document.getElementById("search-gif-button");
    const value = elem.target.value;
    if (value !== "") {
        searchButton.disabled = false;
        hideOrDisplayElement("search-result", "grid");
        let searchResults = await getSimilarResults(value);

        searchResults.forEach((result, index) => searchResultElements[index].innerText = result);
    } else {
        searchButton.disabled = true;
        hideOrDisplayElement("search-result", "none");
    }
});

[...document.getElementById("search-result").childNodes]
    .filter(elem => elem.nodeName !== "#text")
    .forEach(elem => {
        elem.addEventListener("click", (e) => {
            hideOrDisplayElement("search-result", "none");
            document.getElementById("search-gif-input").value = e.target.innerText;
        });
    })

const relatedTags = [...document.querySelectorAll("#related-tags button")];

document.getElementById("search-gif-button").addEventListener("click", async () => {
    stateSuggestionsAndTendencies("none");
    hideOrDisplayElement("search-results", "block");
    hideOrDisplayElement("related-tags", "block");
    hideOrDisplayElement("search-result", "none");

    const searchedText = document.getElementById("search-gif-input").value;
    const relatedTerms = await getRelatedTerms(searchedText);

    relatedTerms.forEach((term, index) => relatedTags[index].innerText = `#${term}`);

    document.getElementById("search-word").innerText = searchedText;
    document.querySelector("#search-results .gifs-container").innerHTML = "";
    putSearchedGifsOnWebPage(searchedText);
});