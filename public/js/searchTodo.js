const getElements = (box, name) => box.getElementsByClassName(name);

const getTitle = todo => todo.lastElementChild.firstElementChild.innerText;

const getName = item => item.lastElementChild.innerText;

const isTitleMatch = function(text, todo) {
  const title = getTitle(todo);
  return title.includes(text);
};

const isItemNameMatched = function(text, item) {
  const name = getName(item);
  return name.includes(text);
};

const isTodoOfItemMatched = function(text, todo) {
  const allItem = getArray(getElements(todo, 'todo-eachItem'));
  allItem.forEach(item => {
    item.style.display = 'none';
  });
  const filteredItem = allItem.filter(isItemNameMatched.bind(null, text));
  filteredItem.forEach(item => {
    item.style.display = '';
  });
  return filteredItem.length;
};

const searchTodoByTitle = function(input) {
  const text = input.value;
  const allTodo = getArray(getElements(document, 'cardBox'));
  allTodo.forEach(todo => {
    todo.style.display = 'none';
  });
  const filteredTodo = allTodo.filter(isTitleMatch.bind(null, text));
  filteredTodo.forEach(todo => {
    todo.style.display = 'block';
  });
};

const searchItemInTodo = function(input) {
  const text = input.value;
  const allTodo = getArray(getElements(document, 'cardBox'));
  allTodo.forEach(todo => {
    todo.style.display = 'none';
  });
  const filteredTodo = allTodo.filter(
    isTodoOfItemMatched.bind(null, text)
  );
  filteredTodo.forEach(todo => {
    todo.style.display = 'block';
  });
};
