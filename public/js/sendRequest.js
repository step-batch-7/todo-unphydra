/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
// eslint-disable-next-line max-params
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

const getStatus = function() {
  sendHttpReq('GET', '/status', null, 'json', null, showTodoOnLoad);
};

const takeItem = function(div, id) {
  const enterKeyCode = 13;
  if (event.keyCode === enterKeyCode) {
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

const closeCard = function() {
  sendHttpReq('GET', '/status', null, 'json', null, showTodos);
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

const deleteTodos = function() {
  const content = JSON.stringify(selectedTodoS);
  // eslint-disable-next-line no-implicit-globals
  selectedTodoS = [];
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
