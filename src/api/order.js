import request from '@/utils/request'

// 获取订单列表
export const getOrderList = (params) => {
  return request({
    url: '/orders/list',
    method: 'get',
    params
  })
}

// 创建订单（结算）
export const createOrder = (data) => {
  return request({
    url: '/orders/create',
    method: 'post',
    data
  })
}

// 支付订单
export const payOrder = (id) => {
  return request({
    url: `/orders/pay/${id}`,
    method: 'put'
  })
}

// 发货（商家）
export const shipOrder = (id) => {
  return request({
    url: `/orders/ship/${id}`,
    method: 'put'
  })
}

// 确认收货
export const confirmReceipt = (id) => {
  return request({
    url: `/orders/confirm/${id}`,
    method: 'put'
  })
}
