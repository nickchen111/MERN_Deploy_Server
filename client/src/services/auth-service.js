// service 資料夾的東西就是創建一些能夠做服務的object 不論今天要登入 註冊啥的功能 都可以找這裡的東西完成
import axios from "axios";
const API_URL = "http://localhost:8080/api/user";

class AuthService {
  login(email, password) {
    return axios.post(API_URL + "/login", { email, password });
  }
  logout() {
    localStorage.removeItem("user");
  }
  register(username, email, password, role) {
    // 如果要post的話第二個參數要用大括號包起來裡面放想傳過去的值 axios.post 會return promise
    return axios.post(API_URL + "/register", {
      username,
      email,
      password,
      role,
    });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  }
}

export default new AuthService();
