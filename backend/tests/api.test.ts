import request from "supertest";
import app from "../src/infrastructure/server/app";

describe("API Test", () => {
  test("GET /routes should return data", async () => {
    const res = await request(app).get("/routes");

    expect(res.status).toBe(200);
  });
});