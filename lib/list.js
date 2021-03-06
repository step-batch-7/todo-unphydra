const findIndex = function(context, item, index) {
  if (item[context.method] === context.value) {
    context.index = index;
    return context;
  }
  return context;
};

const getIndex = function(method, value, List) {
  const { index } = List.reduce(findIndex, { method, value });
  return index;
};

class List {
  constructor(title, id) {
    this.title = title;
    this.id = id;
    this.items = [];
    this.noOfItem = 0;
  }

  static loadList(content) {
    const { title, id, items, noOfItem } = content;
    const list = new List(title, id);
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

  getItem(name) {
    const index = getIndex('name', name, this.items.slice());
    return this.items.slice()[index];
  }

  removeItem(id) {
    const index = getIndex('id', id, this.items.slice());
    const noOfRemoval = 1;
    this.items.splice(index, noOfRemoval);
  }

  updateItemStatus(itemStatus) {
    const index = getIndex('id', itemStatus.id, this.items.slice());
    const item = this.items[index];
    item.setStatus(itemStatus.status);
  }

  updateItem(content) {
    const index = getIndex('id', content.id, this.items.slice());
    const item = this.items[index];
    item.updateName(content.item);
  }

  updateTitle(name) {
    this.title = name;
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
