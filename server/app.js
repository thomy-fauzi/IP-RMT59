if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const UserControllers = require("./controllers/userControllers");
const Controllers = require("./controllers/controllers");
const errorHandler = require("./middlewares/errorHandler");
const authentication = require("./middlewares/authentication");
const { isAdmin } = require("./middlewares/authorization");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.get("/", (req, res) => {
  res.send("Hello Worlds!");
});

app.post("/register", UserControllers.register);
app.post("/login", UserControllers.login);
app.post("/googleLogin", UserControllers.googleLogin);

app.use(authentication);
app.get("/books", Controllers.getBooks);
app.get("/books/:id", Controllers.getBookById);
app.get("/mybooks", Controllers.myBook);
app.post("/mybooks/:id", Controllers.addToMyBooks);
app.patch("/mybooks/:id", Controllers.updateMyBook);
app.delete("/mybooks/:id", Controllers.deleteMyBook);
app.post("/generateAi", Controllers.generateAIContent);

app.patch(
  "/books/:id/cover-url",
  upload.single("coverImage"),
  isAdmin,
  Controllers.updateCoverById
);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
