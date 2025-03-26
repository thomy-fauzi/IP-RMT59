const { Book, MyBook } = require("../models");

class Controllers {
  static async getBooks(req, res, next) {
    try {
      const userId = req.user.id;
      const books = await Book.findAll();
      const booksWithStatus = await Promise.all(
        books.map(async (book) => {
          const isBorrowed = await MyBook.findOne({
            where: {
              BookId: book.id,
            },
          });
          return {
            ...book.toJSON(),
            status: isBorrowed ? "Borrowed" : "Available",
          };
        })
      );

      res.status(200).json(booksWithStatus);
    } catch (err) {
      next(err);
    }
  }

  static async addToMyBooks(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const book = await Book.findByPk(id);
      if (!book) {
        throw { name: "NotFound", message: "Book not found" };
      }

      const existing = await MyBook.findOne({
        where: {
          BookId: id,
        },
      });
      console.log(book.status, "<<<<<<<<");
      if (existing || book.status === "borrowed") {
        throw { name: "BadRequest", message: "The Book is already borrowed" };
      }
      const myBook = await MyBook.create({
        UserId: userId,
        BookId: id,
      });
      res.status(201).json(myBook);
    } catch (err) {
      next(err);
    }
  }

  static async myBook(req, res, next) {
    try {
      const userId = req.user.id;

      const myBook = await MyBook.findAll({
        where: { UserId: userId },
        include: [
          {
            model: Book,
            attributes: ["title", "author", "description", "imageUrl"],
          },
        ],
      });

      if (myBook.length === 0) {
        throw { name: "NotFound", message: "Book is empty" };
      }
      res.status(200).json(myBook);
    } catch (err) {
      next(err);
    }
  }

  static async updateMyBook(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const myBook = await MyBook.findOne({
        where: {
          BookId: id,
          UserId: userId,
        },
      });

      if (!myBook) {
        throw { name: "NotFound", message: "Book entry not found" };
      }

      myBook.status = "Completed";
      await myBook.save();

      res.status(200).json({ message: "Status updated to completed", myBook });
    } catch (err) {
      next(err);
    }
  }

  static async deleteMyBook(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const myBook = await MyBook.findOne({
        where: {
          BookId: id,
          UserId: userId,
        },
      });

      if (!myBook) {
        throw { name: "NotFound", message: "Book entry not found" };
      }

      await myBook.destroy();

      res.status(200).json({ message: "The book has been deleted" });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = Controllers;
