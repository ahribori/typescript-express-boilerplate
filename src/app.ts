import * as express from 'express';
import * as path from 'path';
import { config } from './config';
import createServer from './socket.io';

const port: number = config.port;
const app: express.Application = express();

// Express 내장 bodyParser
app.use(express.json());

// static asset 경로 설정
app.use('/', express.static(path.resolve('public')));

createServer(app, port);
