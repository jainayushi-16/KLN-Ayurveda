const prisma = require("../../config/prisma");

class ContactRepository {
  async createContact(contactData) {
    return prisma.contact.create({ data: contactData });
  }
}

module.exports = new ContactRepository();
