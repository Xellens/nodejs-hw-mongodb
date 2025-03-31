import { Router } from 'express';
import {
  getContacts,
  getContact,
  createNewContact,
  patchContact,
  deleteContact,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

export const contactsRouter = Router();

contactsRouter.get('/', ctrlWrapper(getContacts));

contactsRouter.get('/:contactId', ctrlWrapper(getContact));

contactsRouter.post('/', ctrlWrapper(createNewContact));

contactsRouter.patch('/:contactId', ctrlWrapper(patchContact));

contactsRouter.delete('/:contactId', ctrlWrapper(deleteContact));
