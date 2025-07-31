module.exports = {
  sendEmail: async (emailData) => {
    if (Math.random() < 0.5) throw new Error("ProviderB failed");
    return { success: true };
  }
};