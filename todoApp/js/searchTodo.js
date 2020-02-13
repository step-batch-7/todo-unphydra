const getTitle = todo => todo.lastElementChild.firstElementChild.innerText;

const getName = item => item.lastElementChild.innerText;

const isTextMatch = function(searchText, getContent, target) {
  const content = getContent(target);
  return content.includes(searchText);
};

const isTodoOfItemMatched = function(searchText, todo) {
  return searchAndShow(
    todo,
    isTextMatch.bind(null, searchText, getName),
    'todo-eachItem'
  );
};

const searchItemInTodoByName = function(searchText) {
  searchAndShow(
    document,
    isTodoOfItemMatched.bind(null, searchText),
    'cardBox'
  );
};

const searchTodoByTitle = function(searchText) {
  searchAndShow(
    document,
    isTextMatch.bind(null, searchText, getTitle),
    'cardBox'
  );
};

const searchAndShow = function(box, predicate, className) {
  const allList = getArray(getElements(box, className));
  allList.forEach(list => {
    list.style.display = 'none';
  });
  const filteredList = allList.filter(predicate);
  filteredList.forEach(list => {
    list.style.display = '';
  });
  return filteredList.length;
};
