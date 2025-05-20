// install dependencies
const { execSync } = require("child_process");
execSync("npm install");
execSync("npm run seed");

const request = require("supertest");
const { db } = require("./db/connection");
const { Musician, Band } = require("./models/index");
const app = require("./src/app");
const { seedMusician } = require("./seedData");
describe("./musicians endpoint", () => {
  // Write your tests here
  test("GET /musicians", async () => {
    const response = await request(app).get("/musicians");
    const responseData = JSON.parse(response.text);
    expect(response.statusCode).toBe(200);
    expect(responseData.length).toBe(3);
    expect(responseData[0].name).toBe("Mick Jagger");
  });
});

describe("./bands endpoint", () => {
  // Write your tests here
  test("GET /bands", async () => {
    const response = await request(app).get("/bands");
    expect(response.statusCode).toBe(200);
  });

  test("GET /musicians/:id", async () => {
    const response = await request(app).get("/musicians/1");
    const responseData = JSON.parse(response.text);
    expect(response.statusCode).toBe(200);
    expect(responseData.name).toBe("Mick Jagger");
  });

  test("POST /musicians", async () => {
    const response = await request(app)
      .post("/musicians")
      .send({ name: "Billy Joel", instrument: "Guitar" });
    const responseData = JSON.parse(response.text);
    expect(response.statusCode).toBe(200);
    expect(responseData.name).toBe("Billy Joel");
  });

  test("PUT /musicians/:id", async () => {
    const response = await request(app).put("/musicians/1").send({
      name: "Black Eyed Pees",
      instrument: "Vocals",
    });
    const responseData = JSON.parse(response.text);
    expect(response.statusCode).toBe(200);
    expect(responseData.name).toBe("Black Eyed Pees");
  });

  test("DELETE /musicians/:id", async () => {
    const response = await request(app).delete("/musicians/1");
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('{"message":"Musician deleted"}');
  });
});
