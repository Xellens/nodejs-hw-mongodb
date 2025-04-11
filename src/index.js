import dotenv from 'dotenv';
dotenv.config();

import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';

initMongoConnection();
setupServer();

console.log('>>>ENV: SMTP_HOST=', process.env.SMTP_HOST);
