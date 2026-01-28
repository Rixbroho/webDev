const request = require("supertest");
require("dotenv").config();

// const BASE_URL = `http://localhost:${process.env.PORT || 5000}`;

const BASE_URL = `http://localhost:3000`;

describe("open API tests", () => {
  it("should created a new user", async () => {
    const uniqueUsername = `testuser${Date.now()}`;
    const uniqueEmail = `testuser${Date.now()}@gmail.com`;

    const res = await request(BASE_URL).post("/api/user/register").send({
      username: uniqueUsername,
      email: uniqueEmail,
      password: "securepassword123",
    });
 
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("User created successfully");
    expect(res.body.user.email).toBe(uniqueEmail);
  });
});
