/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
// eslint-disable-next-line prefer-const
let selectedTodoS = [];

const getBigCard = () => document.getElementById('bigCard');
const getContainer = () => document.getElementById('container');
const getAllTodoList = () => document.getElementById('allTodoList');
const getElement = id => document.getElementById(id);
const getChildTick = id => {
  const first = 0;
  document.getElementById(id).children[first].children[first];
};
const getArray = classes => Array.from(classes);

const showTodoOnLoad = function(req) {
  const allTodoList = getAllTodoList();
  const innerHTML = todoCards(req.response);
  allTodoList.innerHTML = innerHTML;
};

const addItemToList = function(req) {
  const itemList = getElement(req.response.id);
  const div = document.createElement('div');
  div.classList.add('eachItem');
  div.id = req.response.item.id;
  div.innerHTML = genItemInnerHtml(req.response.item);
  itemList.appendChild(div);
  itemList.scrollTop = itemList.scrollHeight;
};

const enableFocus = function(id) {
  const itemList = document.getElementById(id);
  itemList.lastElementChild.focus();
};

const showTodoList = function(req) {
  const card = getBigCard();
  card.innerHTML = todoBox(req.response);
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

const createNewTodo = function() {
  const card = getBigCard();
  toggleVisibilityOfCard(card);
  card.innerHTML = titleHtml;
  const titleInput = getElement('titleInput');
  titleInput.focus();
};

const showTodos = function(req) {
  const card = getBigCard();
  toggleVisibilityOfCard(card);
  const allTodoList = getAllTodoList();
  const innerHTML = todoCards(req.response);
  allTodoList.innerHTML = innerHTML;
};

const renderTodoInBigCard = function(req) {
  const card = getBigCard();
  toggleVisibilityOfCard(card);
  card.innerHTML = todoBox(req.response);
};

const removeItemFormList = function(req) {
  const item = getElement(req.response.id);
  item.remove();
};

const removeFromSelected = function(id) {
  const index = selectedTodoS.indexOf(id);
  const noOfIterate = 1;
  selectedTodoS.splice(index, noOfIterate);
};

const toggleSelection = function(tickDiv, id) {
  const todoCard = getElement(id);
  if (selectedTodoS.includes(id)) {
    todoCard.classList.remove('topTickClick');
    tickDiv.classList.remove('topTickVisibility');
    removeFromSelected(id);
    return;
  }
  todoCard.classList.add('topTickClick');
  tickDiv.classList.add('topTickVisibility');
  selectedTodoS.push(id);
};

const removeTodosFromList = function(req) {
  req.response.forEach(id => {
    const todo = getElement(`${id}-par`);
    todo.remove();
  });
};

const toggleDone = function(id) {
  const tick = getChildTick(id);
  const classes = getArray(tick.classList);
  if (classes.includes('notVisible')) {
    tick.classList.remove('notVisible');
    sendTickStatus(id, true);
    return;
  }
  sendTickStatus(id, false);
  tick.classList.add('notVisible');
};

const modifyItemList = function(req) {
  const div = getElement(req.response.item.id);
  div.innerHTML = genItemInnerHtml(req.response.item);
};

const enableBorder = function(div) {
  div.parentElement.classList.add('inputEnable');
  div.focus();
};

const modifyTitle = function(input, req) {
  input.value = req.response.title;
};
