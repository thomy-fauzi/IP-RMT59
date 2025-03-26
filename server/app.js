if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const cors = require("cors");
const UserControllers = require("./controllers/userControllers");
const Controllers = require("./controllers/controllers");
const errorHandler = require("./middlewares/errorHandler");
const authentication = require("./middlewares/authentication");

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.post("/register", UserControllers.register);
app.post("/login", UserControllers.login);

app.use(authentication);
app.get("/books", Controllers.getBooks);
app.get("/mybooks", Controllers.myBook);
app.post("/mybooks/:id", Controllers.addToMyBooks);
app.patch("/mybooks/:id", Controllers.updateMyBook);
app.delete("/mybooks/:id", Controllers.deleteMyBook);
app.post("/generateAi", Controllers.generateAIContent);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
