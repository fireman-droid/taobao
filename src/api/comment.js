import request from '@/utils/request'

// 添加评价
export const addComment = (data) => {
  return request({
    url: '/comment/add',
    method: 'post',
    data
  })
}

// 获取商品评价列表
export const getProductComments = (productId) => {
  return request({
    url: `/comment/product/${productId}`,
    method: 'get'
  })
}

// 获取订单评价状态
export const getOrderCommentStatus = (orderId) => {
  return request({
    url: `/comment/order/${orderId}`,
    method: 'get'
  })
}
