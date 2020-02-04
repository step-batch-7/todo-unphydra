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

const showTodoList = function(req) {
  const card = document.getElementById('bigCard');
  card.innerHTML = req.responseText;
};

const takeTitle = function() {
  const value = document.getElementById('titleInput').value;
  sendHttpReq(
    'POST',
    '/title',
    `title=${value}`,
    null,
    'application/x-www-form-urlencoded',
    showTodoList
  );
};

const createNewTodo = function() {
  const card = document.getElementById('bigCard');
  card.style.display = 'block';
  card.innerHTML = titleHtml;
};

const titleHtml = `<div class="writeTitle">write Title</div>
<input type="text" id="titleInput" />
<button id="done" onclick="takeTitle()">Done</button>`;
