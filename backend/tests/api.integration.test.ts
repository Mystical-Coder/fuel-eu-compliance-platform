import request from "supertest";
import app from "../src/infrastructure/server/app";

describe("API Integration Tests", () => {

  it("GET /routes should return routes", async () => {
    const res = await request(app).get("/routes");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("GET /routes/comparison should return comparison data", async () => {
    const res = await request(app).get("/routes/comparison");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("GET /compliance/cb?year=2024 should return CB data", async () => {
    const res = await request(app).get("/compliance/cb?year=2024");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("POST /pools should create pool", async () => {
    const res = await request(app)
      .post("/pools")
      .send({ routeIds: ["R002", "R006", "R001"] });

    expect(res.status).toBe(200);
    expect(res.body.poolId).toBeDefined();
    expect(res.body.members.length).toBeGreaterThan(0);
  });

});