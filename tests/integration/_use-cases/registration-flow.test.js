import activation from "models/activation";
import orchestrator from "tests/orchestrator.js";
import webserver from "infra/webserver.js";
import user from "models/user.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
  await orchestrator.deleteAllEmails();
});

describe("Use Case: Registration Flow (all successful)", () => {
  let createUserResponseBody;
  let activationTokenId;
  let createSessionResponseBody;
  test("Create User Account", async () => {
    const response = await fetch("http://localhost:3000/api/v1/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "RegistrationFlow",
        email: "registration-flow@gmail.com",
        password: "password123",
      }),
    });

    expect(response.status).toBe(201);

    createUserResponseBody = await response.json();
    expect(createUserResponseBody).toEqual({
      id: createUserResponseBody.id,
      username: "RegistrationFlow",
      features: ["read:activation_token"],
      created_at: createUserResponseBody.created_at,
      updated_at: createUserResponseBody.updated_at,
    });
  });

  test("Recieve activation email", async () => {
    const lastEmail = await orchestrator.getLastEmail();

    expect(lastEmail.sender).toBe("<contato@kawassaki.com.br>");
    expect(lastEmail.recipients[0]).toBe("<registration-flow@gmail.com>");
    expect(lastEmail.subject).toBe("Activate your account on FinTab");
    expect(lastEmail.text).toContain("RegistrationFlow");

    activationTokenId = orchestrator.extractUUID(lastEmail.text);
    const activationTokenFound =
      await activation.findOneValidById(activationTokenId);

    expect(lastEmail.text).toContain(
      `${webserver.origin}/register/activate/${activationTokenId}`,
    );
    expect(activationTokenFound.id).toBe(activationTokenId);
    expect(activationTokenFound.user_id).toBe(createUserResponseBody.id);
    expect(activationTokenFound.used_at).toBeNull();
  });

  test("Activate user account", async () => {
    const activationResponse = await fetch(
      `http://localhost:3000/api/v1/activations/${activationTokenId}`,
      {
        method: "PATCH",
      },
    );

    expect(activationResponse.status).toBe(200);

    const activationResponseBody = await activationResponse.json();

    expect(Date.parse(activationResponseBody.used_at)).not.toBeNaN();

    const actvatedUser = await user.findOneByUsername("RegistrationFlow");
    expect(actvatedUser.features).toEqual([
      "create:session",
      "read:session",
      "update:user",
      "read:status",
    ]);
  });

  test("Login", async () => {
    const response = await fetch("http://localhost:3000/api/v1/sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "registration-flow@gmail.com",
        password: "password123",
      }),
    });
    expect(response.status).toBe(201);

    createSessionResponseBody = await response.json();
    expect(createSessionResponseBody.user_id).toBe(createUserResponseBody.id);
  });

  test("Get User Information", async () => {
    const userResponse = await fetch("http://localhost:3000/api/v1/user", {
      headers: {
        Cookie: `session_id=${createSessionResponseBody.token}`,
      },
    });
    expect(userResponse.status).toBe(200);

    const userResponseBody = await userResponse.json();
    expect(userResponseBody.id).toEqual(createUserResponseBody.id);
  });
});
