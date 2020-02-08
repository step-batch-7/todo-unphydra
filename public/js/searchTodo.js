const getElements = name => document.getElementsByClassName(name);

const getTitle = todo => todo.lastElementChild.firstElementChild.innerText;

const isTitleMatch = function(text, todo) {
  const title = getTitle(todo);
  return title.includes(text);
};

const searchTodo = function(input) {
  const text = input.value;
  const allTodo = getArray(getElements('cardBox'));
  allTodo.forEach(todo => {
    todo.style.display = 'none';
  });
  const filteredTodo = allTodo.filter(isTitleMatch.bind(null, text));

  filteredTodo.forEach(todo => {
    todo.style.display = 'block';
  });
};
