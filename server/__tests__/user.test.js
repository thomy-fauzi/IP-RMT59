const request = require("supertest");
const app = require("../app");
const { User } = require("../models");
const { comparePassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const { OAuth2Client } = require("google-auth-library");

jest.mock("../models");
jest.mock("../helpers/bcrypt");
jest.mock("../helpers/jwt");
jest.mock("google-auth-library");

describe("UserControllers", () => {
  describe("POST /register", () => {
    it("should register a new user and return 201 with user data", async () => {
      const mockUser = { id: 1, name: "John Doe", email: "john@example.com" };
      User.create.mockResolvedValue(mockUser);

      const response = await request(app).post("/register").send({
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
      });
      expect(User.create).toHaveBeenCalledWith({
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      });
    });

    it("should return 500 if an error occurs", async () => {
      User.create.mockRejectedValue(new Error("Database error"));

      const response = await request(app).post("/register").send({
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("message", "Internal Server Error");
    });
  });

  describe("POST /login", () => {
    it("should log in a user and return 200 with access token", async () => {
      const mockUser = {
        id: 1,
        email: "john@example.com",
        password: "hashedPassword",
        role: "User",
      };
      User.findOne.mockResolvedValue(mockUser);
      comparePassword.mockReturnValue(true);
      signToken.mockReturnValue("mockAccessToken");

      const response = await request(app).post("/login").send({
        email: "john@example.com",
        password: "password123",
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        access_token: "mockAccessToken",
        role: "User",
      });
      expect(User.findOne).toHaveBeenCalledWith({
        where: { email: "john@example.com" },
      });
      expect(comparePassword).toHaveBeenCalledWith(
        "password123",
        "hashedPassword"
      );
      expect(signToken).toHaveBeenCalledWith({ id: mockUser.id });
    });

    it("should return 401 if email or password is invalid", async () => {
      User.findOne.mockResolvedValue(null);

      const response = await request(app).post("/login").send({
        email: "invalid@example.com",
        password: "password123",
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty(
        "message",
        "Invalid email or password"
      );
    });
  });

  describe("POST /googleLogin", () => {
    it("should log in or register a user using Google and return 200 with access token", async () => {
      const mockPayload = { email: "john@example.com", name: "John Doe" };
      const mockTicket = { getPayload: jest.fn().mockReturnValue(mockPayload) };
      const mockUser = { id: 1, email: "john@example.com", role: "User" };

      OAuth2Client.prototype.verifyIdToken.mockResolvedValue(mockTicket);
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue(mockUser);
      signToken.mockReturnValue("mockAccessToken");

      const response = await request(app).post("/googleLogin").send({
        googleToken: "mockGoogleToken",
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        access_token: "mockAccessToken",
        role: "User",
      });
      expect(OAuth2Client.prototype.verifyIdToken).toHaveBeenCalledWith({
        idToken: "mockGoogleToken",
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      expect(User.findOne).toHaveBeenCalledWith({
        where: { email: "john@example.com" },
      });
      expect(User.create).toHaveBeenCalledWith(
        {
          name: "John Doe",
          email: "john@example.com",
          password: expect.any(String),
        },
        { hooks: false }
      );
      expect(signToken).toHaveBeenCalledWith({ id: mockUser.id });
    });

    it("should return 500 if an error occurs", async () => {
      OAuth2Client.prototype.verifyIdToken.mockRejectedValue(
        new Error("Google error")
      );

      const response = await request(app).post("/googleLogin").send({
        googleToken: "mockGoogleToken",
      });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("message", "Internal Server Error");
    });
  });
});
