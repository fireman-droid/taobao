import request from '@/utils/request'

// 获取购物车列表
export const getCartList = (params) => {
  return request({
    url: '/cart/list',
    method: 'get',
    params
  })
}

// 加入购物车
export const addToCart = (data) => {
  return request({
    url: '/cart/add',
    method: 'post',
    data
  })
}

// 更新购物车数量
export const updateCart = (data) => {
  return request({
    url: '/cart/update',
    method: 'put',
    data
  })
}

// 删除购物车商品
export const deleteCart = (id) => {
  return request({
    url: `/cart/${id}`,
    method: 'delete'
  })
}
