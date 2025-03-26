import { BrowserRouter, Routes, Route } from "react-router";
import Login from "./pages/loginPage";
import RegisterPage from "./pages/registerPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<h1>Home</h1>} />
        <Route path="/mybooks" element={<h1>My Books</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
