// import { NetworkPlayer } from "../actor/Players/NetworkPlayer.js";
// import {
//   EVENT_NETWORK_MOBLIN_UPDATE,
//   EVENT_NETWORK_PLAYER_LEAVE,
//   EVENT_NETWORK_PLAYER_UPDATE,
// } from "../constants.js";
// import { NetworkMoblin } from "../actor/Moblin/NetworkMoblin.js";

import { Engine } from 'excalibur';

import { ENetworkEvent } from '../events/network';
import { NetworkPlayer } from './NetworkPlayer';
import { Player } from '../../actors/player/player';
import { TMapNames } from '../../../assets/maps/maps';

// Manages Actors that display state of other connected Players
export class NetworkActorsMap {
  engine: Engine;
  playerMap: Map<string, NetworkPlayer>;
  mapName: TMapNames;
  constructor(engine: Engine, playerActor: Player) {
    this.mapName = playerActor.mapName;
    this.engine = engine;
    this.playerMap = new Map();

    // WARN: remove any
    this.engine.on(
      ENetworkEvent.EVENT_NETWORK_PLAYER_UPDATE,
      (otherPlayer: any) => {
        this.onUpdatedPlayer(otherPlayer.id, otherPlayer.data);
      }
    );

    // this.engine.on(EVENT_NETWORK_MOBLIN_UPDATE, (content) => {
    //   this.onUpdatedMoblin(content);
    // });

    // this.engine.on(EVENT_NETWORK_PLAYER_LEAVE, (otherPlayerIdWhoLeft) => {
    //   this.removePlayer(otherPlayerIdWhoLeft);
    // });
  }

  onUpdatedPlayer(id: string, content: any) {
    // Decode what was sent here
    const [
      mapName,
      x,
      y,
      velX,
      velY,
      skinId,
      facing,
      isInPain,
      isPainFlashing,
    ] = content.split('|');
    console.log('mapName: ', mapName);

    const stateUpdate = {
      mapName,
      x: Number(x),
      y: Number(y),
      skinId,
      facing,
      isInPain: isInPain === 'true',
      isPainFlashing: isPainFlashing === 'true',
    };

    // if (isInPain) {
    //   stateUpdate.velX = Number(velX);
    //   stateUpdate.velY = Number(velY);
    // }

    let otherPlayerActor = this.playerMap.get(id);
    if (!otherPlayerActor && stateUpdate.mapName === this.mapName) {
      otherPlayerActor = new NetworkPlayer({
        x: stateUpdate.x,
        y: stateUpdate.y,
      });
      this.playerMap.set(id, otherPlayerActor);
      this.engine.add(otherPlayerActor);
      otherPlayerActor.onStateUpdate(stateUpdate);
    }
  }

  // Called when this id disconnects
  removePlayer(id: string) {
    const actorToRemove = this.playerMap.get(id);
    if (actorToRemove) {
      actorToRemove.kill();
    }
    this.playerMap.delete(id);
  }

  // onUpdatedMoblin(content) {
  //   const [_type, networkId, x, y, _velX, _velY, facing, hasPainState, hp] =
  //     content.split("|");

  //   let moblinDummyActor = this.playerMap.get(networkId);

  //   // Add new if it doesn't exist
  //   if (!moblinDummyActor) {
  //     moblinDummyActor = new NetworkMoblin(x, y);
  //     this.playerMap.set(networkId, moblinDummyActor);
  //     this.engine.add(moblinDummyActor);
  //   }

  //   //Update the node ("Puppet style")
  //   moblinDummyActor.pos.x = Number(x);
  //   moblinDummyActor.pos.y = Number(y);
  //   moblinDummyActor.facing = facing;
  //   moblinDummyActor.hasPainState = hasPainState === "true";

  //   // Destroy if gone
  //   if (Number(hp) <= 0) {
  //     moblinDummyActor.tookFinalDamage();
  //     this.playerMap.delete(networkId);
  //   }
  // }
}
