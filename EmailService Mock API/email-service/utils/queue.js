const EmailService = require('../controller/EmailService');
const logger = require('./logger');

class EmailQueue {
    constructor() {
        this.queue = [];
        this.processing = false;
        this.jobIds = new Set(); // ✅ Duplicate check set
    }

    addJob(emailData) {
        if (this.jobIds.has(emailData.id)) {
            logger.log(`Duplicate job ignored: ${emailData.id}`);
            return;
        }

        this.queue.push(emailData);
        this.jobIds.add(emailData.id);  // Mark as added
        logger.log(`Job added to queue: ${emailData.id}`);
        this.processQueue();
    }

    async processQueue() {
        if (this.processing) return;

        this.processing = true;

        while (this.queue.length > 0) {
            const job = this.queue.shift();
            logger.log(`Processing job: ${job.id}`);

            try {
                const result = await EmailService.send(job);
                logger.log(`Email sent with status: ${result.status}`);
            } catch (err) {
                logger.error(`Failed to send email for ${job.id}: ${err.message}`);
            }

            this.jobIds.delete(job.id); // ✅ Remove after processing
        }

        this.processing = false;
    }
}

module.exports = new EmailQueue();
