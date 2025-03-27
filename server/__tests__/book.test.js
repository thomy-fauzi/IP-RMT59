const request = require("supertest");
const app = require("../app");
const { Book, MyBook } = require("../models");
const cloudinary = require("cloudinary").v2;

jest.mock("../models");
jest.mock("../middlewares/authentication", () => (req, res, next) => {
  req.user = { id: 1 }; // Mock the authenticated user
  next();
});

describe("GET /books", () => {
  it("should return a list of books with their status", async () => {
    // Mock data
    const mockBooks = [
      {
        id: 1,
        title: "Book 1",
        toJSON: jest.fn().mockReturnValue({ id: 1, title: "Book 1" }),
      },
      {
        id: 2,
        title: "Book 2",
        toJSON: jest.fn().mockReturnValue({ id: 2, title: "Book 2" }),
      },
    ];
    const mockMyBook = { BookId: 1 };

    // Mock implementations
    Book.findAll.mockResolvedValue(mockBooks);
    MyBook.findOne.mockImplementation(({ where }) => {
      return where.BookId === 1 ? mockMyBook : null;
    });

    // Perform the request
    const response = await request(app)
      .get("/books")
      .set("Authorization", "Bearer mockAccessToken");

    // Assertions
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { id: 1, title: "Book 1", status: "Borrowed" },
      { id: 2, title: "Book 2", status: "Available" },
    ]);
    expect(Book.findAll).toHaveBeenCalled();
    expect(MyBook.findOne).toHaveBeenCalledTimes(2);
  });

  it("should return a 500 error if something goes wrong", async () => {
    // Mock error
    const mockError = new Error("Database error");
    Book.findAll.mockRejectedValue(mockError);

    // Perform the request
    const response = await request(app)
      .get("/books")
      .set("Authorization", "Bearer mockAccessToken");

    // Assertions
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("message", "Internal Server Error");
  });
});

describe("GET /books/:id", () => {
  it("should return the book details when the book exists", async () => {
    // Mock data
    const mockBook = {
      id: 1,
      title: "Book 1",
      author: "Author 1",
      description: "Description 1",
      imageUrl: "http://example.com/image.jpg",
      toJSON: jest.fn().mockReturnValue({
        id: 1,
        title: "Book 1",
        author: "Author 1",
        description: "Description 1",
        imageUrl: "http://example.com/image.jpg",
      }),
    };

    // Mock implementation
    Book.findByPk.mockResolvedValue(mockBook);

    // Perform the request
    const response = await request(app)
      .get("/books/1")
      .set("Authorization", "Bearer mockAccessToken");

    // Assertions
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockBook.toJSON());
    expect(Book.findByPk).toHaveBeenCalledWith("1");
  });

  it("should return a 404 error when the book does not exist", async () => {
    // Mock implementation
    Book.findByPk.mockResolvedValue(null);

    // Perform the request
    const response = await request(app)
      .get("/books/999")
      .set("Authorization", "Bearer mockAccessToken");

    // Assertions
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Book not found");
    expect(Book.findByPk).toHaveBeenCalledWith("999");
  });

  it("should return a 500 error if something goes wrong", async () => {
    // Mock error
    const mockError = new Error("Database error");
    Book.findByPk.mockRejectedValue(mockError);

    // Perform the request
    const response = await request(app)
      .get("/books/1")
      .set("Authorization", "Bearer mockAccessToken");

    // Assertions
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("message", "Internal Server Error");
    expect(Book.findByPk).toHaveBeenCalledWith("1");
  });
});

describe("POST /mybooks/:id", () => {
  it("should add a book to the user's collection", async () => {
    const mockBook = { id: 1, status: "Available", toJSON: jest.fn() };
    const mockMyBook = { id: 1, UserId: 1, BookId: 1 };

    Book.findByPk.mockResolvedValue(mockBook);
    MyBook.findOne.mockResolvedValue(null);
    MyBook.create.mockResolvedValue(mockMyBook);

    const response = await request(app)
      .post("/mybooks/1")
      .set("Authorization", "Bearer mockAccessToken");

    expect(response.status).toBe(201);
    expect(response.body).toEqual(mockMyBook);
    expect(Book.findByPk).toHaveBeenCalledWith("1");
    expect(MyBook.findOne).toHaveBeenCalledWith({ where: { BookId: "1" } }); // Expect a number
    expect(MyBook.create).toHaveBeenCalledWith({
      UserId: 1,
      BookId: "1",
    });
  });

  it("should return 400 if the book is already borrowed", async () => {
    const mockBook = { id: 1, status: "borrowed", toJSON: jest.fn() };
    const mockMyBook = { BookId: 1 };

    Book.findByPk.mockResolvedValue(mockBook);
    MyBook.findOne.mockResolvedValue(mockMyBook);

    const response = await request(app)
      .post("/mybooks/1")
      .set("Authorization", "Bearer mockAccessToken");

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "The Book is already borrowed"
    );
  });

  it("should return 404 if the book does not exist", async () => {
    Book.findByPk.mockResolvedValue(null);

    const response = await request(app)
      .post("/mybooks/999")
      .set("Authorization", "Bearer mockAccessToken");

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Book not found");
  });
});

describe("GET /mybooks", () => {
  it("should return the user's books", async () => {
    const mockMyBooks = [
      {
        id: 1,
        UserId: 1,
        BookId: 1,
        Book: {
          title: "Book 1",
          author: "Author 1",
          description: "Description 1",
          imageUrl: "http://example.com/image.jpg",
        },
      },
    ];

    MyBook.findAll.mockResolvedValue(mockMyBooks);

    const response = await request(app)
      .get("/mybooks")
      .set("Authorization", "Bearer mockAccessToken");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockMyBooks);
    expect(MyBook.findAll).toHaveBeenCalledWith({
      where: { UserId: 1 },
      include: [
        {
          model: Book,
          attributes: ["title", "author", "description", "imageUrl"],
        },
      ],
    });
  });

  it("should return 404 if the user has no books", async () => {
    MyBook.findAll.mockResolvedValue([]);

    const response = await request(app)
      .get("/mybooks")
      .set("Authorization", "Bearer mockAccessToken");

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Book is empty");
  });
});

describe("PATCH /mybooks/:id", () => {
  it("should update the status of a user's book to 'Completed'", async () => {
    const mockMyBook = {
      id: 1,
      UserId: 1,
      BookId: 1,
      status: "Uncompleted",
      save: jest.fn(),
    };

    MyBook.findOne.mockResolvedValue(mockMyBook);

    const response = await request(app)
      .patch("/mybooks/1")
      .set("Authorization", "Bearer mockAccessToken");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Status updated to completed"
    );
    expect(mockMyBook.status).toBe("Completed");
    expect(mockMyBook.save).toHaveBeenCalled();
  });

  it("should return 404 if the book entry does not exist", async () => {
    MyBook.findOne.mockResolvedValue(null);

    const response = await request(app)
      .patch("/mybooks/999")
      .set("Authorization", "Bearer mockAccessToken");

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Book entry not found");
  });
});

describe("DELETE /mybooks/:id", () => {
  it("should delete a book from the user's collection", async () => {
    const mockMyBook = { id: 1, UserId: 1, BookId: 1, destroy: jest.fn() };

    MyBook.findOne.mockResolvedValue(mockMyBook);

    const response = await request(app)
      .delete("/mybooks/1")
      .set("Authorization", "Bearer mockAccessToken");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "The book has been deleted"
    );
    expect(mockMyBook.destroy).toHaveBeenCalled();
  });

  it("should return 404 if the book entry does not exist", async () => {
    MyBook.findOne.mockResolvedValue(null);

    const response = await request(app)
      .delete("/mybooks/999")
      .set("Authorization", "Bearer mockAccessToken");

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Book entry not found");
  });
});
