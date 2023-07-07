// @ts-check

export default class PositionsController{
  /** Size of the stickman
   * @type {{x: number, y: number, callback: ((x: number, y: number) => void)|undefined}} */
  #params = { x: -0, y: -0, callback: undefined };

  constructor(/** @type {number} */x,/** @type {number} */ y){
    this.#params.x = x;
    this.#params.y = y;
  }

  setEventListener(/** @type {(x: number, y: number) => void} */ cb){
    this.#params.callback = cb;
  };

  /** Change size of Stickman */
  change(/** @type {number} */ x, /** @type {number} */ y) {
    this.#params.y = y;
    this.#params.x = x;
    if (this.#params.callback) {
      this.#params.callback(this.#params.x, this.#params.y);
    }
  };

  set x(/** @type {number} */ sizeX) {
    this.#params.x = sizeX;
    if (this.#params.callback) {
      this.#params.callback(this.#params.x, this.#params.y);
    }
  };

  get x() {
    return this.#params.x;
  };
  
  set y(/** @type {number} */ sizeY) {
    this.#params.y = sizeY;
    if (this.#params.callback) {
      this.#params.callback(this.#params.x, this.#params.y);
    }
  };

  get y() {
    return this.#params.y;
  };
}