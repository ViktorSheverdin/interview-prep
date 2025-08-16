class Node {
  constructor(data, next = null) {
    this.data = data;
    this.next = next;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.size = 0;
  }

  // Insert first node
  insertFirst(data) {
    this.head = new Node(data, this.head);
    this.size++;
  }

  // Insert last node
  insertLast(data) {
    const node = new Node(data);
    let current;

    if (!this.head) {
      this.head = node;
      this.size++;
      return;
    }

    current = this.head;
    while (current.next) {
      current = current.next;
    }

    current.next = node;
    this.size++;
  }

  // Insert at index
  insertAt(data, index) {
    // Out of range
    if (index < 0 || index > this.size) return;

    if (index === 0) {
      this.insertFirst(data);
      return;
    }

    const node = new Node(data);
    let current = this.head;
    let previous;
    let count = 0;

    while (count < index) {
      previous = current; // node before index
      current = current.next; // node after
      count++;
    }

    node.next = current;
    previous.next = node;
    this.size++;
  }

  // Get at index
  getAt(index) {
    if (index < 0 || index >= this.size) return;
    let count = 0;
    let current = this.head;
    while (count < index) {
      current = current.next;
      count++;
    }
    console.log(current.data);
  }

  // Remove at index
  removeAt(index) {
    if (index < 0 || index >= this.size) return;

    let current = this.head;
    let previous;
    let count = 0;

    // Special case: removing head node
    if (index === 0) {
      this.head = current.next;
      this.size--;
      return;
    }

    while (count < index) {
      previous = current;
      current = current.next;
      count++;
    }

    previous.next = current.next;
    this.size--;
  }

  // Clear list
  clearList() {
    this.head = null;
    this.size = 0;
  }

  // Remove last

  // Remove first

  // Print list data
  printListData() {
    let current = this.head;
    while (current) {
      console.log(current.data);
      current = current.next;
    }
  }
}

const ll = new LinkedList();
ll.insertFirst(100);
ll.insertFirst(200);
ll.insertFirst(300);
ll.insertLast(400);
ll.insertAt(500, 2);
ll.insertAt(600, 0);

console.log('Original list:');
ll.printListData();
console.log('Size:', ll.size);

// Test removing last element (index 5)
ll.removeAt(5);
console.log('\nAfter removing last element:');
ll.printListData();
console.log('Size:', ll.size);
