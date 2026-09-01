import email from "infra/email.js";
import orchestrator from "tests/orchestrator.js";

describe("infra/email.js", () => {
  beforeAll(async () => {
    await orchestrator.waitForAllServices();
  });

  test("send()", async () => {
    await orchestrator.deleteAllEmails();
    await email.send({
      from: "TestSend <test@send.com>",
      to: "test@send.com",
      subject: "Test Email Subject",
      text: "Test Email Body",
    });
    await email.send({
      from: "TestSend <test@send.com>",
      to: "test@send.com",
      subject: "Last Email Sent Subject",
      text: "Last Email Sent Body",
    });

    const lastEmail = await orchestrator.getLastEmail();
    expect(lastEmail.sender).toBe("<test@send.com>");
    expect(lastEmail.recipients[0]).toBe("<test@send.com>");
    expect(lastEmail.subject).toBe("Last Email Sent Subject");
    expect(lastEmail.text).toBe("Last Email Sent Body\n");
  });
});
