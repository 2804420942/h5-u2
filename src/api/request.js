import axios from 'axios'
import { ElMessage } from 'element-plus'
// 配置项
// http://192.168.1.135:3868 http://192.168.1.199:3868
const axiosOption = {
    baseURL: process.env.NODE_ENV === "production" ? location.origin : 'http://192.168.1.130:3868',
    // baseURL: 'localhost',
    timeout: 5000
}

// 创建一个单例
const instance = axios.create(axiosOption);

// 添加请求拦截器
instance.interceptors.request.use(function (config) {
  if(config.method === 'get' && config.url !== '/api/login') {
    if(localStorage.getItem('os-token')) {
      if(!config.params) config.params = {}
      Object.assign(config.params, { token: localStorage.getItem('os-token' )})
    } else {
      ElMessage({
        message: '请先登录',
        type: 'warning',
      })
      localStorage.clear()
    }
  }
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  if(response.data.ret === 1) {
    ElMessage({
      message: '请先登录',
      type: 'warning',
    })
    // localStorage.clear()
    // setTimeout(() => location.href = '/login', 1500)
  }
  // if(response.ret === 4) {
  //   message.warning(response.msg)
  // }
  return response.data;
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
});

export default instance;