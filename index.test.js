const request = require("supertest");
const { db } = require("./db/connection");
const { Musician, Band } = require("./models/index");
const app = require("./src/app");

beforeAll(async () => {
  await db.sync({ force: true });

  //create data
  await Musician.bulkCreate([
    { name: "Mick Jagger", instrument: "Vocals" },
    { name: "Keith Richards", instrument: "Guitar" },
    { name: "Charlie Watts", instrument: "Drums" },
  ]);

  await Band.bulkCreate([
    { name: "The Rolling Stones", genre: "Rock" },
    { name: "The Beatles", genre: "Rock" },
    { name: "Led Zeppelin", genre: "Rock" },
  ]);
}, 15000);

afterAll(async () => {
  await db.close();
});

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
  test("GET /musicians/bands", async () => {
    const response = await request(app).get("/musicians/bands");
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
