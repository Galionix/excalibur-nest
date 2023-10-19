import { DisplayMode, Engine, Vector } from 'excalibur';

// import { DevTool } from '@excaliburjs/dev-tools';

import { Authorization } from './classes/Authorization';
import { Chest } from './classes/Chest';
import { ENetworkEvent } from './classes/events/network';
import { NetworkActorsMap } from './classes/network/NetworkActorsMap';
import { NetworkClient } from './classes/network/NetworkClient';
import { onWindowUnload } from './onUnload';
import { loader, Resources } from './resources';
import { Level } from './scenes/generalMap';
import {
  EMapsEnum,
  TMapNames,
  pathsNullValues,
  pathsPlainObject,
} from '../assets/maps/maps';
import { Player } from './actors/player/player';

const initialLevelName = EMapsEnum.VillageRoderikHouseBasement;
const initialEntryId = '1';

export const currentAuth = new Authorization();

// const user = auth.getCurrentUser();

/**
 * Managed game class
 */
class Game extends Engine {
  private player?: Player;
  // portals: Record<string, TiledObject> = {};
  levels: Record<TMapNames, Level | null> = pathsNullValues;
  // levelOne: LevelOne;

  constructor() {
    super({ displayMode: DisplayMode.FitScreen });
  }

  public start() {
    // this.levelOne = new LevelOne();

    // game.add("levelOne", this.levelOne);

    this.levels = Object.entries(pathsPlainObject).reduce(
      (acc, [key, value]) => {
        const level = new Level({
          name: key,
          map: Resources[key as TMapNames],
        });

        acc[key as TMapNames] = level;

        return acc;
      },
      {} as Record<TMapNames, Level>
    );

    for (const level of Object.values(this.levels)) {
      if (!level) throw new Error('level is undefined');
      game.add(level.name, level);
    }

    loader.suppressPlayButton = true;

    return super.start(loader);
  }
}

const game = new Game();

// game.on('initialize', (e) => {});
//
// game.showDebug(true);
// const devtool = new DevTool(game);

export function loadLevel({
  name,
  entryId,
  x,
  y,
}: {
  name: TMapNames;
  entryId: string;
  x?: number;
  y?: number;
}) {
  // console.log({
  //   x,
  //   y,
  // });
  game.currentScene?.clear();
  game.goToScene(name);
  const objects = Resources[name].data.getObjectLayerByName('objects');
  const chests = objects.getObjectsByName('chest');
  for (const chest of chests) {
    const chestActor = new Chest({
      pos: new Vector(chest.x, chest.y),
      // todo: get from db
      isOpened: false,
    });
    game.currentScene.add(chestActor);
    chestActor.z = 100;
  }
  const camera = objects.getObjectByName('Camera');
  const entry = objects
    .getObjectsByName('entry')
    .filter((e) => e.getProperty('id')?.value == entryId)[0];

  if (camera) {
    if (x && y) {
      game.currentScene.camera.pos = new Vector(x, y);
    } else {
      game.currentScene.camera.pos = new Vector(camera.x, camera.y);
    }
    game.currentScene.camera.zoom =
      camera.getProperty<number>('zoom')?.value ?? 1.0;
  }
  const player = objects.getObjectByName('Player');
  // if (x && y && player) {
  //   const playerActor = new Player({
  //     pos: new Vector(x, y),
  //     mapName: name,
  //   });
  //   game.currentScene.add(playerActor);
  //   playerActor.z = 100;
  // }

  if (player) {
    const vector = new Vector(x || entry.x, y || entry.y);
    const playerActor = new Player({
      pos: vector,
      mapName: name,
    });
    game.currentScene.add(playerActor);
    playerActor.z = 100;
    onWindowUnload({
      player: playerActor,
    });
  }
  Resources[name].addTiledMapToScene(game.currentScene);

  new NetworkActorsMap(game);
  const client = new NetworkClient(game);
  //
  // When one of my nodes updates, send it to all peers
  game.on(ENetworkEvent.EVENT_SEND_PLAYER_UPDATE, (update) => {
    if (typeof update !== 'string') throw new Error('update is not a string');
    client.sendUpdate(update);
  });
}

// if (!user) {

// }

export const AuthAndStart = async () => {
  currentAuth.signIn((st, loginData) => {
    const { map, entry, x, y } = loginData.location;
    game.start().then(() => {
      loadLevel({
        name: map,
        entryId: entry,
        x,
        y,
      });
    });
  });
};
