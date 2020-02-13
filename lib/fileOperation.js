const fs = require('fs');
const List = require('./list');

const checkForFile = function(path) {
  const stat = fs.existsSync(path) && fs.statSync(path);
  return !stat || !stat.isFile();
};

const writeFile = function(path, data) {
  fs.writeFileSync(path, JSON.stringify(data));
};

const loadFile = function(path) {
  if (checkForFile(path)) {
    writeFile(path, {});
    return {};
  }
  const content = fs.readFileSync(path, 'utf8');
  return JSON.parse(content);
};

const loadData = function(path) {
  const allData = loadFile(path);
  for (const user in allData) {
    const allList = {};
    for (const todoId in allData[user].todo) {
      allList[todoId] = List.loadList(allData[user][todoId]);
    }
    allData[user].todo = allList;
  }
  return allData;
};

module.exports = { checkForFile, writeFile, loadData, loadFile };
