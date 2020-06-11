/**
 * Set the disable property from a given element ID.
 * @param {string} elementId HTML id Element.
 * @param {string} displayType The display type.
 */
const setDisabledState = (elementId, displayType = "none") => {
  document.getElementById(elementId).style.display = displayType;
};

/**
 * Sets the display property from a given element
 * @param {string} elementId HTML element id.
 * @param {string} value     New display value.
 */
const setDisplayValue = (elementId, value = "none") => {
  document.getElementById(elementId).style.display = value;
};

/**
 * Makes an HTTP get request to a given URL.
 * @param {string} url Url where get request will be performed.
 * @return JSON object.
 */
const getRequest = async (url) => {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * Get the actual theme set on Local Storage.
 */
const getActualThemeFromLS = () => {
  const themeLS = window.localStorage.getItem("theme");
  return themeLS ? themeLS : "light-theme";
};

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

  classes.forEach((classItem) => {
    elem.classList.add(classItem);
  });

  elem.id = id;
  elem.textContent = content;

  return elem;
}

/**
 * Gets and returns a list object of HTML elements.
 * @param {string} query CSS query to select HTML elements.
 * @returns List of HTML elements.
 */
const getHtmlElementsList = (query) => [...document.querySelectorAll(query)];
