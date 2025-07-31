const EmailService = require("../controller/EmailService");
const rateLimiter = require("../config/rateLimiter");



describe("Email Service", () => {
  test("Should send email with status sent or failed", async () => {
    const res = await EmailService.send({ id: "123", to: "user@example.com" });
    expect(["sent", "failed", "rate_limit_exceeded"]).toContain(res.status);
  });

  test("Should return duplicate for same id", async () => {
    await EmailService.send({ id: "dup1", to: "user@example.com" });
    const res2 = await EmailService.send({ id: "dup1", to: "user@example.com" });
    expect(res2.status).toBe("duplicate");
  });
});
