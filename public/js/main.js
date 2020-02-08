/* eslint-disable no-unused-vars */
const main = function() {
  get('/status', showTodoOnLoad);
};

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

document.onload = main;
