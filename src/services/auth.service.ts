import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + '/.env' });

const API_URL = process.env.API_URL || 'http://50.17.29.48:7070';

class AuthService {
  login(username: string, password: string) {
    return axios
      .post(API_URL + "/users/login", {
        username,
        password
      })
      .then(response => {
        if (response.data.status === 200) {
          localStorage.setItem("user", JSON.stringify(response.data.data));
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user");
  }

  register(username: string, password: string) {
    return axios.post(API_URL + "/users/create", {
      username,
      password
    });
  }

  getCurrentUser() {
    const userStr = localStorage.getItem("user");
    if (userStr) return JSON.parse(userStr);

    return null;
  }
}

export default new AuthService();