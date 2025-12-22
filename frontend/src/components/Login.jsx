import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

function Login() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", { username: email, password });
      console.log(res);
      

localStorage.clear(); // clean old session

localStorage.setItem("accessToken", res.data.accessToken);
localStorage.setItem("role", res.data.role);

if (res.data.role === "admin") {
  navigate("/admin/dashboard");
}

if (res.data.role === "college") {
  localStorage.setItem("collegeId", res.data.profileId);
  navigate("/college/dashboard");
}

if (res.data.role === "staff") {
  localStorage.setItem("staffId", res.data.profileId);
  navigate("/staff/home");
}

if (res.data.role === "student") {
  localStorage.setItem("studentId", res.data.profileId);
  navigate("/student/home");
}

      alert("Login successful!");

    } catch (err) {
      console.log(err);
      alert(err.response?.data?.msg || "Login failed!");
    }
  };

  return (
    <>
      <div className="login-container">
        <div className="login-box">
          <h2>Welcome Back</h2>

          {/* LOGIN FORM */}
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit">Login</button>
          </form>

          {/* <p className="signup-text">
            Don't have an account?{" "}
            <span className="signup-link" onClick={() => setOpen(true)}>
              Signup
            </span>
          </p> */}
        </div>
      </div>

      {/* ===== SIGNUP MODAL ===== */}
      {open && (
        <div className="signup-modal-overlay">
          <div className="signup-modal-box">
            <h3 className="modal-title">Select Registration Type</h3>

            <div className="modal-options">
              <button
                className="modal-btn"
                onClick={() => {
                  setOpen(false);
                  navigate("/register-college");
                }}
              >
                College
              </button>

              <button
                className="modal-btn"
                onClick={() => {
                  setOpen(false);
                  navigate("/register-staff");
                }}
              >
                Staff
              </button>

              <button
                className="modal-btn"
                onClick={() => {
                  setOpen(false);
                  navigate("/register-student");
                }}
              >
                Student
              </button>
            </div>

            <button className="modal-close" onClick={() => setOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Login;
