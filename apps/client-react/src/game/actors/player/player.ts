import {
  Actor,
  CameraStrategy,
  CollisionStartEvent,
  CollisionType,
  Color,
  ElasticToActorStrategy,
  Engine,
  Vector,
} from 'excalibur';

// import { TMapNames } from '../../../assets/maps/maps';
import { setLocation } from '../../api';
import { TMapNames } from '../../../assets/maps/maps';
import { Chest } from '../../classes/Chest';
import { DirectionQueue } from '../../classes/DirectionQueue';
import { ENetworkEvent } from '../../classes/events/network';
import { NetworkUpdater } from '../../classes/network/NetworkUpdater';
import { EDirection } from '../../constants';
import { onPreUpdateMovement } from '../../input/moving.controller';
import { loadLevel } from '../../main';
import { SyncServer } from '../../onUnload';
import { Resources } from '../../resources';
import { getTiledObjectPropertyValues } from '../../utils/tileUtils';

type onInitialize = Actor['onInitialize'];
type t = Actor['on'];
export type TUpdateString = string;
export class Player extends Actor {
  constructor({ pos, mapName }: { pos: Vector; mapName: TMapNames }) {
    super({
      pos,
      width: 32,
      height: 32,
      color: new Color(255, 255, 255),
      collisionType: CollisionType.Active,
    });
    this.mapName = mapName;
    this.directionQueue = new DirectionQueue();
    this.on('collisionstart', (evt) => this.onCollisionStart(evt));
  }
  directionQueue: DirectionQueue;
  speed = 260;
  readonly mapName: TMapNames;

  engine?: Engine;
  facing = EDirection.down;
  cameraStrategy?: ElasticToActorStrategy;
  networkUpdater?: NetworkUpdater;

  onInitialize(engine: Engine) {
    this.engine = engine;
    this.graphics.use(Resources.Sword.toSprite());
    engine.currentScene.camera.clearAllStrategies();
    this.cameraStrategy = new ElasticToActorStrategy(this, 0.2, 0.1);
    engine.currentScene.camera.addStrategy(this.cameraStrategy);

    engine.on(ENetworkEvent.EVENT_INITIAL_DATA_REQUESTED, () => {
      engine.emit(
        ENetworkEvent.EVENT_SEND_PLAYER_UPDATE,
        this.createNetworkUpdateString()
      );
    });

    this.networkUpdater = new NetworkUpdater(
      engine,
      ENetworkEvent.EVENT_SEND_PLAYER_UPDATE
    );
    this.networkUpdater.sendStateUpdate(this.createNetworkUpdateString());

    // update actors on initial load
    this.engine.emit(ENetworkEvent.SYNC_LATEST_NETWORK_STATE);

    new SyncServer(this).start();
    // setInterval(() => {
    //   setLocation({
    //     x: this.pos.x,
    //     y: this.pos.y,
    //     location: this.mapName,
    //     entry: "",
    //   });
    // }, 1000);
  }
  createNetworkUpdateString(): TUpdateString {
    // const actionType = this.actionAnimation?.type ?? "NULL";
    // const isInPain = Boolean(this.painState);
    const x = Math.round(this.pos.x);
    const y = Math.round(this.pos.y);
    return `${this.mapName}|${x}|${y}|${this.facing}`;

    // return `${actionType}|${x}|${y}|${this.vel.x}|${this.vel.y}|${this.skinId}|${this.facing}|${isInPain}|${this.isPainFlashing}`;
  }
  onCollisionStart(evt: CollisionStartEvent<Actor>) {
    console.log('evt: ', evt);
    const name = evt.other.name;
    if (name === 'portal') {
      const [destination, entry] = getTiledObjectPropertyValues(evt.other, [
        'destination',
        'entry',
      ]) as [TMapNames, string];
      setLocation({
        x: this.pos.x,
        y: this.pos.y,
        location: destination,
        entry,
      });
      // this.mapName = destination;
      loadLevel({
        name: destination,
        entryId: entry,
      });
    }
    if (evt.other instanceof Chest) {
      console.log('chest: ', evt.other);
      // const [itemSetId, itemIds = ""] = getTiledObjectPropertyValues(
      //   evt.other,
      //   ["itemSetId", "itemIds"],
      // );
      // console.log("itemSetId, itemIds: ", itemSetId, itemIds);
    }
  }

  public onPreUpdate: Actor['onPreUpdate'] = (engine, delta) => {
    onPreUpdateMovement(engine, delta, this);
    // Update everybody else
    const networkUpdateStr = this.createNetworkUpdateString();
    if (!this.networkUpdater) throw new Error('networkUpdater is undefined');
    this.networkUpdater.sendStateUpdate(networkUpdateStr);
  };

  collides(actor: Actor) {
    if (actor instanceof Player) {
      return false;
    }
    // return super.collides(actor);
  }
}

export type TPlayer = Player;
export type TItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  setId: number;
  rarity: number;
};
