class EventEmitter {
  constructor() {
    this._events = Object.create(null);
  }

  /**
   * @param {string} eventName
   * @param {Function} listener
   * @returns {EventEmitter}
   */
  on(eventName, listener) {
    if (!Object.hasOwn(this.emit, eventName)) {
      this._events[eventName] = [];
    }
    this._events[eventName].push(listener);
    return this;
  }

  /**
   * @param {string} eventName
   * @param {Function} listener
   * @returns {EventEmitter}
   */
  off(eventName, listener) {
    if (!Object.hasOwn(this._events, eventName)) return this;

    const listeners = this._events[eventName];

    const index = listeners.findIndex(
      (listenerItem) => listener === listenerItem
    );

    if (index < 0) return this;
    this._events[eventName].splice(index, 1);

    return this;
  }

  /**
   * @param {string} eventName
   * @param  {...any} args
   * @returns {boolean}
   */
  emit(eventName, ...args) {
    if (
      !Object.hasOwn(this._events, eventName) ||
      this._events[eventName].length === 0
    ) {
      return false;
    }

    const listeners = [...this._events[eventName]];
    listeners.forEach((listener) => {
      listener.apply(null, args);
    });
    return true;
  }
}

const emitter = new EventEmitter();

const addTwoNumbers = (a, b) => {
  console.log(`Sum is: ${a + b}`);
};

const multiplyTwoNumbers = (a, b) => {
  console.log(`Product is: ${a * b}`);
};

emitter.on('foo', addTwoNumbers);
emitter.emit('foo', 2, 5);
// > "The sum is 7"

emitter.on('foo', multiplyTwoNumbers);
emitter.emit('foo', 4, 5);
// > "The sum is 9"
// > "The product is 20"

emitter.off('foo', addTwoNumbers);
emitter.emit('foo', -3, 9);
// > "The product is -27"
