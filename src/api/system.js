import request from '@/utils/request'

// 获取系统配置
export const getSystemConfig = () => {
  return request({
    url: '/system/getconfig',
    method: 'get'
  })
}

// 更新系统配置
export const updateSystemConfig = (data) => {
  return request({
    url: '/system/updateconfig',
    method: 'put',
    data
  })
}
