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

const getEachItemHtml = function(item) {
  return `<div class="eachItem" id="${item.id}">
  <div class="cardUntick"></div>
  <div class="itemName">${item.name}</div>
  <div class="deleteItem">X</div>
</div>`;
};

const getListHtml = function(items) {
  return items.map(getEachItemHtml).join('');
};

const todoBox = function(res) {
  const date = getDateString(new Date(res.date));
  const listHtml = getListHtml(res.items);
  return `<div class="heading">${res.title}</div>
      <div class="date">${date}</div>
      <div class="smallHorizontalLine"></div>
      <div class="itemList" id="${res.id}">
      ${listHtml}
        <input type="text" id="itemInput" onkeyup="takeItem(this)"
        placeholder="itemName"></input>
      </div>
      <button class="closeButton">close</button>`;
};

const titleHtml = `<div class="writeTitle">write Title</div>
<input type="text" id="titleInput" />
<button id="done" onclick="takeTitle()">Done</button>`;
