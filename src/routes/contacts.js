import express from 'express';
import { getAllContacts, getContactById } from '../services/contacts.js';

export const contactsRouter = express.Router();

contactsRouter.get('/', getAllContacts);
contactsRouter.get('/:contactId', getContactById);
