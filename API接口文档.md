# 淘宝商城 API 接口文档

## 一、用户模块

### 1.1 用户登录
- **POST** `/api/user/login`
- **请求参数：**
```json
{
  "username": "string",  // 用户名
  "password": "string"   // 密码
}
```
- **返回字段：**
```json
{
  "code": 200,
  "data": {
    "id": "number",        // 用户ID
    "username": "string",  // 用户名
    "name": "string",      // 昵称/店铺名
    "role": "string"       // 角色: admin | shop | user
  }
}
```

### 1.2 获取用户列表（管理员）
- **GET** `/api/user/list`
- **请求参数：**
```json
{
  "keyword": "string"  // 可选，搜索关键词
}
```
- **返回字段：**
```json
{
  "code": 200,
  "data": [
    {
      "id": "number",
      "username": "string",
      "name": "string",
      "role": "string"   // admin | shop | user
    }
  ]
}
```

### 1.3 删除/注销用户（管理员）
- **DELETE** `/api/user/{id}`

### 1.4 编辑用户信息（管理员）
- **PUT** `/api/user/update`
- **请求参数：**
```json
{
  "id": "number",
  "username": "string",
  "name": "string",
  "role": "string"
}
```

### 1.5 重置用户密码（管理员）
- **PUT** `/api/user/resetPassword/{id}`
- **请求参数：**
```json
{
  "newPassword": "string"  // 可选，不传则重置为默认密码
}
```

### 1.6 新增管理员（管理员）
- **POST** `/api/user/addAdmin`
- **请求参数：**
```json
{
  "username": "string",
  "password": "string",
  "name": "string"
}
```

### 1.7 获取统计数据（管理员）
- **GET** `/api/stats/overview`
- **返回字段：**
```json
{
  "code": 200,
  "data": {
    "totalUsers": "number",   // 总用户数
    "shopCount": "number"     // 入驻店铺数
  }
}
```

---

## 二、商品模块

### 2.1 获取商品列表
- **GET** `/api/product/list`
- **请求参数：**
```json
{
  "keyword": "string",  // 可选，搜索关键词
  "shopId": "number"    // 可选，店铺ID（商家查自己的商品）
}
```
- **返回字段：**
```json
{
  "code": 200,
  "data": [
    {
      "id": "number",       // 商品ID
      "name": "string",     // 商品名称
      "price": "number",    // 价格
      "sales": "number",    // 销量
      "shopId": "number",   // 所属店铺ID
      "image": "string"     // 商品图片URL
    }
  ]
}
```

### 2.2 发布商品（商家）
- **POST** `/api/product/add`
- **请求参数：**
```json
{
  "name": "string",     // 商品名称
  "price": "number",    // 价格
  "shopId": "number",   // 店铺ID
  "image": "string"     // 商品图片URL（可选）
}
```

### 2.3 下架/删除商品（商家）
- **DELETE** `/api/product/{id}`

### 2.4 编辑商品（商家）
- **PUT** `/api/product/update`
- **请求参数：**
```json
{
  "id": "number",
  "name": "string",
  "price": "number",
  "image": "string"
}
```

---

## 三、购物车模块

### 3.1 获取购物车列表
- **GET** `/api/cart/list`
- **请求参数：**
```json
{
  "customerId": "number"  // 用户ID
}
```
- **返回字段：**
```json
{
  "code": 200,
  "data": [
    {
      "id": "number",           // 购物车条目ID
      "customerId": "number",   // 用户ID
      "productId": "number",    // 商品ID
      "productName": "string",  // 商品名称
      "price": "number",        // 单价
      "image": "string",        // 商品图片
      "shopId": "number",       // 店铺ID
      "quantity": "number",     // 数量
      "selected": "boolean"     // 是否选中
    }
  ]
}
```

### 3.2 加入购物车
- **POST** `/api/cart/add`
- **请求参数：**
```json
{
  "customerId": "number",  // 用户ID
  "productId": "number",   // 商品ID
  "quantity": "number"     // 数量，默认1
}
```

### 3.3 更新购物车数量
- **PUT** `/api/cart/update`
- **请求参数：**
```json
{
  "id": "number",        // 购物车条目ID
  "quantity": "number"   // 新数量
}
```

### 3.4 删除购物车商品
- **DELETE** `/api/cart/{id}`

---

## 四、订单模块

### 4.1 获取订单列表
- **GET** `/api/order/list`
- **请求参数：**
```json
{
  "customerId": "number",  // 可选，顾客查自己的订单
  "shopId": "number"       // 可选，商家查自己店铺的订单
}
```
- **返回字段：**
```json
{
  "code": 200,
  "data": [
    {
      "id": "number",           // 订单ID
      "customerId": "number",   // 顾客ID
      "shopId": "number",       // 店铺ID
      "status": "number",       // 状态: 1待支付 2待发货 3已发货
      "createTime": "string",   // 下单时间
      "total": "number",        // 订单总金额
      "items": [                // 订单商品列表
        {
          "productId": "number",
          "productName": "string",
          "price": "number",
          "quantity": "number",
          "image": "string"
        }
      ]
    }
  ]
}
```

### 4.2 创建订单（结算）
- **POST** `/api/order/create`
- **请求参数：**
```json
{
  "customerId": "number",
  "items": [
    {
      "cartId": "number",       // 购物车条目ID
      "productId": "number",
      "productName": "string",
      "price": "number",
      "quantity": "number",
      "image": "string",
      "shopId": "number"
    }
  ]
}
```

### 4.3 支付订单
- **PUT** `/api/order/pay/{id}`
- **说明：** 将订单状态从 1(待支付) 改为 2(待发货)

### 4.4 发货（商家）
- **PUT** `/api/order/ship/{id}`
- **说明：** 将订单状态从 2(待发货) 改为 3(已发货)

---

## 五、系统设置模块（管理员）

### 5.1 获取系统配置
- **GET** `/api/system/config`
- **返回字段：**
```json
{
  "code": 200,
  "data": {
    "platformName": "string",     // 平台名称
    "commissionRate": "string"    // 默认佣金比例
  }
}
```

### 5.2 更新系统配置
- **PUT** `/api/system/config`
- **请求参数：**
```json
{
  "platformName": "string",
  "commissionRate": "string"
}
```

---

## 六、店铺入驻审核模块（管理员）

### 6.1 获取待审核店铺列表
- **GET** `/api/shop/audit/list`
- **返回字段：**
```json
{
  "code": 200,
  "data": [
    {
      "id": "number",
      "shopName": "string",      // 店铺名称
      "ownerName": "string",     // 申请人
      "applyTime": "string",     // 申请时间
      "status": "number"         // 0待审核 1通过 2拒绝
    }
  ]
}
```

### 6.2 审核店铺申请
- **PUT** `/api/shop/audit/{id}`
- **请求参数：**
```json
{
  "status": "number",    // 1通过 2拒绝
  "reason": "string"     // 拒绝原因（可选）
}
```

---

## 七、数据字典

### 用户角色 (role)
| 值 | 说明 |
|---|---|
| admin | 超级管理员 |
| shop | 入驻商家 |
| user | 普通顾客 |

### 订单状态 (status)
| 值 | 说明 |
|---|---|
| 1 | 待支付 |
| 2 | 待发货（已支付） |
| 3 | 已发货 |

---

## 八、接口汇总表

| 模块 | 接口 | 方法 | 说明 | 角色 |
|------|------|------|------|------|
| 用户 | /api/user/login | POST | 登录 | 全部 |
| 用户 | /api/user/list | GET | 用户列表 | 管理员 |
| 用户 | /api/user/{id} | DELETE | 注销用户 | 管理员 |
| 用户 | /api/user/update | PUT | 编辑用户 | 管理员 |
| 用户 | /api/user/resetPassword/{id} | PUT | 重置密码 | 管理员 |
| 用户 | /api/user/addAdmin | POST | 新增管理员 | 管理员 |
| 统计 | /api/stats/overview | GET | 统计概览 | 管理员 |
| 商品 | /api/product/list | GET | 商品列表 | 全部 |
| 商品 | /api/product/add | POST | 发布商品 | 商家 |
| 商品 | /api/product/update | PUT | 编辑商品 | 商家 |
| 商品 | /api/product/{id} | DELETE | 下架商品 | 商家 |
| 购物车 | /api/cart/list | GET | 购物车列表 | 顾客 |
| 购物车 | /api/cart/add | POST | 加入购物车 | 顾客 |
| 购物车 | /api/cart/update | PUT | 更新数量 | 顾客 |
| 购物车 | /api/cart/{id} | DELETE | 删除购物车商品 | 顾客 |
| 订单 | /api/order/list | GET | 订单列表 | 顾客/商家 |
| 订单 | /api/order/create | POST | 创建订单 | 顾客 |
| 订单 | /api/order/pay/{id} | PUT | 支付订单 | 顾客 |
| 订单 | /api/order/ship/{id} | PUT | 发货 | 商家 |
| 系统 | /api/system/config | GET | 获取系统配置 | 管理员 |
| 系统 | /api/system/config | PUT | 更新系统配置 | 管理员 |
| 审核 | /api/shop/audit/list | GET | 待审核店铺列表 | 管理员 |
| 审核 | /api/shop/audit/{id} | PUT | 审核店铺申请 | 管理员 |
