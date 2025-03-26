import { NavLink, useNavigate } from "react-router";
import Button from "./button";

function Navbar() {
  const navigate = useNavigate();
  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm px-4">
      <div className="container-fluid">
        <NavLink
          className="navbar-brand fw-bold fst-italic text-primary"
          to="/"
        >
          Perpus OL
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <NavLink className="nav-link mx-3 fw-medium" to="/">
                Beranda
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link mx-3 fw-medium" to="/mybooks">
                My Books
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link mx-3 fw-medium" to="/recomendation">
                Recommendation
              </NavLink>
            </li>
          </ul>

          <button
            className="btn btn-primary rounded-pill px-4"
            onClick={() => {
              localStorage.removeItem("access_token");
              navigate("/login");
            }}
          >
            Keluar
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
