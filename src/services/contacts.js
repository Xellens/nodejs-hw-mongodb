import Contact from '../models/Contact.js';

export const getAllContacts = async () => {
  return Contact.find();
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
