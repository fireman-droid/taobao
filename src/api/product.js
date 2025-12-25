import request from '@/utils/request'

// 获取商品列表
export const getProductList = (params) => {
  return request({
    url: '/products/list',
    method: 'get',
    params
  })
}

// 发布商品（商家）- 使用FormData上传文件
export const addProduct = (formData) => {
  return request({
    url: '/products/add',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 编辑商品（商家）- 使用FormData上传文件
export const updateProduct = (formData) => {
  return request({
    url: '/products/update',
    method: 'put',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 下架/删除商品（商家）
export const deleteProduct = (id) => {
  return request({
    url: `/products/${id}`,
    method: 'delete'
  })
}
