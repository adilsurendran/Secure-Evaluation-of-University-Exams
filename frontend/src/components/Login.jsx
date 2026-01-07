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
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .login-page-wrapper {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
          font-family: 'Inter', sans-serif;
          padding: 20px;
        }

        .login-card {
          display: flex;
          width: 100%;
          max-width: 900px;
          background: white;
          border-radius: 24px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          overflow: hidden;
          transition: transform 0.3s ease;
        }

        .login-card:hover {
          transform: translateY(-5px);
        }

        /* Left Panel - Branding */
        .login-branding {
          flex: 1;
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
          padding: 60px 40px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        /* Decorative Shapes */
        .decorative-shape {
          position: absolute;
          border-radius: 50px;
          opacity: 0.6;
          transform: rotate(-45deg);
          background: linear-gradient(135deg, #f97316 0%, #fb923c 100%);
        }

        .shape-1 {
          width: 120px;
          height: 80px;
          bottom: 120px;
          left: 40px;
        }

        .shape-2 {
          width: 100px;
          height: 70px;
          bottom: 80px;
          left: 80px;
        }

        .shape-3 {
          width: 90px;
          height: 60px;
          bottom: 50px;
          left: 120px;
        }

        .branding-content {
          position: relative;
          z-index: 1;
        }

        .branding-content h1 {
          font-size: 32px;
          font-weight: 700;
          color: white;
          margin-bottom: 16px;
          line-height: 1.2;
        }

        .branding-content p {
          font-size: 15px;
          color: rgba(255, 255, 255, 0.9);
          line-height: 1.6;
        }

        /* Right Panel - Form */
        .login-form-panel {
          flex: 1;
          padding: 60px 40px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .form-header {
          margin-bottom: 32px;
        }

        .form-header h2 {
          font-size: 28px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 8px;
        }

        .form-header p {
          font-size: 14px;
          color: #64748b;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .input-group {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
          font-size: 18px;
          pointer-events: none;
        }

        .login-form input {
          width: 100%;
          padding: 14px 16px 14px 48px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 15px;
          background: #f8fafc;
          transition: all 0.3s ease;
          font-family: 'Inter', sans-serif;
          color: #1e293b;
        }

        .login-form input:focus {
          outline: none;
          border-color: #3b82f6;
          background: white;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }

        .login-form input::placeholder {
          color: #94a3b8;
        }

        .submit-button {
          width: 100%;
          padding: 14px 24px;
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          color: white;
          border: none;
          border-radius: 50px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'Inter', sans-serif;
          margin-top: 8px;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        }

        .submit-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
        }

        .submit-button:active {
          transform: translateY(0);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .login-card {
            flex-direction: column;
            max-width: 500px;
          }

          .login-branding {
            padding: 40px 30px;
            min-height: 250px;
          }

          .branding-content h1 {
            font-size: 26px;
          }

          .branding-content p {
            font-size: 14px;
          }

          .shape-1, .shape-2, .shape-3 {
            width: 80px;
            height: 50px;
          }

          .login-form-panel {
            padding: 40px 30px;
          }

          .form-header h2 {
            font-size: 24px;
          }
        }

        @media (max-width: 480px) {
          .login-page-wrapper {
            padding: 15px;
          }

          .login-branding {
            padding: 30px 20px;
            min-height: 200px;
          }

          .branding-content h1 {
            font-size: 22px;
          }

          .login-form-panel {
            padding: 30px 20px;
          }

          .form-header h2 {
            font-size: 22px;
          }

          .login-form input {
            padding: 12px 14px 12px 44px;
            font-size: 14px;
          }

          .submit-button {
            padding: 12px 20px;
            font-size: 15px;
          }
        }
      `}</style>

      <div className="login-page-wrapper">
        <div className="login-card">
          {/* Left Panel - Branding */}
          <div className="login-branding">
            <div className="decorative-shape shape-1"></div>
            <div className="decorative-shape shape-2"></div>
            <div className="decorative-shape shape-3"></div>

            <div className="branding-content">
              <h1>Secure University Exam Portal</h1>
              <p>
                Advanced cloud-based examination platform designed to ensure integrity,
                security, and seamless evaluation for educational institutions.
              </p>
            </div>
          </div>

          {/* Right Panel - Login Form */}
          <div className="login-form-panel">
            <div className="form-header">
              <h2>Welcome Back</h2>
              <p>Please login to your account</p>
            </div>

            <form className="login-form" onSubmit={handleLogin}>
              <div className="input-group">
                <span className="input-icon">📧</span>
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="input-group">
                <span className="input-icon">🔒</span>
                <input
                  type="password"
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button type="submit" className="submit-button">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
