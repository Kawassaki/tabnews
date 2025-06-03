import database from "infra/database.js";

async function cleanDatabase() {
  await database.query("drop schema public cascade; create schema public;");
}

beforeAll(async () => {
  cleanDatabase();
});

test("POST to /api/v1/migrations should return 200", async () => {
  const firstPostResponse = await fetch(
    "http://localhost:3000/api/v1/migrations",
    {
      method: "POST",
    },
  );

  const secondPostRespone = await fetch(
    "http://localhost:3000/api/v1/migrations",
    {
      method: "POST",
    },
  );

  const firstPostResponseBody = await firstPostResponse.json();

  expect(firstPostResponse.status).toBe(201);
  expect(Array.isArray(firstPostResponseBody)).toBe(true);
  expect(firstPostResponseBody.length).toBeGreaterThan(0);

  const secondPostResponseBody = await secondPostRespone.json();

  expect(secondPostRespone.status).toBe(200);
  expect(Array.isArray(secondPostResponseBody)).toBe(true);
  expect(secondPostResponseBody.length).toEqual(0);
});
