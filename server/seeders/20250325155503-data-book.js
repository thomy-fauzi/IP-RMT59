"use strict";
const fs = require("fs");
const { hashPassword } = require("../helpers/bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert("Users", [
      {
        name: "Thomy",
        email: "admin@mail.com",
        password: hashPassword("12345"),
        role: "Admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Fulan",
        email: "user1@mail.com",
        password: hashPassword("12345"),
        role: "User",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    const books = JSON.parse(fs.readFileSync("./data/books.json", "utf-8"));
    const data = books.map((book) => {
      return {
        ...book,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });
    await queryInterface.bulkInsert("Books", data, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Users", null, {});
    await queryInterface.bulkDelete("Books", null, {});
  },
};
