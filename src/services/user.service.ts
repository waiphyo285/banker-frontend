import axios from 'axios';
import authHeader from './auth-header';
require('dotenv').config();

const API_URL = process.env.API_URL || 'http://localhost:7070'

class UserService {
  getPublicContent() {
    return axios.get(API_URL + '/roles/all');
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
    return axios.post(API_URL + "/customers/create", { username, password, account_type });
  }

  postTransferMoney(transferObj: object) {
    return axios.post(API_URL + "/transfers/create", transferObj);
  }
}

export default new UserService();
