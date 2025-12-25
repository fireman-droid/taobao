import request from '@/utils/request'

// 获取待审核店铺列表
export const getShopAuditList = () => {
  return request({
    url: '/shop/audit/list',
    method: 'get'
  })
}

// 审核店铺申请
export const auditShop = (id, data) => {
  return request({
    url: `/shop/audit/${id}`,
    method: 'put',
    data
  })
}
