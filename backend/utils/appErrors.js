class BusinessValidationError extends Error {
  constructor(messages) {
    super("Business Validation Failed"); // Mensaje interno
    this.name = "BusinessValidationError"; // Clave para el middleware
    this.messages = messages; // Array de strings
  }
}

module.exports = { BusinessValidationError };
