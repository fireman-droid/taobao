# API 对接说明

## 目录结构

```
src/
├── api/                    # API 接口目录
│   ├── index.js           # 统一导出
│   ├── user.js            # 用户相关接口
│   ├── product.js         # 商品相关接口
│   ├── cart.js            # 购物车相关接口
│   ├── order.js           # 订单相关接口
│   ├── system.js          # 系统配置接口
│   └── shop.js            # 店铺审核接口
├── utils/
│   └── request.js         # axios 封装
└── stores/
    └── mainStore.js       # Pinia 状态管理（已对接 API）
```

## 配置说明

### 1. 环境变量配置

- `.env.development` - 开发环境（默认：http://localhost:8080/api）
- `.env.production` - 生产环境

修改后端地址：
```env
VITE_API_BASE_URL=http://your-backend-url/api
```

### 2. request.js 功能

- 自动添加 token 到请求头
- 统一错误处理
- 401 自动跳转登录
- 请求/响应拦截

## 使用方式

### 方式一：直接调用 API（推荐用于简单场景）

```javascript
import * as api from '@/api'

// 登录
const res = await api.login({ username: 'admin', password: '123' })
if (res.code === 200) {
  console.log('登录成功', res.data)
}

// 获取商品列表
const products = await api.getProductList({ keyword: '手机' })
```

### 方式二：使用 Pinia Store（推荐）

```javascript
import { useMainStore } from '@/stores/mainStore'

const store = useMainStore()

// 登录
await store.login('admin', '123')

// 获取商品列表
await store.fetchProductList()
console.log(store.products) // 商品数据

// 加入购物车
await store.addToCart(product)
```

## API 接口列表

### 用户模块 (user.js)
- `login(data)` - 登录
- `register(data)` - 注册
- `getUserList(params)` - 获取用户列表
- `deleteUser(id)` - 删除用户
- `updateUser(data)` - 更新用户
- `resetPassword(id, data)` - 重置密码
- `addAdmin(data)` - 新增管理员
- `getOverview()` - 获取统计数据

### 商品模块 (product.js)
- `getProductList(params)` - 获取商品列表
- `addProduct(data)` - 添加商品
- `updateProduct(data)` - 更新商品
- `deleteProduct(id)` - 删除商品

### 购物车模块 (cart.js)
- `getCartList(params)` - 获取购物车
- `addToCart(data)` - 加入购物车
- `updateCart(data)` - 更新数量
- `deleteCart(id)` - 删除购物车商品

### 订单模块 (order.js)
- `getOrderList(params)` - 获取订单列表
- `createOrder(data)` - 创建订单
- `payOrder(id)` - 支付订单
- `shipOrder(id)` - 发货

### 系统模块 (system.js)
- `getSystemConfig()` - 获取系统配置
- `updateSystemConfig(data)` - 更新系统配置

### 店铺审核模块 (shop.js)
- `getShopAuditList()` - 获取待审核列表
- `auditShop(id, data)` - 审核店铺

## 后端对接注意事项

### 1. 响应格式要求

后端必须返回统一格式：
```json
{
  "code": 200,
  "message": "success",
  "data": {}
}
```

### 2. Token 认证

- 登录成功后，后端返回 token
- 前端自动保存到 localStorage
- 后续请求自动携带 `Authorization: Bearer {token}`

### 3. 错误处理

后端错误码：
- 200: 成功
- 401: 未授权（自动跳转登录）
- 403: 无权限
- 404: 资源不存在
- 500: 服务器错误

## 示例：修改登录页面对接真实 API

```vue
<script setup>
import { useMainStore } from "@/stores/mainStore";
import { ElMessage } from "element-plus";

const store = useMainStore();

const handleLogin = async () => {
  const success = await store.login(form.username, form.password);
  if (success) {
    ElMessage.success(`欢迎回来，${store.currentUser.name}`);
    // 根据角色跳转
    if (store.currentUser.role === 'admin') router.push('/admin');
    else if (store.currentUser.role === 'shop') router.push('/shop');
    else router.push('/');
  } else {
    ElMessage.error('登录失败');
  }
};
</script>
```

## 开发建议

1. **开发阶段**：可以先用 mock 数据测试前端功能
2. **联调阶段**：修改 `.env.development` 指向后端地址
3. **生产部署**：修改 `.env.production` 为生产环境地址

## 常见问题

### Q: 跨域问题怎么解决？
A: 后端需要配置 CORS，或者在 `vite.config.js` 配置代理：
```javascript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
})
```

### Q: 如何调试接口？
A: 打开浏览器开发者工具 → Network 标签查看请求详情
