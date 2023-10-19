import { Engine } from 'excalibur';
import { DataConnection, Peer } from 'peerjs';

import { currentAuth } from '../../main';
import { ENetworkEvent } from '../events/network';

// import {
//   EVENT_INITIAL_DATA_REQUESTED,
//   EVENT_NETWORK_MOBLIN_UPDATE,
//   EVENT_NETWORK_PLAYER_LEAVE,
//   EVENT_NETWORK_PLAYER_UPDATE,
// } from "../constants.js";
// import { guidGenerator } from "../helpers.js";

const URL = 'YOUR-PROJECT-NAME.onrender.com';

const NETLIFY_CONFIG = {
  host: URL,
  key: 'demodemo',
  port: '',
  path: '/myapp',
  secure: true,
};

const LOCALHOST_CONFIG = {
  host: 'localhost',
  key: 'demodemo',
  port: 9001,
  path: '/myapp',
};

const urlParams = new URLSearchParams(window.location.search);
const isLocalMode = urlParams.get('local');

export class NetworkClient {
  peerId: string;
  engine: Engine;
  peer?: Peer;
  // peer2: StreamConnection;
  connectionMap: Map<string, DataConnection>;
  latestConnectionStateMap: Map<string, string>;
  constructor(engine: Engine) {
    this.peerId = 'DC_Z_plyr_' + currentAuth.getCurrentUserId();
    this.engine = engine;
    this.connectionMap = new Map();
    this.latestConnectionStateMap = new Map();
    this.init();
  }

  interactWithConnection(conn: DataConnection) {
    conn.on('open', () => {
      this.connectionMap.set(conn.peer, conn);
      this.engine.emit(ENetworkEvent.EVENT_INITIAL_DATA_REQUESTED);
    });

    // // Know when it's closed
    conn.on('close', () => {
      this.engine.emit(ENetworkEvent.EVENT_NETWORK_PLAYER_LEAVE, conn.peer);
    });
    conn.on('error', () => {
      this.engine.emit(ENetworkEvent.EVENT_NETWORK_PLAYER_LEAVE, conn.peer);
    });

    // Subscribe to this new player's updates (TODO - REFACTOR - watch out, there are two of these  blocks. it got me)
    conn.on('data', (data) => {
      if (typeof data !== 'string') throw new Error('data is not a string');
      this.latestConnectionStateMap.set(conn.peer, data);
      // // Handle Player update
      this.engine.emit(ENetworkEvent.EVENT_NETWORK_PLAYER_UPDATE, {
        id: conn.peer,
        data,
      });
    });

    // Close the connection if I leave
    window.addEventListener('unload', () => {
      conn.close();
    });
  }

  async init() {
    this.peer = new Peer(
      this.peerId,
      {
        host: 'localhost',
        key: 'demodemo',
        port: 9010,
        path: '/myapp',
      }
      // isLocalMode ? LOCALHOST_CONFIG : NETLIFY_CONFIG,
    );

    this.peer.on('error', (err) => {
      console.log(err.message);
    });

    // Be ready to hear from incoming connections
    this.peer.on('connection', async (conn) => {
      // console.log("conn: ", conn);
      // A new player has joined and connected to me
      // console.log("A new player has joined and connected to me: ");
      this.interactWithConnection(conn);
    });

    // Make all outgoing connections
    const otherPeerIds = await this.getAllPeerIds();

    await timeout(1000);

    for (let i = 0; i < otherPeerIds.length; i++) {
      const id = otherPeerIds[i];
      // const latestConnectionState = this.latestConnectionStateMap.get(id);

      // I joined and reached out to all the other players.
      const conn = this.peer.connect(id);
      if (!conn) {
        continue;
      }
      this.interactWithConnection(conn);
      // // Register to each player I know about
      // conn.on("open", () => {
      //   this.connectionMap.set(id, conn);
      // });

      // // // Know when it's closed
      // conn.on("close", () => {
      //   this.engine.emit(ENetworkEvent.EVENT_NETWORK_PLAYER_LEAVE, conn.peer);
      // });
      // conn.on("error", () => {
      //   this.engine.emit(ENetworkEvent.EVENT_NETWORK_PLAYER_LEAVE, conn.peer);
      // });

      // // Subscribe to their updates
      // conn.on("data", (data: TUpdateString) => {
      //   this.latestConnectionStateMap.set(conn.peer, data);
      //   //   // Handle PLAYER prefix
      //   this.engine.emit(ENetworkEvent.EVENT_NETWORK_PLAYER_UPDATE, {
      //     id: conn.peer,
      //     data,
      //   });
      // });

      // // Close the connection if I leave
      // window.addEventListener("unload", () => {
      //   conn.close();
      // });

      await timeout(200);
    }

    this.engine.on(ENetworkEvent.SYNC_LATEST_NETWORK_STATE, () => {
      this.latestConnectionStateMap.forEach((conn, key) => {
        const latestConnectionState = this.latestConnectionStateMap.get(key);
        if (latestConnectionState) {
          this.engine.emit(ENetworkEvent.EVENT_NETWORK_PLAYER_UPDATE, {
            id: key,
            data: latestConnectionState,
          });
        }
      });
    });
  }

  async getAllPeerIds() {
    // const useUrl = isLocalMode ? "http://localhost:9010" : `https://${URL}`;
    const useUrl = 'http://localhost:9010';
    const response = await fetch(`${useUrl}/myapp/demodemo/peers`);
    const peersArray = (await response.json()) as string[];
    const list = peersArray ?? [];
    return list.filter((id) => id !== this.peerId);
  }

  sendUpdate(update: string) {
    this.connectionMap.forEach((conn, key) => {
      conn.send(update);
    });
  }
}

function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
