import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";
import AuthService from "../services/auth.service";

const RegistrationComponent = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [businessTitle, setBusinessTitle] = useState("");
  const inputRef = useRef();
  const options = [
    { value: "Admin", label: "Admin" },
    { value: "User", label: "User" },
  ];
  const navigate = useNavigate();
  const user = { username, password, email, phone, name, businessTitle };

  const saveUser = (event) => {
    event.preventDefault();
    console.log(event);
    AuthService.registerUser(user)
      .then((response) => {
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
        setError("User already exists,please add new username");
      });
  };

  return (
    <div>
      <br />
      <br />
      <div className="container">
        <div className="row">
          <div className="card col-md-6 offset-md-3 offset-md-3">
            <h2 className="text-center">Registration Form</h2>
            <div className="card-body">
              <form>
                <div className="form-group mb-2">
                  <label className="form-label">Enter User Name :</label>
                  <input
                    required
                    type="text"
                    ref={inputRef}
                    placeholder="Enter username"
                    name="username"
                    className="form-control"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  ></input>
                  <span className="Error">{error}</span>
                </div>
                <div className="form-group mb-2">
                  <label className="form-label"> Enter Password :</label>
                  <input
                    required
                    type="password"
                    placeholder="Enter password"
                    name="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  ></input>
                </div>
                <div className="form-group mb-2">
                  <label className="form-label">Enter First Name :</label>
                  <input
                    type="name"
                    placeholder="Enter First Name"
                    name="name"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  ></input>
                </div>
                <div className="form-group mb-2">
                  <label className="form-label">Enter Email Id :</label>
                  <input
                    required
                    type="email"
                    placeholder="Enter email Id"
                    name="emailId"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  ></input>
                </div>
                <div className="form-group mb-2">
                  <label className="form-label">Enter Contact Number :</label>
                  <input
                    type="phone"
                    placeholder="Enter Contact Number"
                    name="phone"
                    className="form-control"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  ></input>
                </div>
                <div className="pt form-group mb-2">
                  <label className="form-label">Enter Business Title :</label>
                  <Select
                    required
                    options={options}
                    placeholder="Enter Business Title"
                    value={options.filter((e) => {
                      return (
                        String(e.value) ===
                        String({ businessTitle }.businessTitle)
                      );
                    })}
                    onChange={(e) => setBusinessTitle(e.value)}
                  />
                </div>
                <button
                  className="btn btn-outline-success"
                  onClick={(e) => saveUser(e)}
                >
                  Submit
                </button>
                &nbsp;&nbsp;
                <Link to="/" className="btn btn-outline-danger">
                  Cancel
                </Link>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationComponent;
