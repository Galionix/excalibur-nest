// import { ExpressPeerServer } from 'peer';

import { PeerServer } from 'peer';

import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    methods: 'GET, PUT, POST, DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  await app.init();
  const config = app.get(ConfigService);

  const port = config.get<number>('API_PORT');
  // const server = app.getHttpServer();

  await app.listen(port, () => {
    Logger.log(
      `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
    );
  });
}

bootstrap();

// const { PeerServer } = require("peer");

// const PORT = 9010;

// const peerServer = PeerServer({
//   port: PORT,
//   key: 'demodemo',
//   path: '/myapp',
//   allow_discovery: true,
// });

// peerServer.on('connection', (c) => {
//   console.log('connection ID:', c);
// });

// peerServer.on("disconnect", (c) => {
//   // @ts-ignore

//   console.log("disconnect!", c.id);
// });

// console.log(`Running Peer JS Server on port ${PORT}.`);
