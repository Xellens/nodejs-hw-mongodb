import { getAllContacts, getContact } from '../services/contacts.js';

exports.getContacts = async (req, res) => {
  const contacts = await getAllContacts();
  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

exports.getContactById = async (req, res) => {
  const contact = await getContact(req.params.contactId);
  if (!contact) {
    return res.status(404).json({ message: 'Contact not found' });
  }
  res.json({
    status: 200,
    message: `Successfully found contact with id ${req.params.contactId}!`,
    data: contact,
  });
};
