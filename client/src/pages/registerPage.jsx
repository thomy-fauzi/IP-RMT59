import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import axios from "axios";
import Swal from "sweetalert2";

function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const accessToken = localStorage.getItem("access_token");

  if (accessToken) {
    return <Navigate to="/" />;
  }

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`https://server.thom.web.id/register`, {
        name,
        email,
        password,
      });
      navigate(`/login`);
    } catch (err) {
      console.log(err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err.response.data.message,
      });
    }
  };

  return (
    <section
      className="w-100 d-flex align-items-center"
      style={{ height: "100vh" }}
    >
      <div className="w-50 d-flex justify-content-center">
        <div style={{ width: "100%", maxWidth: "400px" }}>
          <h1 className="text-center fw-bold mb-4">Create your account</h1>
          <form onSubmit={handleRegister}>
            <div className="mb-3">
              <label htmlFor="nama" className="form-label">
                Nama
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                className="form-control"
                id="fullName"
                placeholder="Name"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                E-mail
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                placeholder="Email"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                className="form-control"
                id="exampleInputPassword1"
                placeholder="Password"
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Register
            </button>
            <div className="py-3 d-flex justify-content-center">
              <p>
                You have account?
                <Link to="/login"> Login now</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
      <div className="w-50">
        <img
          src="https://png.pngtree.com/png-clipart/20230821/original/pngtree-online-library-digital-education-background-with-distance-learning-picture-image_8147913.png"
          alt="Gambar"
          className="w-100 h-100 object-cover"
        />
      </div>
    </section>
  );
}

export default RegisterPage;
