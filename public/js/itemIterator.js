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
  const enterKeyCode = 13;
  if (event.keyCode === enterKeyCode) {
    if (div.value === '') {
      alert('please give a item name');
      return;
    }
    const data = { id, item: div.value };
    const content = JSON.stringify(data);
    div.value = '';
    post('/addItem', content, addItemToList);
  }
};

const removeItemFormList = function(req) {
  const item = getElement(req.response.id);
  item.remove();
};

const deleteItem = function(id) {
  const content = JSON.stringify({ id });
  post('/deleteItem', content, removeItemFormList);
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

const sendTickStatus = function(id, status) {
  const content = JSON.stringify({ id, status: status });
  post('/itemTickStatus', content, 'application/json', () => {});
};

const modifyItemList = function(req) {
  const div = getElement(req.response.item.id);
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
  post('/updateItem', content, modifyItemList);
};
