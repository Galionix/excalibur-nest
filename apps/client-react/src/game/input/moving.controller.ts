import { Engine, Keys } from 'excalibur';
import { TPlayer } from '../actors/player/player';

export function onPreUpdateMovement(
  engine: Engine,
  delta: number,
  player: TPlayer
) {
  const keyboard = engine.input.keyboard;

  player.vel.x = 0;
  player.vel.y = 0;
  if (keyboard.isHeld(Keys.A)) {
    player.vel.x = -1;
  }
  if (keyboard.isHeld(Keys.D)) {
    player.vel.x = 1;
  }
  if (keyboard.isHeld(Keys.W)) {
    player.vel.y = -1;
  }
  if (keyboard.isHeld(Keys.S)) {
    player.vel.y = 1;
  }

  // Normalize walking speed
  if (player.vel.x !== 0 || player.vel.y !== 0) {
    player.vel = player.vel.normalize();
    player.vel.x = player.vel.x * player.speed;
    player.vel.y = player.vel.y * player.speed;
  }

  player.facing = player.directionQueue.direction ?? player.facing;
}
