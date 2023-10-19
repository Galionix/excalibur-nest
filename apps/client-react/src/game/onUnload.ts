import { Player } from './actors/player/player';
import { setLocation } from './api';

export const onWindowUnload = ({ player }: { player: Player }) => {
  // setInterval(handler)
  //   window.addEventListener("unload", () => {
  //     setLocation({
  //       x: player.pos.x,
  //       y: player.pos.y,
  //       location: player.mapName,
  //       entry: "",
  //     });
  //   });
};

export class SyncServer {
  player: Player;
  prevSentValues?: {
    x: number;
    y: number;
    mapName: string;
  };
  constructor(player: Player) {
    this.player = player;
  }

  isChanged() {

    if (!this.prevSentValues) return true;
    const {
      pos: { x, y },
      mapName,
    } = this.player;
    if (x !== this.prevSentValues.x) return true;
    if (y !== this.prevSentValues.y) return true;
    if (mapName !== this.prevSentValues.mapName) return true;
    return false;
  }

  start() {
    setInterval(() => {
      if (!this.player) return;
      if (!this.isChanged()) return;
      this.prevSentValues = {
        x: this.player.pos.x,
        y: this.player.pos.y,
        mapName: this.player.mapName,
      };
      setLocation({
        x: this.player.pos.x,
        y: this.player.pos.y,
        location: this.player.mapName,
        entry: '',
      });
    }, 3000);
  }
}
