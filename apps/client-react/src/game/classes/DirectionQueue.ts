// import * as ex from "excalibur";
import { Engine, Keys } from "excalibur";

import { EDirection } from "../constants";

// import { DOWN, LEFT, RIGHT, UP } from "../constants.js";

export class DirectionQueue {
  heldDirections: EDirection[] = [];
  constructor() {
    this.heldDirections = [];
  }

  get direction() {
    return this.heldDirections[0] ?? null;
  }

  add(dir: EDirection) {
    const exists = this.heldDirections.includes(dir);
    if (exists) {
      return;
    }
    this.heldDirections.unshift(dir);
  }

  remove(dir: EDirection) {
    this.heldDirections = this.heldDirections.filter((d) => d !== dir);
  }

  update(engine: Engine) {
    [
      { key: Keys.Left, dir: EDirection.left },
      { key: Keys.Right, dir: EDirection.right },
      { key: Keys.Up, dir: EDirection.up },
      { key: Keys.Down, dir: EDirection.down },
    ].forEach((group) => {
      if (engine.input.keyboard.wasPressed(group.key)) {
        this.add(group.dir);
      }
      if (engine.input.keyboard.wasReleased(group.key)) {
        this.remove(group.dir);
      }
    });
  }
}
