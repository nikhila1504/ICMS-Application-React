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
          localStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  // logout() {
  //   localStorage.removeItem("token");
  // }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  }
}

/* eslint import/no-anonymous-default-export: [2, {"allowNew": true}] */
export default new AuthService();
