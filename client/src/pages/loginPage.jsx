import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import axios from "axios";
import Swal from "sweetalert2";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("user1@mail.com");
  const [password, setPassword] = useState("12345");

  const accessToken = localStorage.getItem("access_token");

  if (accessToken) {
    return <Navigate to="/" />;
  }

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.post("https://server.thom.web.id/login", {
        email,
        password,
      });
      console.log(data);
      localStorage.setItem("access_token", data.access_token);
      navigate("/");
    } catch (err) {
      console.log(err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err.response.data.message,
      });
    }
  };

  async function handleCredentialResponse(response) {
    console.log("Encoded JWT ID token: ", response);
    const { data } = await axios.post(
      "https://server.thom.web.id/googleLogin",
      {
        googleToken: response.credential,
      }
    );
    localStorage.setItem("access_token", data.access_token);
    navigate("/");
  }

  useEffect(() => {
    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
    });
    window.google.accounts.id.renderButton(
      document.getElementById("buttonDiv"),
      { theme: "outline", size: "large" } // customization attributes
    );
  }, []);
  return (
    <section
      className="w-100 d-flex align-items-center"
      style={{ height: "100vh" }}
    >
      <div className="w-50 d-flex justify-content-center">
        <div style={{ width: "100%", maxWidth: "400px" }}>
          <h2 className="fw-bold">Perpus OL</h2>
          <p className="text-muted mb-3">Akses ke Dasbor kamu</p>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label
                htmlFor="exampleInputEmail1"
                className="form-label text-muted"
              >
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
              <label htmlFor="password" className="form-label text-muted">
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
              Login
            </button>
            <div id="buttonDiv" className="w-100 mt-3 mb-3"></div>
            <div className="py-3 d-flex justify-content-center">
              <p>
                Dont have account?
                <Link to="/register"> Create an account</Link>
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

export default Login;
