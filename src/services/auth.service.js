import axios from "axios";

const BASE_URL = "http://localhost:9092/users";

class AuthService {
  login(username, password) {
    return axios
      .post(BASE_URL + "/authenticate", {
        username,
        password,
      })
      .then((response) => {
        if (response.data.accessToken) {
          localStorage.setItem(JSON.stringify(response.data));
        }

        return response.data;
      });
  }
  registerUser(user) {
    return axios.post(BASE_URL + "/register", user);
  }
  getCurrentUser() {
    return JSON.parse(localStorage.getItem("token"));
  }
}

/* eslint import/no-anonymous-default-export: [2, {"allowNew": true}] */
export default new AuthService();
