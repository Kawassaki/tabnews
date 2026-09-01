import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
  await orchestrator.deleteAllEmails();
});

describe("Use Case: Registration Flow (all successful)", () => {
  test("Create User Account", async () => {
    const response = await fetch("http://localhost:3000/api/v1/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "contacto",
        email: "contacto@gmail.com",
        password: "senha123",
      }),
    });

    expect(response.status).toBe(201);

    const responseBody = await response.json();
    expect(responseBody).toEqual({
      id: responseBody.id,
      username: "contacto",
      email: "contacto@gmail.com",
      features: ["read:activation_token"],
      password: responseBody.password,
      created_at: responseBody.created_at,
      updated_at: responseBody.updated_at,
    });
  });

  test("Recieve activation email", async () => {});

  test("Activate user account", async () => {});

  test("Login", async () => {});

  test("Get User Information", async () => {});
});
