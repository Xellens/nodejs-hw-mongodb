import express from 'express';
import { Contact } from '../models/contact.js';

export const contactsRouter = express.Router();

contactsRouter.get('/', async (req, res) => {
  try {
    console.log('📢 GET /contacts запит отримано');
    const contacts = await Contact.find();
    console.log('✅ Знайдено контакти:', contacts);
    res.json(contacts);
  } catch (error) {
    console.error('❌ Помилка при отриманні контактів:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});
