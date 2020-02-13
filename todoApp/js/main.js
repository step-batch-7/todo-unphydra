/* eslint-disable no-unused-vars */
const main = function() {
  addEventListenerToInput();
  get('/status', showTodoOnLoad);
};

document.onload = main;

const showTodoOnLoad = function(req) {
  const allTodoList = getAllTodoList();
  const innerHTML = todoCards(req.response);
  allTodoList.innerHTML = innerHTML;
};

const getBigCard = () => document.getElementById('bigCard');
const getContainer = () => document.getElementById('container');
const getAllTodoList = () => document.getElementById('allTodoList');
const getElement = id => document.getElementById(id);
const getChildTick = id => {
  const first = 0;
  return document.getElementById(id).children[first].children[first];
};
const getArray = classes => Array.from(classes);
const getElements = (box, name) => box.getElementsByClassName(name);

const enableFocus = function(id) {
  const itemList = document.getElementById(id);
  itemList.lastElementChild.focus();
};

const toggleVisibilityOfCard = function(card) {
  const container = getContainer();
  const classes = getArray(card.classList);
  if (classes.includes('noneDisplay')) {
    card.classList.remove('noneDisplay');
    container.classList.add('bigCardOn');
    return;
  }
  card.innerHTML = '';
  card.classList.add('noneDisplay');
  container.classList.remove('bigCardOn');
};

const enableBorder = function(div) {
  div.parentElement.classList.add('inputEnable');
  div.focus();
};

const addEventListenerToInput = function() {
  const inputsBox = getArray(getElements(document, 'searchInput'));
  inputsBox.forEach(box => {
    box.addEventListener('focus', addFocusEvent.bind(null, box));
    box.addEventListener('focusout', removeFocusEvent.bind(null, box));
  });
};

const addFocusEvent = function(box) {
  box.parentElement.classList.add('marginZero');
};

const removeFocusEvent = function(box) {
  box.parentElement.classList.remove('marginZero');
};
