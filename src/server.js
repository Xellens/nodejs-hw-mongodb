import express from 'express';
import cors from 'cors';
import pino from 'pino';
import { getAllContacts, getContactById } from './services/contacts.js';

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
      res.json({
        status: 200,
        message: 'Successfully found contacts!',
        data: contacts,
      });
    } catch (error) {
      console.error('Error in /contacts route:', error);
      res.status(500).json({ message: 'Failed to fetch contacts' });
    }
  });

  app.get('/contacts/:contactId', async (req, res) => {
    try {
      const contact = await getContactById(req.params.contactId);
      if (!contact) {
        console.error(`Contact not found with ID ${req.params.contactId}`);
        return res.status(404).json({ message: 'Contact not found' });
      }
      res.json({
        status: 200,
        message: `Successfully found contact with id ${req.params.contactId}!`,
        data: contact,
      });
    } catch (error) {
      console.error(
        `Error in /contacts/:contactId route for ID ${req.params.contactId}:`,
        error,
      );
      res.status(500).json({ message: 'Failed to fetch contact' });
    }
  });

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};
