import * as fs from 'fs';
import * as path from 'path';
import * as redis from 'socket.io-redis';
import * as SocketIO from 'socket.io';
import { config } from '../config';
const { redis: redisConfig } = config;

const createServer = (app: Express.Application, port: number) => {
  // Create HTTP Server
  const server = require('http').createServer(app);

  // Initialize SocketIO
  const io: SocketIO.Server = require('socket.io')(server, {
    path: '/socket.io',
    // transports: ['websocket'], // 웹소켓 강제 업그레이드
  });

  // SocketIO - Redis configuration
  if (redisConfig.enable) {
    const { host, port } = redisConfig;
    if (host && port > 0) {
      const redisAdapter = redis({ host, port });
      io.adapter(redisAdapter);
      redisAdapter.pubClient.on('connect', () => {
        console.log('Redis adapter pubClient connected');
      });
      redisAdapter.subClient.on('connect', () => {
        console.log('Redis adapter subClient connected');
      });
    }
  }

  // Load namespace modules
  const namespaces = fs.readdirSync(path.resolve(__dirname, 'namespaces'));
  namespaces.forEach(namespace => {
    const namespaceModule = require(path.resolve(
      __dirname,
      'namespaces',
      namespace,
    ));
    const createNamespace =
      typeof namespaceModule === 'function'
        ? namespaceModule
        : namespaceModule.default;
    createNamespace(io);
  });

  // Listen
  server.listen(port, () => {
    console.log(`Server listening on ${port} with socket.io`);
  });
};

export default createServer;
