import { Engine } from 'excalibur';

import { TNetworkEvent } from '../events/network';
import { TUpdateString } from '../../actors/player/player';

export class NetworkUpdater {
  engine: Engine;
  eventType: string;
  prevStr: TUpdateString;

  constructor(engine: Engine, eventType: TNetworkEvent) {
    this.engine = engine;
    this.eventType = eventType;
    this.prevStr = '';
  }

  sendStateUpdate(newString: TUpdateString) {
    if (this.prevStr === newString) {
      return;
    }
    this.engine.emit(this.eventType, newString);
    this.prevStr = newString;
  }
}
