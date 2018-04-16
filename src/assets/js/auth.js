// 自定义业务函数模块
// auth.js
// 封装和用户授权相关的函数

const userInfoKey = 'user-info'

// 在本地存储用户信息
export function saveUserInfo (userInfo = {}) {
  window.localStorage.setItem(userInfoKey, JSON.stringify(userInfo))
}

// 获取用户信息
export function getUserInfo () {
  return window.localStorage.getItem(userInfoKey)
}

// 获取token信息
export function getToken () {
  return JSON.parse(getUserInfo()).token
}

// 清除用户信息
export function removeUserInfo () {
  window.localStorage.removeItem(userInfoKey)
}
