import { Contact } from '../models/Contact.js';

export const getAllContacts = async (
  userId,
  filter = {},
  countOnly = false,
  options = {},
) => {
  const finalFilter = { ...filter, userId };

  if (countOnly) {
    return Contact.countDocuments(finalFilter);
  }

  const { page = 1, perPage = 10, sortOptions = {} } = options;
  const skip = (page - 1) * perPage;

  return Contact.find(finalFilter).sort(sortOptions).skip(skip).limit(perPage);
};

export const getContactById = async (userId, contactId) => {
  return Contact.findOne({ _id: contactId, userId });
};

export const createContact = async (userId, contactData) => {
  return Contact.create({ ...contactData, userId });
};

export const updateContact = async (userId, contactId, updateData) => {
  return Contact.findOneAndUpdate({ _id: contactId, userId }, updateData, {
    new: true,
  });
};

export const deleteContactById = async (userId, contactId) => {
  return Contact.findOneAndDelete({ _id: contactId, userId });
};
