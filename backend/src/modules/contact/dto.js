class ContactDTO {
  static toResponse(contact) {
    return {
      id: contact.id,
      name: contact.name,
      email: contact.email,
      subject: contact.subject,
      message: contact.message,
      createdAt: contact.createdAt,
    };
  }
}

module.exports = ContactDTO;
