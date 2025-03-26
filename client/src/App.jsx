import { BrowserRouter, Routes, Route } from "react-router";
import Login from "./pages/loginPage";
import RegisterPage from "./pages/registerPage";
import HomePage from "./pages/homePage";
import AuthLayout from "./layouts/authLayout";
import MyBook from "./pages/mybooksPage";
import AIRecommendations from "./pages/recomendationPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<Login />} />
        <Route element={<AuthLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/mybooks" element={<MyBook />} />
          <Route path="/recomendation" element={<AIRecommendations />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
