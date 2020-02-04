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

const itemInputBox = function(Title, dateOb) {
  const date = getDateString(dateOb);
  return `<div class="heading">${Title}</div>
      <div class="date">${date}</div>
      <div class="smallHorizontalLine"></div>
      <div id="itemList">
        <input type="text" id="itemInput" onkeyup="takeItem(this)" placeholder="itemName"></input>
      </div>`;
};

module.exports = { itemInputBox };
// <div class="eachItem">
//   <div class="cardUntick">
//     <div class="cardTick"></div>
//   </div>
//   <div class="itemName">itemName</div>
//   <div class="deleteItem">X</div>
// </div>
