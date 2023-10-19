import { ExpressPeerServer } from 'peer';

import { Injectable } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

@Injectable()
export class PeerServerService {
  enablePeerServer(app: NestExpressApplication) {
    app.use(
      ExpressPeerServer(app.getHttpServer(), {
        port: 9010,
        key: "demodemo",
        path: "/peer-server",
        allow_discovery: true,
      }),
    );
  }
}
