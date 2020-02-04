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

const takeItem = function(div) {
  const id = div.parentElement.id;
  if (event.keyCode === 13) {
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
  const res = req.response;
  const html = todoBox(res);
  const card = document.getElementById('bigCard');
  card.innerHTML = html;
};

const takeTitle = function() {
  const value = document.getElementById('titleInput').value;
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

const createNewTodo = function() {
  const card = document.getElementById('bigCard');
  card.style.display = 'block';
  card.innerHTML = titleHtml;
};
