/* eslint-disable no-unused-vars */
const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
];
const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

const getDateString = function(dateOb) {
  const month = months[dateOb.getMonth()];
  const day = days[dateOb.getDay()];
  const date = dateOb.getDate();
  return `${month} ${date} ${day}`;
};

const genItemHtmlForAllList = function(item) {
  let tickEle = '<div class="nonePointer todo-cardTick notVisible"></div>';
  if (item.status) {
    tickEle = '<div class="nonePointer todo-cardTick"></div>';
  }
  return `<div class="nonePointer todo-eachItem" id="${item.id}">
  <div class="nonePointer todo-cardUntick">
  ${tickEle}
  </div>
  <div class="nonePointer todo-itemName">${item.name}</div>
  </div>`;
};

const genItemInnerHtml = function(item) {
  let tickEle = '<div class="cardTick notVisible"></div>';
  if (item.status) {
    tickEle = '<div class="cardTick"></div>';
  }
  return `<div class="cardUntick" onclick="toggleDone('${item.id}')">
  ${tickEle}
  </div>
  <input class="itemName" onmousedown="enableBorder(this)" 
  onfocusout="updateItem(this,'${item.id}')" value="${item.name}">
  <div class="deleteLogo" onclick="deleteItem('${item.id}')"></div>`;
};

const generateItemHtmlForTodoBox = function(item) {
  return `<div class="eachItem" id="${item.id}">
  ${genItemInnerHtml(item)}
  </div>`;
};

const getListHtml = function(list, mapper) {
  return list.map(mapper).join('');
};

const todoBox = function(res) {
  const date = getDateString(new Date(res.date));
  const listHtml = getListHtml(res.items, generateItemHtmlForTodoBox);
  return `<input class="heading" value="${res.title}" 
      onfocusout="updateTitle(this,'${res.id}')">
      <div class="date">${date}</div>
      <div class="smallHorizontalLine"></div>
      <div class="itemList" id="${res.id}">
      ${listHtml}
      </div>
      <div class="footer">
      <input
        type="text"
        class="itemInput"
        onkeyup="takeItem(this,${res.id})"
        placeholder="itemName"
        autofocus
      />
      <button class="addItem"></button>
      <button class="closeButton" onclick="closeCard()">Done</button>
    </div>`;
};

const titleHtml = `<div class="writeTitle">Write Title</div>
<input type="text" id="titleInput"/>
<button id="done" onclick="takeTitle()">Done</button>`;

const getEachTodoHtml = function(todo) {
  const items = getListHtml(todo.items, genItemHtmlForAllList);
  return `<div class="cardBox" id="${todo.id}-par" >
  <div class="topTick" onclick="toggleSelection(this,${todo.id})"></div>
   <div class="todoCard" id="${todo.id}" onclick="getCardDetails()">
     <div class="todoCardTitle nonePointer">${todo.title}</div>
     ${items}
   </div>
 </div>`;
};

const todoCards = function(res) {
  let div = '';
  const ids = Object.keys(res).reverse();
  ids.forEach(todo => {
    div += getEachTodoHtml(res[todo]);
  });
  return div;
};
