if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const errorHandler = require("./middlewares/errorHandler");
const UserControllers = require("./controllers/userControllers");
const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/register", UserControllers.register);
app.post("/login", UserControllers.login);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
