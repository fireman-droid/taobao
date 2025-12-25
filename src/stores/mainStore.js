import { defineStore } from "pinia";
import { ref } from "vue";
import * as api from "@/api";

export const useMainStore = defineStore("main", () => {
  // 从 localStorage 恢复用户信息
  const savedUser = localStorage.getItem('currentUser');
  const currentUser = ref(savedUser ? JSON.parse(savedUser) : null);
  
  const users = ref([]);
  const products = ref([]);
  const cart = ref([]);
  const orders = ref([]);

  // ==================== 用户相关 ====================
  
  // 登录
  async function login(username, password) {
    try {
      const res = await api.login({ username, password });
      console.log('登录响应:', res);
      
      if (res.code === 200) {
        currentUser.value = res.data;
        console.log('登录成功，用户信息:', res.data);
        
        // 保存用户信息到 localStorage
        localStorage.setItem('currentUser', JSON.stringify(res.data));
        // 保存 token 到 localStorage
        if (res.data.token) {
          localStorage.setItem('token', res.data.token);
        }
        return true;
      }
      
      console.warn('登录失败，返回码:', res.code);
      return false;
    } catch (error) {
      console.error('登录失败:', error);
      console.error('错误详情:', error.response?.data);
      return false;
    }
  }

  // 退出登录
  function logout() {
    currentUser.value = null;
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
  }

  // 注册
  async function register(userData) {
    try {
      const res = await api.register(userData);
      return res.code === 200;
    } catch (error) {
      console.error('注册失败:', error);
      return false;
    }
  }

  // 获取用户列表（管理员）
  async function fetchUserList(keyword = '') {
    try {
      const res = await api.getUserList({ keyword });
      if (res.code === 200) {
        users.value = res.data;
      }
    } catch (error) {
      console.error('获取用户列表失败:', error);
    }
  }

  // 删除用户（管理员）
  async function deleteUser(id) {
    try {
      const res = await api.deleteUser(id);
      return res.code === 200;
    } catch (error) {
      console.error('删除用户失败:', error);
      return false;
    }
  }

  // 编辑用户（管理员）
  async function updateUser(userData) {
    try {
      const res = await api.updateUser(userData);
      if (res.code === 200) {
        await fetchUserList();
        return true;
      }
      return false;
    } catch (error) {
      console.error('编辑用户失败:', error);
      return false;
    }
  }

  // 重置密码（管理员）
  async function resetUserPassword(id, newPassword) {
    try {
      const data = newPassword ? { newPassword } : {};
      const res = await api.resetPassword(id, data);
      if (res.code === 200) {
        return true;
      }
      return false;
    } catch (error) {
      console.error('重置密码失败:', error);
      return false;
    }
  }

  // 新增管理员
  async function addAdmin(adminData) {
    try {
      const res = await api.addAdmin(adminData);
      if (res.code === 200) {
        await fetchUserList();
        return true;
      }
      return false;
    } catch (error) {
      console.error('新增管理员失败:', error);
      return false;
    }
  }

  // ==================== 店铺审核相关 ====================
  
  // 获取待审核店铺列表
  async function fetchShopAuditList() {
    try {
      const res = await api.getShopAuditList();
      if (res.code === 200) {
        return res.data;
      }
      return [];
    } catch (error) {
      console.error('获取待审核店铺列表失败:', error);
      return [];
    }
  }

  // 审核店铺申请
  async function auditShop(id, status, reason = '') {
    try {
      const res = await api.auditShop(id, { status, reason });
      return res.code === 200;
    } catch (error) {
      console.error('审核店铺失败:', error);
      return false;
    }
  }

  // ==================== 商品相关 ====================
  
  // 获取商品列表
  async function fetchProductList(params = {}) {
    try {
      const res = await api.getProductList(params);
      if (res.code === 200) {
        products.value = res.data;
      }
    } catch (error) {
      console.error('获取商品列表失败:', error);
    }
  }

  // 添加商品（商家）
  async function addProduct(productData) {
    try {
      const res = await api.addProduct(productData);
      if (res.code === 200) {
        await fetchProductList({ shopId: currentUser.value.id });
        return true;
      }
      return false;
    } catch (error) {
      console.error('添加商品失败:', error);
      return false;
    }
  }

  // 删除商品（商家）
  async function deleteProduct(id) {
    try {
      const res = await api.deleteProduct(id);
      if (res.code === 200) {
        await fetchProductList({ shopId: currentUser.value.id });
        return true;
      }
      return false;
    } catch (error) {
      console.error('删除商品失败:', error);
      return false;
    }
  }

  // 编辑商品（商家）
  async function updateProduct(productData) {
    try {
      const res = await api.updateProduct(productData);
      if (res.code === 200) {
        await fetchProductList({ shopId: currentUser.value.id });
        return true;
      }
      return false;
    } catch (error) {
      console.error('编辑商品失败:', error);
      return false;
    }
  }

  // ==================== 购物车相关 ====================
  
  // 获取购物车列表
  async function fetchCartList() {
    if (!currentUser.value) return;
    try {
      const res = await api.getCartList({ customerId: currentUser.value.id });
      if (res.code === 200) {
        cart.value = res.data;
      }
    } catch (error) {
      console.error('获取购物车失败:', error);
    }
  }

  // 加入购物车
  async function addToCart(product) {
    if (!currentUser.value) return false;
    try {
      // 打印请求数据，方便调试
      const requestData = {
        customerId: currentUser.value.id,
        productId: product.id,
        quantity: 1
      };
      console.log('加入购物车请求数据:', requestData);
      
      const res = await api.addToCart(requestData);
      if (res.code === 200) {
        await fetchCartList();
        return true;
      }
      return false;
    } catch (error) {
      console.error('加入购物车失败:', error);
      console.error('错误详情:', error.response?.data);
      return false;
    }
  }

  // 更新购物车数量
  async function updateCartQuantity(cartId, quantity) {
    try {
      const res = await api.updateCart({ id: cartId, quantity });
      if (res.code === 200) {
        await fetchCartList();
        return true;
      }
      return false;
    } catch (error) {
      console.error('更新购物车失败:', error);
      return false;
    }
  }

  // 删除购物车商品
  async function removeFromCart(cartId) {
    try {
      const res = await api.deleteCart(cartId);
      if (res.code === 200) {
        await fetchCartList();
        return true;
      }
      return false;
    } catch (error) {
      console.error('删除购物车商品失败:', error);
      return false;
    }
  }

  // ==================== 订单相关 ====================
  
  // 获取订单列表
  async function fetchOrderList(params = {}) {
    if (!currentUser.value) return;
    try {
      const queryParams = currentUser.value.role === 'shop' 
        ? { shopId: currentUser.value.id, ...params }
        : { customerId: currentUser.value.id, ...params };
      
      const res = await api.getOrderList(queryParams);
      if (res.code === 200) {
        orders.value = res.data;
      }
    } catch (error) {
      console.error('获取订单列表失败:', error);
    }
  }

  // 创建订单
  async function createOrder(items) {
    if (!currentUser.value) return false;
    try {
      const res = await api.createOrder({
        customerId: currentUser.value.id,
        items
      });
      if (res.code === 200) {
        await fetchOrderList();
        await fetchCartList(); // 刷新购物车
        return true;
      }
      return false;
    } catch (error) {
      console.error('创建订单失败:', error);
      return false;
    }
  }

  // 支付订单
  async function payOrder(orderId) {
    try {
      const res = await api.payOrder(orderId);
      if (res.code === 200) {
        await fetchOrderList();
        return true;
      }
      return false;
    } catch (error) {
      console.error('支付订单失败:', error);
      return false;
    }
  }

  // 发货（商家）
  async function shipOrder(orderId) {
    try {
      const res = await api.shipOrder(orderId);
      if (res.code === 200) {
        await fetchOrderList();
        return true;
      }
      return false;
    } catch (error) {
      console.error('发货失败:', error);
      return false;
    }
  }

  // 确认收货
  async function confirmReceipt(orderId) {
    try {
      const res = await api.confirmReceipt(orderId);
      if (res.code === 200) {
        await fetchOrderList();
        return true;
      }
      return false;
    } catch (error) {
      console.error('确认收货失败:', error);
      return false;
    }
  }

  // ==================== 评价相关 ====================
  
  // 添加评价
  async function addComment(commentData) {
    try {
      const res = await api.addComment(commentData);
      return res.code === 200;
    } catch (error) {
      console.error('添加评价失败:', error);
      return false;
    }
  }

  // 获取商品评价列表
  async function fetchProductComments(productId) {
    try {
      const res = await api.getProductComments(productId);
      if (res.code === 200) {
        return res.data;
      }
      return [];
    } catch (error) {
      console.error('获取商品评价失败:', error);
      return [];
    }
  }

  // 获取订单评价状态
  async function fetchOrderCommentStatus(orderId) {
    try {
      const res = await api.getOrderCommentStatus(orderId);
      if (res.code === 200) {
        return res.data;
      }
      return [];
    } catch (error) {
      console.error('获取订单评价状态失败:', error);
      return [];
    }
  }

  return {
    currentUser,
    users,
    products,
    cart,
    orders,
    login,
    logout,
    register,
    fetchUserList,
    deleteUser,
    updateUser,
    resetUserPassword,
    addAdmin,
    fetchShopAuditList,
    auditShop,
    fetchProductList,
    addProduct,
    updateProduct,
    deleteProduct,
    fetchCartList,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    fetchOrderList,
    createOrder,
    payOrder,
    shipOrder,
    confirmReceipt,
    addComment,
    fetchProductComments,
    fetchOrderCommentStatus
  };
});
