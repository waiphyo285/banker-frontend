import axios from 'axios';
import authHeader from './auth-header';
// import socketIOClient from "socket.io-client";
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + '/.env' });

const API_URL = process.env.API_URL || 'http://50.17.29.48:7070'

class UserService {
  getPublicContent() {
    return axios.get(API_URL + '/roles/all', { headers: authHeader() });
  }

  getUserBoard() {
    return axios.get(API_URL + '/roles/user', { headers: authHeader() });
  }

  getCustomerBoard() {
    return axios.get(API_URL + '/roles/customer', { headers: authHeader() });
  }

  getHistoryBoard() {
    return axios.get(API_URL + '/roles/history', { headers: authHeader() });
  }

  postNewCustomer(username: string, password: string, account_type: string) {
    return axios.post(API_URL + "/customers/create", { username, password, account_type }, { headers: authHeader() });
  }

  postTransferMoney(transferObj: object) {
    console.log("HI", transferObj);
    return axios.post(API_URL + "/transfers/create", transferObj, { headers: authHeader() });
  }

  // testSocket() {
  //   const socket = socketIOClient(API_URL);
  //   return socket.on("FromAPI", data => data)
  // }
}

export default new UserService();
