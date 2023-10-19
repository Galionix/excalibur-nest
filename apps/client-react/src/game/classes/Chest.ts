import {
  Actor,
  CollisionStartEvent,
  CollisionType,
  SpriteSheet,
  Vector,
} from 'excalibur';

import { Resources } from '../resources';

export class Chest extends Actor {
  opened = false;
  spripteSheet = SpriteSheet.fromImageSource({
    image: Resources.chest,
    grid: {
      columns: 2,
      rows: 1,
      spriteWidth: 32,
      spriteHeight: 32,
    },
  });
  openedSprite = this.spripteSheet.getSprite(1, 0);
  closedSprite = this.spripteSheet.getSprite(0, 0);
  constructor({ pos, isOpened }: { pos: Vector; isOpened?: boolean }) {
    const adjustedPos = pos.clone().add(new Vector(32, 32));
    super({
      pos: adjustedPos,
      //   x: adjustedPos.x,
      //   y: adjustedPos.y,
      width: 32,
      height: 32,
      collisionType: CollisionType.Fixed,
    });
    this.on('collisionstart', (evt) => this.onCollisionStart(evt));
    // const spritesheet = SpriteSheet.fromImageSource({
    //   image: Resources.chest,
    //   grid: {
    //     columns: 2,
    //     rows: 1,
    //     spriteWidth: 32,
    //     spriteHeight: 32,
    //   },
    // });

    // const openedSprite = this.spripteSheet.getSprite(1, 0);
    // if (!openedSprite) throw Error("can not get sprite!!");
    // const closedSprite = this.spripteSheet.getSprite(0, 0);
    // if (!closedSprite) throw Error("can not get sprite!!");
    if (!this.openedSprite || !this.closedSprite)
      throw Error('can not get sprite!!');
    this.openedSprite.width = 64;
    this.openedSprite.height = 64;
    this.closedSprite.height = 64;
    this.closedSprite.width = 64;
    const sprite = isOpened ? this.openedSprite : this.closedSprite;
    // sprite.transform.scale(5, 2);
    this.graphics.use(sprite);
  }

  onCollisionStart(event: CollisionStartEvent<Actor>) {
    if (this.opened) return;

    this.opened = true;
    if (!this.openedSprite) throw Error('can not get sprite!!');
    this.graphics.use(this.openedSprite);
  }
  //   onInitialize() {
  //     this.addDrawing(Resources.chest);
  //   }

  // addDrawing(
}
