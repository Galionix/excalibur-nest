import { Actor, Engine } from 'excalibur';

import { Resources } from '../../resources';
import { TMapNames } from '../../../assets/maps/maps';

export class NetworkPlayer extends Actor {
  // Convert a network update to friendly values for this actor
  walkingMsLeft?: number;
  facing?: string;
  engine?: Engine;
  onInitialize(engine: Engine) {
    this.engine = engine;
    this.graphics.use(Resources.Sword.toSprite());
    // engine.currentScene.camera.clearAllStrategies();
    // this.cameraStrategy = new ElasticToActorStrategy(this, 0.2, 0.1);
    // engine.currentScene.camera.addStrategy(this.cameraStrategy);

    // engine.on(ENetworkEvent.EVENT_INITIAL_DATA_REQUESTED, () => {
    //   engine.emit(
    //     ENetworkEvent.EVENT_SEND_PLAYER_UPDATE,
    //     this.createNetworkUpdateString(),
    //   );
    // });
  }

  onStateUpdate(newUpdate: TUpdate) {
    // if (newUpdate.actionType === SWORDACTION && !this.actionAnimation) {
    //   this.playerActions?.actionSwingSword();
    // }
    // if (newUpdate.actionType === ARROWACTION && !this.actionAnimation) {
    //   this.playerActions?.actionShootArrow();
    // }

    // Reset timer to show Walking MS for a bit if we have moved since last update
    const wasX = this.pos.x;
    const wasY = this.pos.y;
    this.pos.x = newUpdate.x;
    this.pos.y = newUpdate.y;
    const hasPosDiff = wasX !== this.pos.x || wasY !== this.pos.y;
    if (hasPosDiff) {
      this.walkingMsLeft = 100; //Assume walking for this time if new pos came in
    }

    // Use the latest facing and pain values from the network
    this.facing = newUpdate.facing ?? this.facing;
    // this.hasGhostPainState = newUpdate.isInPain;

    // If we are newly in pain flashing, kick off a flash series
    // const wasPainFlashing = this.isPainFlashing;
    // if (!wasPainFlashing && newUpdate.isPainFlashing) {
    //   this.playerActions?.flashSeries();
    // }

    // Redefine internal animations to new skin if a new one has come in
    // if (this.skinId !== newUpdate.skinId) {
    //   this.regenAnims(newUpdate.skinId);
    // }
  }
}

export type TUpdate = {
  x: number;
  y: number;
  facing: string;
  isInPain: boolean;
  isPainFlashing: boolean;
  skinId: string;
  mapName: TMapNames;
};
