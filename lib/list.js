class List {
  constructor(title, date, id) {
    this.title = title;
    this.date = date;
    this.id = id;
    this.items = [];
    this.noOfItem = 0;
  }
  addItem(item) {
    this.noOfItem++;
    const itemId = `${this.id}_${this.noOfItem}`;
    this.items.push({ name: item, id: itemId, status: 0 });
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
