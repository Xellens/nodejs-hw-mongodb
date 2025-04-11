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
import { authenticate } from '../middlewares/authenticate.js';
import {} from '../controllers/contacts.js';
import { upload } from '../middlewares/upload.js';

export const contactsRouter = Router();

contactsRouter.use(authenticate);

contactsRouter.get('/', ctrlWrapper(getContacts));

contactsRouter.get('/:contactId', isValidId, ctrlWrapper(getContact));

contactsRouter.post(
  '/',
  upload.single('photo'),
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
