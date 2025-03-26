const { Book, MyBook } = require("../models");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

class Controllers {
  static async updateCoverById(req, res, next) {
    try {
      const { id } = req.params;
      const books = await Book.findByPk(id);
      if (!books) {
        throw { name: "NotFound", message: "Book not found" };
      }
      if (!req.file) {
        throw { name: "BadRequest", message: "Please select an image file!" };
      }
      console.log(req.file);
      const mediaType = req.file.mimetype;
      const base64Data = req.file.buffer.toString("base64");
      const base64 = `data:${mediaType};base64,${base64Data}`;

      const result = await cloudinary.uploader.upload(base64, {
        public_id: req.file.originalname,
        folder: "books-cover-url",
      });

      await books.update(
        { imageUrl: result.secure_url },
        {
          where: { id: id },
        }
      );

      res.json({
        message: `Image id ${books.title} has been updated`,
        result,
      });
    } catch (err) {
      next(err);
    }
  }

  static async generateAIContent(req, res, next) {
    try {
      const books = await Book.findAll({
        attributes: ["title", "description"],
        raw: true,
      });

      const bookList = books
        .map((book, index) => {
          return `${index + 1}. Title: ${book.title}, Description: ${
            book.description
          }`;
        })
        .join("\n");

      // Inisialisasi GoogleGenAI
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const prompt = `Saya memiliki daftar buku berikut:\n
        ${bookList}\n
        Dari daftar tersebut, pilih 5 buku terbaik berdasarkan kualitas judul dan deskripsinya. 
        Jelaskan alasan mengapa buku-buku tersebut direkomendasikan.`;

      const result = await model.generateContent(prompt);
      const response = result.response.text();

      console.log(response, "<<<<<<<");

      res.status(200).json({ result: response });
    } catch (err) {
      next(err);
    }
  }

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
