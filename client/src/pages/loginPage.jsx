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
      const { data } = await axios.post("http://localhost:3000/login", {
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
    const { data } = await axios.post("http://localhost:3000/googleLogin", {
      googleToken: response.credential,
    });
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
          <h2 className="text-center mb-4">Login to your Account</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
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
            <div id="buttonDiv"></div>
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
          src="https://static.vecteezy.com/system/resources/thumbnails/012/024/324/small/a-person-using-a-smartphone-to-fill-out-a-registration-form-registration-register-fill-in-personal-data-use-the-application-vector.jpg"
          alt="Gambar"
          className="w-100 h-100 object-cover"
        />
      </div>
    </section>
  );
}

export default Login;
