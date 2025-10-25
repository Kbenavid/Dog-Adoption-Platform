console.log("📁 File start: test/auth.test.js");

import mongoose from "mongoose";
import app from "../app.js";
import request from "supertest";
import { expect } from "chai";

console.log("✅ Using SuperTest + Chai for API testing");

describe("🐾 User Authentication API", function () {
  this.timeout(10000);

  before(async function () {
    console.log("🧹 Cleaning test users collection...");
    try {
      const User = (await import("../models/User.js")).default;
      await User.deleteMany({});
      console.log("✅ Users collection cleared");
    } catch (err) {
      console.error("⚠️ Error cleaning users:", err.message);
    }
  });

  // 🐶 1️⃣ Register test
  it("should register a new user", async function () {
    console.log("🚀 Running register test");

    const res = await request(app)
      .post("/auth/register")
      .send({
        username: "testuser_" + Date.now(),
        password: "password123",
      });

    console.log("📨 Response body:", res.body);
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property("message").that.includes("User registered");
  });

  // 🔐 2️⃣ Login test
  it("should log in the user and return a token", async function () {
    console.log("🚀 Running login test");

    const username = "loginuser_" + Date.now();
    const password = "securePass123";

    // Step 1: Register user
    await request(app).post("/auth/register").send({ username, password });

    // Step 2: Login
    const res = await request(app)
      .post("/auth/login")
      .send({ username, password });

    console.log("📨 Login response:", res.body);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("token");
    expect(res.body.token).to.be.a("string");
  });
});