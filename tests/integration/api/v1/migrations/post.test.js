import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

let migrationFilePath;
afterAll(async () => {
  if (migrationFilePath) {
    orchestrator.removePendingMigration(migrationFilePath.toString());
  }
});

describe("POST /api/v1/migrations", () => {
  describe("Anonymous user", () => {
    test("Running pending migrations", async () => {
      const response = await fetch("http://localhost:3000/api/v1/migrations", {
        method: "POST",
      });
      expect(response.status).toBe(403);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ForbiddenError",
        message: "User does not have permission to perform this action",
        action: "Check if the user has the feature: create:migration",
        status_code: 403,
      });
    });
  });

  describe("Default user", () => {
    test("Running pending migrations", async () => {
      const privilegedUser = await orchestrator.createUser();
      const activatedPrivilegedUser =
        await orchestrator.activateUser(privilegedUser);
      const privilegedUserSessionObject = await orchestrator.createSession(
        activatedPrivilegedUser.id,
      );

      const response = await fetch("http://localhost:3000/api/v1/migrations", {
        method: "POST",
        headers: {
          Cookie: `session_id=${privilegedUserSessionObject.token}`,
        },
      });
      expect(response.status).toBe(403);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ForbiddenError",
        message: "User does not have permission to perform this action",
        action: "Check if the user has the feature: create:migration",
        status_code: 403,
      });
    });
  });

  describe("Privileged user", () => {
    describe("Running pending migrations", () => {
      let privilegedUserSessionObject;

      test("For the first time", async () => {
        const privilegedUser = await orchestrator.createUser();
        const activatedPrivilegedUser =
          await orchestrator.activateUser(privilegedUser);
        await orchestrator.addFeatureToUser(activatedPrivilegedUser, [
          "create:migration",
        ]);
        privilegedUserSessionObject = await orchestrator.createSession(
          activatedPrivilegedUser.id,
        );

        migrationFilePath = orchestrator.createPendingMigration();

        const firstPostResponse = await fetch(
          "http://localhost:3000/api/v1/migrations",
          {
            method: "POST",
            headers: {
              Cookie: `session_id=${privilegedUserSessionObject.token}`,
            },
          },
        );

        const firstPostResponseBody = await firstPostResponse.json();

        expect(firstPostResponse.status).toBe(201);
        expect(Array.isArray(firstPostResponseBody)).toBe(true);
        expect(firstPostResponseBody.length).toBeGreaterThan(0);
      });

      test("For the second time", async () => {
        const secondPostRespone = await fetch(
          "http://localhost:3000/api/v1/migrations",
          {
            method: "POST",
            headers: {
              Cookie: `session_id=${privilegedUserSessionObject.token}`,
            },
          },
        );

        const secondPostResponseBody = await secondPostRespone.json();

        expect(secondPostRespone.status).toBe(200);
        expect(Array.isArray(secondPostResponseBody)).toBe(true);
        expect(secondPostResponseBody.length).toEqual(0);
      });
    });
  });
});
