"use strict";
document.getElementById("search-gif-input").addEventListener("input", (elem) => {
    if (elem.target.value !== "") {
        document.getElementById("search-gif-button").disabled = false;
        hideOrDisplayElement("search-result", "grid");
    } else {
        document.getElementById("search-gif-button").disabled = true;
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

document.getElementById("search-gif-button").addEventListener("click", () => {
    stateSuggestionsAndTendencies("none");
    hideOrDisplayElement("search-results", "block");
    hideOrDisplayElement("related-tags", "block");
    hideOrDisplayElement("search-result", "none");

    const searchedText = document.getElementById("search-gif-input").value;

    document.getElementById("search-word").innerText = searchedText;
    document.querySelector("#search-results .gifs-container").innerHTML = "";
    putSearchedGifsOnWebPage(searchedText);
});