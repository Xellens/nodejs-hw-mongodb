import { Router } from 'express';
import {
  getContacts,
  getContact,
  createNewContact,
  patchContact,
  deleteContact,
} from '../controllers/contacts.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../schemas/contacts-schemas.js';

export const contactsRouter = Router();

contactsRouter.get('/', ctrlWrapper(getContacts));

contactsRouter.get('/:contactId', isValidId, ctrlWrapper(getContact));

contactsRouter.post(
  '/',
  validateBody(createContactSchema),
  ctrlWrapper(createNewContact),
);

contactsRouter.patch(
  '/:contactId',
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(patchContact),
);

contactsRouter.delete('/:contactId', isValidId, ctrlWrapper(deleteContact));
