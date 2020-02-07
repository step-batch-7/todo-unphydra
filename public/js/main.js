const main = function() {
  getStatus();
};

const sendHttpReq = function(
  method,
  url,
  data,
  expectType,
  contentType,
  callback
) {
  const req = new XMLHttpRequest();
  req.onload = () => {
    callback(req);
  };
  req.open(method, url);
  if (expectType) {
    req.responseType = expectType;
  }
  if (data) {
    req.setRequestHeader('Content-Type', contentType);
    req.send(data);
    return;
  }
  req.send();
};

const getBigCard = () => document.getElementById('bigCard');
const getContainer = () => document.getElementById('container');
const getAllTodoList = () => document.getElementById('allTodoList');
const getElement = id => document.getElementById(id);
const getChildTick = id =>
  document.getElementById(id).children[0].children[0];
const getArray = classes => Array.from(classes);

const getStatus = function() {
  sendHttpReq('GET', '/status', null, 'json', null, showTodoOnLoad);
};

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

const takeItem = function(div, id) {
  if (event.keyCode === 13) {
    if (div.value === '') {
      alert('please give a item name');
      return;
    }
    const data = { id, item: div.value };
    const content = JSON.stringify(data);
    div.value = '';
    sendHttpReq(
      'POST',
      '/addItem',
      content,
      'json',
      'application/json',
      addItemToList
    );
  }
};

const enableFocus = function(id) {
  const itemList = document.getElementById(id);
  itemList.lastElementChild.focus();
};

const showTodoList = function(req) {
  const card = getBigCard();
  card.innerHTML = todoBox(req.response);
};

const takeTitle = function() {
  const value = document.getElementById('titleInput').value;
  if (value === '') {
    alert('please give a title');
    return;
  }
  const content = JSON.stringify({ title: value });
  sendHttpReq(
    'POST',
    '/title',
    content,
    'json',
    'application/json',
    showTodoList
  );
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

const closeCard = function() {
  sendHttpReq('GET', '/status', null, 'json', null, showTodos);
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

const getCardDetails = function() {
  const content = JSON.stringify({ id: event.target.id });
  sendHttpReq(
    'POST',
    '/cardDetails',
    content,
    'json',
    'application/json',
    renderTodoInBigCard
  );
};

const removeItemFormList = function(req) {
  const item = getElement(req.response.id);
  item.remove();
};

const deleteItem = function(id) {
  const content = JSON.stringify({ id });
  sendHttpReq(
    'POST',
    '/deleteItem',
    content,
    'json',
    'application/json',
    removeItemFormList
  );
};

let selectedTodos = [];

const removeFromSelected = function(id) {
  const index = selectedTodos.indexOf(id);
  const noOfIterate = 1;
  selectedTodos.splice(index, noOfIterate);
};

const toggleSelection = function(tickDiv, id) {
  const todoCard = getElement(id);
  if (selectedTodos.includes(id)) {
    todoCard.classList.remove('topTickClick');
    tickDiv.classList.remove('topTickVisibility');
    removeFromSelected(id);
    return;
  }
  todoCard.classList.add('topTickClick');
  tickDiv.classList.add('topTickVisibility');
  selectedTodos.push(id);
};

const removeTodosFromList = function(req) {
  console.log(req.response);

  req.response.forEach(id => {
    const todo = getElement(`${id}-par`);
    todo.remove();
  });
};

const deletTodos = function() {
  const content = JSON.stringify(selectedTodos);
  selectedTodos = [];
  sendHttpReq(
    'POST',
    '/deleteTodos',
    content,
    'json',
    'application/json',
    removeTodosFromList
  );
};

const sendTickStatus = function(id, status) {
  const content = JSON.stringify({ id, status: status });
  sendHttpReq(
    'POST',
    '/itemTickStatus',
    content,
    null,
    'application/json',
    () => {}
  );
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
  let div = getElement(req.response.item.id);
  div.innerHTML = genItemInnerHtml(req.response.item);
};

const updateItem = function(div, id) {
  if (div.value === '') {
    alert('please give a item name');
    return;
  }
  div.parentElement.classList.remove('inputEnable');
  const data = { id, item: div.value };
  const content = JSON.stringify(data);
  sendHttpReq(
    'POST',
    '/updateItem',
    content,
    'json',
    'application/json',
    modifyItemList
  );
};

const enableBorder = function(div) {
  div.parentElement.classList.add('inputEnable');
  div.focus();
};

const modifyTitle = function(input, req) {
  input.value = req.response.title;
};

const updateTitle = function(input, id) {
  if (input.value === '') {
    alert('please give a title');
    return;
  }
  const data = { id, title: input.value };
  const content = JSON.stringify(data);
  sendHttpReq(
    'POST',
    '/updateTitle',
    content,
    'json',
    'application/json',
    modifyTitle.bind(null, input)
  );
};
