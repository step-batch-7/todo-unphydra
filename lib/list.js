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
  addItem(item) {
    const itemId = `${this.id}${this.noOfItem}`;
    this.items.push({ name: item, id: itemId, status: 0 });
    this.noOfItem++;
  }

  removeItem(id) {
    const index = getIndex(id, this.items.slice());
    const noOfRemoval = 1;
    this.items.splice(index, noOfRemoval);
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

module.exports = List;
