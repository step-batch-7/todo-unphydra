const main = function() {
  sendHttpReq('GET', '/status', null, 'json', null, showTodoOnLoad);
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
const getTodoCard = id => document.getElementById(id);

const showTodoOnLoad = function(req) {
  const allTodoList = getAllTodoList();
  const innerHTML = todoCards(req.response);
  allTodoList.innerHTML = innerHTML;
};

const takeItem = function(div) {
  const id = div.parentElement.id;
  if (event.keyCode === 13) {
    if (div.value === '') {
      alert('please give a item name');
      return;
    }
    const data = { id, item: div.value };
    const content = JSON.stringify(data);
    sendHttpReq(
      'POST',
      '/addItem',
      content,
      'json',
      'application/json',
      showTodoList
    );
  }
};

const showTodoList = function(req) {
  const card = getBigCard();
  const html = todoBox(req.response);
  card.innerHTML = html;
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
  const classes = Array.from(card.classList);
  if (classes.includes('noneDisplay')) {
    card.classList.remove('noneDisplay');
    container.classList.add('bigCardOn');
    return;
  }
  card.classList.add('noneDisplay');
  container.classList.remove('bigCardOn');
};

const createNewTodo = function() {
  const card = getBigCard();
  toggleVisibilityOfCard(card);
  card.innerHTML = titleHtml;
};

const closeCard = function() {
  sendHttpReq('GET', '/status', null, 'json', null, showTodos);
};

const showTodos = function(req) {
  const card = getBigCard();
  card.innerHTML = '';
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

const deleteItem = function() {
  const [id] = event.target.id.split('-');
  const content = JSON.stringify({ id });
  sendHttpReq(
    'POST',
    '/deleteItem',
    content,
    'json',
    'application/json',
    showTodoList
  );
};

const selectedTodos = [];

const removeFromSelected = function(id) {
  const index = selectedTodos.indexOf(id);
  const noOfIterate = 1;
  selectedTodos.splice(index, noOfIterate);
};

const toggleSelection = function(tickDiv, id) {
  const todoCard = getTodoCard(id);
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
