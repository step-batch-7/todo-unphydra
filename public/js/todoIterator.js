/* eslint-disable no-unused-vars */
let selectedTodoS = [];

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
  post('/title', content, showTodoList);
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

const closeCard = function() {
  get('/status', showTodos);
};

const renderTodoInBigCard = function(req) {
  const card = getBigCard();
  toggleVisibilityOfCard(card);
  card.innerHTML = todoBox(req.response);
};

const getCardDetails = function() {
  const content = JSON.stringify({ id: event.target.id });
  post('/cardDetails', content, renderTodoInBigCard);
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

const deleteTodos = function() {
  const content = JSON.stringify(selectedTodoS);
  selectedTodoS = [];
  post('/deleteTodos', content, removeTodosFromList);
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
  post('/updateTitle', content, modifyTitle.bind(null, input));
};
