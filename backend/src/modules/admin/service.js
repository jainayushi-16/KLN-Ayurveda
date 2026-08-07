const adminRepository = require("./repository");

class AdminService {
  async getDashboardStats() {
    return adminRepository.getDashboardStats();
  }

  async createProduct(data) {
    return adminRepository.createProduct(data);
  }

  async updateOrderStatus(orderId, status) {
    return adminRepository.updateOrderStatus(orderId, status);
  }

  async getAllCustomers() {
    return adminRepository.getAllCustomers();
  }
}

module.exports = new AdminService();
