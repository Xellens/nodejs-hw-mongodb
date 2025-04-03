import { Contact } from '../models/Contact.js';

export const getAllContacts = async (
  filter = {},
  countOnly = false,
  options = {},
) => {
  if (countOnly) {
    return Contact.countDocuments(filter);
  }

  const { page = 1, perPage = 10, sortOptions = {} } = options;
  const skip = (page - 1) * perPage;

  return Contact.find(filter).sort(sortOptions).skip(skip).limit(perPage);
};

export const getContactById = async (contactId) => {
  return Contact.findById(contactId);
};

export const createContact = async (contactData) => {
  return Contact.create(contactData);
};

export const updateContact = async (contactId, updateData) => {
  return Contact.findByIdAndUpdate(contactId, updateData, { new: true });
};

export const deleteContactById = async (contactId) => {
  return Contact.findByIdAndDelete(contactId);
};
