import createError from 'http-errors';
import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContactById,
} from '../services/contacts.js';

import { uploadImageBuffer } from '../services/cloudinary.js';

export const getContacts = async (req, res) => {
  const userId = req.user._id;
  let {
    page = 1,
    perPage = 10,
    sortBy = 'name',
    sortOrder = 'asc',
    type,
    isFavourite,
  } = req.query;

  page = parseInt(page);
  perPage = parseInt(perPage);

  const filter = {};
  if (type) {
    filter.contactType = type;
  }
  if (typeof isFavourite !== 'undefined') {
    filter.isFavourite = isFavourite === 'true';
  }

  const sortOptions = {};
  if (sortBy) {
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
  }

  const totalItems = await getAllContacts(userId, filter, true);

  const totalPages = Math.ceil(totalItems / perPage);

  if (page > totalPages && totalPages !== 0) {
    throw createError(404, 'No results found on this page');
  }

  const contacts = await getAllContacts(userId, filter, false, {
    page,
    perPage,
    sortOptions,
  });

  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: {
      data: contacts,
      page,
      perPage,
      totalItems,
      totalPages,
      hasPreviousPage: page > 1,
      hasNextPage: page < totalPages,
    },
  });
};

export const getContact = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  const contact = await getContactById(userId, contactId);
  if (!contact) {
    throw createError(404, 'Contact not found');
  }

  res.json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createNewContact = async (req, res) => {
  const userId = req.user._id;
  const { name, phoneNumber, email, isFavourite, contactType } = req.body;

  let photoUrl = null;
  if (req.file) {
    const result = await uploadImageBuffer(req.file.buffer);
    photoUrl = result.secure_url;
  }

  const newContact = await createContact(userId, {
    name,
    phoneNumber,
    email,
    isFavourite,
    contactType,
    photo: photoUrl,
  });

  return res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
};

export const patchContact = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  const updatedContact = await updateContact(userId, contactId, req.body);

  if (!updatedContact) {
    throw createError(404, 'Contact not found');
  }

  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updatedContact,
  });
};

export const deleteContact = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  const result = await deleteContactById(userId, contactId);

  if (!result) {
    throw createError(404, 'Contact not found');
  }

  res.status(204).send();
};
