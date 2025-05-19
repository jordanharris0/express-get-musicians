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
});
