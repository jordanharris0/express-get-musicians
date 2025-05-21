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
    { name: "Drake", instrument: "Vocals" },
    { name: "Metro Boomin", instrument: "Beats" },
    { name: "The Kid Laroi", instrument: "Vocals" },
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

  // Test the GET /musicians endpoint
  test("GET /musicians", async () => {
    const response = await request(app).get("/musicians");
    const responseData = JSON.parse(response.text);
    expect(response.statusCode).toBe(200);
    expect(responseData.length).toBe(6);
    expect(responseData[0].name).toBe("Mick Jagger");
  });

  // Test the GET /musicians/:id endpoint
  test("GET /musicians/:id", async () => {
    const response = await request(app).get("/musicians/1");
    const responseData = JSON.parse(response.text);
    expect(response.statusCode).toBe(200);
    expect(responseData.name).toBe("Mick Jagger");
  });

  // Test the POST /musicians endpoint with server side validation
  test("POST /musicians server side validation", async () => {
    const response = await request(app).post("/musicians").send({
      name: "",
      instrument: "",
    });

    const responseData = JSON.parse(response.text);
    expect(response.statusCode).toBe(400);

    expect(responseData.errors[0].path).toBe("name");
    expect(responseData.errors[1].msg).toBe(
      "Name must be between 2 and 20 characters"
    );

    expect(responseData.errors[2].path).toBe("instrument");
    expect(responseData.errors[3].msg).toBe(
      "Instrument must be between 2 and 20 characters"
    );
  });

  // Test the POST /musicians endpoint
  test("POST /musicians", async () => {
    const response = await request(app)
      .post("/musicians")
      .send({ name: "Billy Joel", instrument: "Guitar" });
    const responseData = JSON.parse(response.text);
    expect(response.statusCode).toBe(200);
    expect(responseData.name).toBe("Billy Joel");
  });

  // Test the PUT /musicians/:id endpoint with server side validation
  test("PUT /musicians/:id server side validation", async () => {
    const response = await request(app).put("/musicians/1").send({
      name: "",
      instrument: "",
    });

    const responseData = JSON.parse(response.text);
    expect(response.statusCode).toBe(400);

    expect(responseData.errors[0].path).toBe("name");
    expect(responseData.errors[1].msg).toBe(
      "Name must be between 2 and 20 characters"
    );

    expect(responseData.errors[2].path).toBe("instrument");
    expect(responseData.errors[3].msg).toBe(
      "Instrument must be between 2 and 20 characters"
    );
  });

  // Test the PUT /musicians/:id endpoint
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

// Test the /bands endpoint
describe("./bands endpoint", () => {
  // Write your tests here

  // Test the GET /bands endpoint
  test("GET /bands", async () => {
    const response = await request(app).get("/bands");
    expect(response.statusCode).toBe(200);
  });

  // Test the GET /bands adn their musicians endpoint
  test("GET /bands and their musicians", async () => {
    //get all musicians
    const [mick, keith, charlie, drake, metro, laroi] =
      await Musician.findAll();

    //add musicians to bands
    const band1 = await Band.findByPk(1);
    await band1.addMusicians([mick.id, keith.id]);

    const band2 = await Band.findByPk(2);
    await band2.addMusicians([charlie.id, drake.id]);

    const band3 = await Band.findByPk(3);
    await band3.addMusicians([metro.id, laroi.id]);

    const response = await request(app).get("/bands");

    expect(response.statusCode).toBe(200);
    expect(response.body[0].musicians.length).toBe(2);
  });
});
