import axios from 'axios'
import {getToken} from './auth'

// export default axios.create({
//   baseURL: 'http://localhost:8888/api/private/v1/'
// })

const http = axios.create({
  baseURL: 'http://localhost:8888/api/private/v1/'
})

// 添加请求拦截器
http.interceptors.request.use(function (config) {
  if (config.url !== '/login') {
    config.headers['Authorization'] = getToken()
  }
  // 下面的代码等同于next()，表示请求通过，才要真正的发请求
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

// 建议通过定义插件的配置来扩展Vue的本身
// 1.定义一个插件对象
const httpPlugin = {}

// 2.为插件对象添加一个成员：install
httpPlugin.install = function (Vue, options) {
  // 3.添加实例方法
  Vue.prototype.$http = http
}

// 导出插件对象
export default httpPlugin

// 加载使用插件-->写到入口
// Vue.use(httpPlugin)
