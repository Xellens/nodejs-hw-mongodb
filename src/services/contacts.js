import Contact from '../models/Contact.js';

const getContactById = async (contactId) => {
  try {
    const contact = await Contact.findById(contactId);
    if (!contact) {
      console.error(`Contact with ID ${contactId} not found`);
      return null;
    }
    return contact;
  } catch (error) {
    console.error(`Error fetching contact with ID ${contactId}:`, error);
    throw new Error('Failed to fetch contact');
  }
};

const getAllContacts = async () => {
  try {
    const contacts = await Contact.find();
    return contacts;
  } catch (error) {
    console.error('Error fetching contacts:', error);
    throw new Error('Failed to fetch contacts');
  }
};

export { getAllContacts, getContactById };
