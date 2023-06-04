import axios from "axios"
import { ElMessage } from "element-plus";
// 请求拦截
axios.interceptors.request.use(config => {
  const token = window.sessionStorage.getItem('token');
  config.headers.Authorization = `Bearer ${token}`

  return config;
}, error => {
  return Promise.reject(error);
})

// 响应拦截
axios.interceptors.response.use(response => {
  // 更新token
  const { authorization } = response.headers;
  authorization && window.sessionStorage.setItem("token", authorization)
  return response;
}, error => {
  // token过期 跳转login
  const { status } = error.response;
  if (status === 401) {
    ElMessage.error('请重新登录')
    setTimeout(function () {
      window.location.href = '/login';
    }, 1500)
  }
  return Promise.reject(error)
})

export default axios