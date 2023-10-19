import { Engine, Scene } from 'excalibur';

import { TiledMapResource } from '@excaliburjs/plugin-tiled';
import { TPlayer } from '../actors/player/player';

export class Level extends Scene {
  name = '';
  player!: TPlayer;
  constructor({ name, map }: { name: string; map: TiledMapResource }) {
    super();
    this.name = name;
  }
  // public onInitialize(engine: Engine) {}
  // public onActivate() {}
  // public onDeactivate() {}
}
