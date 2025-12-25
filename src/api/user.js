import request from '@/utils/request'

// 用户登录
export const login = (data) => {
  return request({
    url: '/users/login',
    method: 'post',
    data
  })
}

// 用户注册
export const register = (data) => {
  return request({
    url: '/users/register',
    method: 'post',
    data
  })
}

// 获取用户列表（管理员）
export const getUserList = (params) => {
  return request({
    url: '/users/list',
    method: 'get',
    params
  })
}

// 删除/注销用户（管理员）
export const deleteUser = (id) => {
  return request({
    url: `/users/${id}`,
    method: 'delete'
  })
}

// 编辑用户信息（管理员）
export const updateUser = (data) => {
  return request({
    url: '/users/update',
    method: 'put',
    data
  })
}

// 重置用户密码（管理员）
export const resetPassword = (id, data) => {
  return request({
    url: `/users/resetPassword/${id}`,
    method: 'put',
    data
  })
}

// 新增管理员（管理员）
export const addAdmin = (data) => {
  return request({
    url: '/users/addAdmin',
    method: 'post',
    data
  })
}

// 获取统计数据（管理员）
export const getOverview = () => {
  return request({
    url: '/stats/overview',
    method: 'get'
  })
}
