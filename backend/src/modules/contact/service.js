const contactRepository = require("./repository");
const ContactDTO = require("./dto");

class ContactService {
  async submitContact(contactData) {
    const contact = await contactRepository.createContact(contactData);
    return ContactDTO.toResponse(contact);
  }
}

module.exports = new ContactService();
