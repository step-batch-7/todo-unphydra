const findIndex = function(context, item, index) {
  if (item.id === context.id) {
    context.index = index;
    return context;
  }
  return context;
};

const getIndex = function(id, List) {
  const { index } = List.reduce(findIndex, { id });
  return index;
};

class List {
  constructor(title, date, id) {
    this.title = title;
    this.date = date;
    this.id = id;
    this.items = [];
    this.noOfItem = 0;
  }

  static loadList(content) {
    const { title, date, id, items, noOfItem } = content;
    const list = new List(title, new Date(date), id);
    list.setNoOfItem = noOfItem;
    list.todoItems = items.map(item => {
      return new Item(item.name, item.id, item.status);
    });
    return list;
  }

  addItem(item) {
    const itemId = `${this.id}:${this.noOfItem}`;
    this.items.push(new Item(item, itemId, false));
    this.noOfItem++;
  }

  removeItem(id) {
    const index = getIndex(id, this.items.slice());
    const noOfRemoval = 1;
    this.items.splice(index, noOfRemoval);
  }

  updateItemStatus(itemStatus) {
    const index = getIndex(itemStatus.id, this.items.slice());
    const item = this.items[index];
    item.setStatus(itemStatus.status);
  }

  updateItem(content) {
    const index = getIndex(content.id, this.items.slice());
    const item = this.items[index];
    item.updateName(content.item);
  }

  set todoItems(items) {
    this.items = items;
  }

  set setNoOfItem(num) {
    this.noOfItem = num;
  }

  get getStatus() {
    return {
      title: this.title,
      id: this.id,
      date: this.date,
      items: this.items.slice()
    };
  }
}

class Item {
  constructor(name, id, status) {
    this.name = name;
    this.id = id;
    this.status = status;
  }

  setStatus(status) {
    this.status = status;
  }

  updateName(name) {
    this.name = name;
  }
}

module.exports = List;
