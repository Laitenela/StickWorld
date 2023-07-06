const sleep = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

export default class Stickman {
  #position = { x: undefined, y: undefined, callback: undefined };
  #size = { x: undefined, y: undefined, callback: undefined };
  size = {
    context: undefined,
    bind(context) {
      this.context = context;
    },
    /**
     * Set new width
     * @param {number} sizeX
     * @returns {number}
     */
    set x(sizeX) {
      this.context.#size.x = sizeX;
      if (this.context.#size.callback) {
        this.context.#size.callback(this.context.#size.x, this.context.#size.y);
      }

      return this.context.#size.x;
    },
    get x() {
      return this.context.#size.x;
    },
    /**
     * Set new height
     * @param {number} sizeY
     * @returns {number}
     */
    set y(sizeY) {
      this.context.#size.y = sizeY;
      if (this.context.#size.callback) {
        this.context.#size.callback(this.context.#size.x, this.context.#size.y);
      }

      return this.#size.x;
    },
    get y() {
      return this.context.#size.y;
    },
    /**
     * Change size of Stickman
     * @param {number} x
     * @param {number} y
     */
    change: (x, y) => {
      if (x === undefined || y === undefined) {
        throw "Need to pass two parameters";
      }

      this.context.#size.y = y;
      this.context.#size.x = x;
      if (this.context.#size.callback) {
        this.context.#size.callback(this.context.#size.x, this.context.#size.y);
      }
    },
    /**
     * @param {requestCallback} cb
     */
    setEventListener: (cb) => {
      this.#size.callback = cb;
    },
  };
  position = {
    context: undefined,
    bind(context) {
      this.context = context;
    },
    /**
     * Set new position X
     * @param {number} positionX
     * @returns {number}
     */
    set x(positionX) {
      this.context.#position.x = positionX;
      if (this.context.#position.callback) {
        this.context.#position.callback(
          this.context.#position.x,
          this.context.#position.y
        );
      }

      return this.context.#position.x;
    },
    get x() {
      return this.context.#position.x;
    },
    /**
     * Set new position Y
     * @param {number} positionY
     * @returns {number}
     */
    set y(positionY) {
      this.context.#position.y = positionY;
      if (this.context.#position.callback) {
        this.context.#position.callback(
          this.context.#position.x,
          this.context.#position.y
        );
      }

      return this.context.#position.x;
    },
    get y() {
      return this.context.#position.y;
    },
    /**
     * Change position of Stickman
     * @param {number} x
     * @param {number} y
     */
    change: (x, y) => {
      if (x === undefined || y === undefined) {
        throw "Need to pass two parameters";
      }
      this.#position.y = y;
      this.#position.x = x;
      if (this.#position.callback) {
        this.#position.callback(this.#position.x, this.#position.y);
      }
    },
    /**
     * @param {requestCallback} cb
     */
    setEventListener: (cb) => {
      this.#position.callback = cb;
    },
  };

  constructor(sizeX, sizeY, positionX, positionY) {
    this.#size.x = sizeX;
    this.#size.y = sizeY;
    this.#position.x = positionX;
    this.#position.y = positionX;
    this.position.bind(this);
    this.size.bind(this);
  }

  move = {
    linear: (x, y, time) => {
      const ticks = (time * 1000) / 60;
      const tickTime = (time / ticks) * 1000;
      const tickX = x / ticks;
      const tickY = y / ticks;
      return new Promise(async (resolve) => {
        for (let i = 0; i < ticks - 1; i++) {
          this.position.change(
            this.position.x + tickX,
            this.position.y + tickY
          );
          await sleep(tickTime);
        }

        this.position.change(x, y);
        resolve();
      });
    },
    easyIn: async (x, y, time) => {},
    easyOut: async (x, y, time) => {},
  };
  moveTo = {
    linear: (x, y, time) =>
      this.move.linear(x - this.position.x, y - this.position.y, time),
    easyIn: (x, y, time) =>
      this.move.easyIn(x - this.position.x, y - this.position.y, time),
    easyOut: (x, y, time) =>
      this.move.easyOut(x - this.position.x, y - this.position.y, time),
  };
}
