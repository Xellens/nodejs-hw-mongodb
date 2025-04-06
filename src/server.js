import express from 'express';
import cors from 'cors';
import pino from 'pino';
import { authRouter } from './routers/auth.js';
import { contactsRouter } from './routers/contacts.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import cookieParser from 'cookie-parser';

export const setupServer = () => {
  const app = express();
  const logger = pino();

  app.use(cors());
  app.use(express.json());

  app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
  });
  app.use(cookieParser());

  app.use(express.json());

  app.use('/auth', authRouter);

  app.use('/contacts', contactsRouter);

  app.use(notFoundHandler);

  app.use(errorHandler);

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};
