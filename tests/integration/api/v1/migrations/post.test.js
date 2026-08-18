import orchestrator from "tests/orchestrator.js";

import database from "infra/database.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await database.query("drop schema public cascade; create schema public;");
});

describe("POST /api/v1/migrations", () => {
  describe("Anonymous user", () => {
    describe("Running pending migrations", () => {
      test("For the first time", async () => {
        const firstPostResponse = await fetch(
          "http://localhost:3000/api/v1/migrations",
          {
            method: "POST",
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
          },
        );

        const secondPostResponseBody = await secondPostRespone.json();

        expect(secondPostRespone.status).toBe(200);
        expect(Array.isArray(secondPostResponseBody)).toBe(true);
        expect(secondPostResponseBody.length).toEqual(0);
      });
    });
  });
})

