import express from 'express';
import cors from 'cors';
import pino from 'pino';

import { getAllContacts, getContactById } from './services/contacts.js';
import { getEnvVar } from './utils/getEnvVar.js';

export const setupServer = () => {
  const app = express();
  const logger = pino();

  app.use(cors());
  app.use(express.json());

  app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
  });

  app.get('/contacts', async (req, res) => {
    try {
      const contacts = await getAllContacts();
      return res.json({
        status: 200,
        message: 'Successfully found contacts!',
        data: contacts,
      });
    } catch (error) {
      console.error('Error in GET /contacts route:', error);
      return res.status(500).json({ message: 'Failed to fetch contacts' });
    }
  });

  app.get('/contacts/:contactId', async (req, res) => {
    try {
      const { contactId } = req.params;
      const contact = await getContactById(contactId);

      if (!contact) {
        return res.status(404).json({ message: 'Contact not found' });
      }

      return res.json({
        status: 200,
        message: `Successfully found contact with id ${contactId}!`,
        data: contact,
      });
    } catch (error) {
      console.error('Error in GET /contacts/:contactId route:', error);
      return res.status(500).json({ message: 'Failed to fetch contact' });
    }
  });

  app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  const port = getEnvVar('PORT') || 3000;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};
