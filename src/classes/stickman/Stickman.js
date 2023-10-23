// @ts-check

import stickmanActions from "./actions";
import PositionsController from "./positionsController";

const sleep = (/** @type {number} */ ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

export default class Stickman {
  /** Does the stickman take on new tasks @type {boolean}*/
  #living = false;

  /** Stickman actions @type {{current: object|undefined, next: object|undefined}}*/
  #action = { current: undefined, next: undefined };

  /** All kinds of stickman tasks @type {stickmanActions}*/
  #actions = stickmanActions;

  /** All kinds of stickman tasks @type {object}*/
  #actionsList;

  /** @type {PositionsController} */
  position;

  /** @type {PositionsController} */
  size;

  /** Stickman constructior
   * @param {number} sizeX 
   * @param {number} sizeY 
   * @param {number} positionX
   * @param {number} positionY
   * @param {*} world */
  constructor(sizeX, sizeY, positionX, positionY, world) {
    this.size = new PositionsController(sizeX, sizeY);
    this.position = new PositionsController(positionX, positionY);
    this.#actionsList = world.actionsList;
  }

  /** Move stickman relative */
  move(/** @type {number} */ x, /** @type {number} */ y, /** @type {number} */ time) {
    const startX = this.position.x;
    const startY = this.position.y;
    const ticks = (time * 1000) / 60;
    const tickTime = (time / ticks) * 1000;
    const totalTime = ticks * tickTime;

    /** @param {(elapsed: number, start: number, end: number, total: number) => Number} calculate */
    const changePos = (calculate) => new Promise(async (resolve) => {
      for (let i = 1; i < ticks; i++) {
        const newPositionX = calculate(tickTime * i, startX, x + startX, totalTime);
        const newPositionY = calculate(tickTime * i, startY, y + startY, totalTime);
        this.position.change(Math.round(newPositionX), Math.round(newPositionY));
        await sleep(tickTime);
      }

      this.position.change(x, y);
      resolve(null);
    });

    return {
      /** Linear motion */
      linear: () => changePos((el, st, en, t) => st + ((en - st) * el) / t),
      /** Motion with Boost */
      easyIn: () => changePos((el, st, en, t) => st + en * (el /= t) * el),
      /** Motion with slowing down */
      easyOut: () => changePos((el, st, en, t) => st - en * (el /= t) * (el - 2)),
    };
  }

  /** Move to current position */
  moveTo(/** @type {number} */ x, /** @type {number} */ y, /** @type {number} */ time) {
    const newPosX = x - this.position.x;
    const newPosY = y - this.position.y;
    return {
      /** Linear motion */
      linear: () => this.move(newPosX, newPosY, time).linear(),
      /** Motion with Boost */
      easyIn: () => this.move(newPosX, newPosY, time).easyIn(),
      /** Motion with slowing down */
      easyOut: () => this.move(newPosX, newPosY, time).easyOut(),
    };
  }

  /** Force stickman to take tasks to complete */
  async instillLife() {
    this.#living = true;

    if (this.#action.current === undefined) {
      this.#action.current = this.#getNewAction();
    }

    while (this.#living) {
      if (!this.#action.current) throw "Has no actions";
      await this.#actions[this.#action.current]();

      if(!this.#action.next || this.#action.next.busy){
        this.#action.next = this.#getNewAction();
      }

      this.#action.current = this.#action.next;
      this.setNextAction(this.#getNewAction());
    }
  }

  /** Gets a random action from the list of free actions actionsList
   * @returns {object} */
  #getNewAction() {
    const keysAvailable = Object.keys(this.#actionsList).filter((key) => {
      return !this.#actionsList[key].busy;
    });
    const indexKey = Math.floor(Math.random() * keysAvailable.length);
    const keyAvailable = keysAvailable[indexKey];

    return this.#actionsList[keyAvailable];
  }

  /**
   * Set stickman next action
   * @param {any} action */
  setNextAction(action) {
    this.#action.next = action;
  }

  /** Stop the stickman.
   *  He will stop taking assignments */
  stopLife() {
    this.#living = false;
  }
}
