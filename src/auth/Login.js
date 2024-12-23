import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await AuthService.login(username, password);
      if (userData.token) {
        localStorage.setItem("token", userData.token);
        navigate("/wc1");
      } else {
        setError(userData.message);
      }
    } catch (error) {
      console.log(error);
      setError("Incorrect username and password .Please Try again.");
      setTimeout(() => {
        setError("");
      }, 1000);
    }
  };

  return (
    <div>
      <br />
      <h4>Welcome to the State Board of Workers' Compensation Online Integrated Claims Management System (ICMS).</h4>

      <br />
      <div className="container justify-content-right">
        <div className="row">

          <div className="card col-md-4 offset-md-3">
            <h2 className="text-center">User Login</h2>
            <div className="card-body">
              {error && (
                <p className="error-message">
                  <i className="bi bi-exclamation-circle"></i> {error}
                </p>
              )}
              <form>
                {/* User Name Field */}
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">User Name:</label>
                  <input
                    type="text"
                    id="username"
                    placeholder="Enter username"
                    name="name"
                    className="form-control"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

                {/* Password Field */}
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password:</label>
                  <input
                    type="password"
                    id="password"
                    placeholder="Enter password"
                    name="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="text-center mb-3">
                  <button
                    className="btn custom-btn w-100"
                    onClick={handleSubmit}
                    style={{ fontSize: '15px' }}
                  >
                    Login
                  </button>
                </div>

                {/* Register Link */}
                <div className="text-center mt-3" style={{ fontSize: '16px' }}>
                  Don't have an account? <Link to="/register">Register</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
