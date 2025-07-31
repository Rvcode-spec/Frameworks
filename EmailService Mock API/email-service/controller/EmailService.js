const Provider1 = require("../services/Provider1");
const Provider2 = require("../services/Provider2");
const circuitBreaker = require("../utils/circuitBreaker");
const rateLimiter = require("../config/rateLimiter");
const logger = require("../utils/logger");

class EmailService {
  constructor() {
    this.providers = [Provider1, Provider2];
    this.sentEmailCache = new Set();
    this.statusMap = new Map();
  
  }

  async send(emailData) {          // Status track 
    const { id } = emailData;

    if (this.sentEmailCache.has(id)) {           // Duplicate Check
       logger.log(`Duplicate email detected for ID: ${id}`);
      return { status: "duplicate", provider: "Already Sent" };
    }

    if (!rateLimiter.allow()) {
      return { status: "rate_limit_exceeded" };  // rate 
    }

    const providerNames = ["Provider1", "Provider2"];
    for (let i = 0; i < this.providers.length; i++) {
      const provider = this.providers[i];
      const cb = circuitBreaker.wrap(provider.sendEmail);

      
      for (let attempt = 1; attempt <= 3;  attempt++) {
        try {
          const response = await cb(emailData);
          if (response && response.success) {
              this.sentEmailCache.add(id);
             this.statusMap.set(id, "sent");
             return { status: "sent", provider: providerNames[i] };
          }
      
        } catch (err) {
          logger.error(`Attempt ${attempt} failed with provider ${i}: ${err.message}`);
          await new Promise(res => setTimeout(res, 2 ** attempt * 100));
        }
      }
    }

    this.statusMap.set(id, "failed");
    return { status: "failed" };
  }

  setStatus(id, status) {
  emailStatusMap.set(id, status);
}

  getStatus(id) {
    return this.statusMap.get(id) || "unknown";
  }
}

module.exports = new EmailService();