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
      <br />
      <div className="container">
        <div className="row">
          <div className="card col-md-6 offset-md-3 offset-md-3">
            <h2 className="text-center">User Login</h2>
            <div className="card-body">
              {error && (
                <p className="error-message">
                  <i class="bi bi-exclamation-circle"></i> {error}
                </p>
              )}
              <form>
                <div className="form-group mb-2">
                  <label className="form-label"> User Name :</label>
                  <input
                    type="text"
                    placeholder="Enter username"
                    name="name"
                    className="form-control"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  ></input>
                </div>
                <div className="form-group mb-2">
                  <label className="form-label"> Password :</label>
                  <input
                    type="password"
                    placeholder="Enter password"
                    name="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  ></input>
                </div>
                <br></br>
                <div className="text-center mb-3"> 
                  <button
                    className="btn btn-outline-success w-20" 
                    onClick={handleSubmit} style={{fontSize:'15px' }}
                  >
                    Login
                  </button>
                </div>
                <br></br>
                &nbsp;
                <div style={{ marginLeft: "130px",fontSize:'20px' }}>
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
