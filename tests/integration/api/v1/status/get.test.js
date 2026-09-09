import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET /api/v1/status", () => {
  describe("Anonymous user", () => {
    test("Retrieving current system status", async () => {
      const response = await fetch("http://localhost:3000/api/v1/status");
      expect(response.status).toBe(200);

      const responseBody = await response.json();

      const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();
      expect(responseBody.updated_at).toEqual(parsedUpdatedAt);

      expect(responseBody).toEqual({
        updated_at: responseBody.updated_at,
        dependencies: {
          database: {
            max_connections: responseBody.dependencies.database.max_connections,
            opened_connections:
              responseBody.dependencies.database.opened_connections,
          },
        },
      });
    });
  });

  describe("Default user", () => {
    test("Retrieving current system status", async () => {
      const createdUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(createdUser);
      const sessionObject = await orchestrator.createSession(activatedUser.id);

      const response = await fetch("http://localhost:3000/api/v1/status", {
        headers: {
          Cookie: `session_id=${sessionObject.token}`,
        },
      });
      expect(response.status).toBe(200);

      const responseBody = await response.json();

      const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();
      expect(responseBody.updated_at).toEqual(parsedUpdatedAt);

      expect(responseBody).toEqual({
        updated_at: responseBody.updated_at,
        dependencies: {
          database: {
            max_connections: responseBody.dependencies.database.max_connections,
            opened_connections:
              responseBody.dependencies.database.opened_connections,
          },
        },
      });
    });
  });

  describe("Privileged user", () => {
    test("With `read:status:all` feature", async () => {
      const privilegedUser = await orchestrator.createUser();
      const activatedPrivilegedUser =
        await orchestrator.activateUser(privilegedUser);

      await orchestrator.addFeatureToUser(activatedPrivilegedUser, [
        "read:status:all",
      ]);
      const sessionObject = await orchestrator.createSession(
        activatedPrivilegedUser.id,
      );

      const response = await fetch("http://localhost:3000/api/v1/status", {
        headers: {
          Cookie: `session_id=${sessionObject.token}`,
        },
      });
      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        updated_at: responseBody.updated_at,
        dependencies: {
          database: {
            version: responseBody.dependencies.database.version,
            max_connections: responseBody.dependencies.database.max_connections,
            opened_connections:
              responseBody.dependencies.database.opened_connections,
          },
        },
      });
    });
  });
});
