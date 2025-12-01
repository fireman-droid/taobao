// src/stores/mainStore.js
import { defineStore } from "pinia";
import { ref } from "vue";

export const useMainStore = defineStore("main", () => {
  const currentUser = ref(null);

  // 模拟用户 (后续对接后端 API 登录接口)
  const users = ref([
    {
      id: 1,
      username: "admin",
      password: "123",
      role: "admin",
      name: "系统管理员",
    },
    {
      id: 2,
      username: "shop1",
      password: "123",
      role: "shop",
      name: "耐克官方旗舰店",
    },
    {
      id: 3,
      username: "user1",
      password: "123",
      role: "user",
      name: "淘气值1000",
    },
  ]);

  // 模拟商品 (图片使用占位图，更好看)
  const products = ref([
    {
      id: 1,
      name: "2024新款透气跑步鞋男网面",
      price: 299.0,
      sales: 500,
      shopId: 2,
      image: "https://picsum.photos/200/200?random=1",
    },
    {
      id: 2,
      name: "纯棉圆领短袖T恤夏季宽松",
      price: 59.9,
      sales: 2000,
      shopId: 2,
      image: "https://picsum.photos/200/200?random=2",
    },
    {
      id: 3,
      name: "复古高腰阔ZV腿牛仔裤女",
      price: 128.5,
      sales: 300,
      shopId: 2,
      image: "https://picsum.photos/200/200?random=3",
    },
    {
      id: 4,
      name: "无线蓝牙耳机降噪运动",
      price: 199.0,
      sales: 1000,
      shopId: 2,
      image: "https://picsum.photos/200/200?random=4",
    },
    {
      id: 5,
      name: "大容量双肩包大学生书包",
      price: 89.0,
      sales: 150,
      shopId: 2,
      image: "https://picsum.photos/200/200?random=5",
    },
  ]);

  // 模拟订单 (后续对接后端订单接口)
  const cart = ref([]);
  const orders = ref([]);

  // 登录 (静态模拟)
  function login(username, password) {
    const user = users.value.find(
      (u) => u.username === username && u.password === password
    );
    if (user) {
      currentUser.value = user;
      return true;
    }
    return false;
  }

  // --- 新增：加入购物车 ---
  function addToCart(product) {
    // 检查购物车里是否已经有这个商品
    const existingItem = cart.value.find(
      (item) =>
        item.productId === product.id &&
        item.customerId === currentUser.value.id
    );
    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.value.push({
        id: Date.now(), // 购物车条目ID
        customerId: currentUser.value.id,
        productId: product.id,
        productName: product.name,
        price: product.price,
        image: product.image,
        shopId: product.shopId,
        quantity: 1,
        selected: true, // 默认勾选
      });
    }
  }

  // --- 修改：生成订单 (支持批量结算) ---
  function createOrder(items) {
    // items 是从购物车传来的商品列表
    const newOrder = {
      id: Date.now(),
      customerId: currentUser.value.id,
      shopId: items[0].shopId, // 简化处理：假设同店铺结算，或者只取第一个店铺ID
      status: 1, // 待支付
      createTime: new Date().toLocaleString(),
      total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      items: items.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
    };
    orders.value.push(newOrder);

    // 结算后，从购物车移除这些商品
    items.forEach((item) => {
      const index = cart.value.findIndex((c) => c.id === item.id);
      if (index !== -1) cart.value.splice(index, 1);
    });
  }

  return {
    currentUser,
    users,
    products,
    cart,
    orders,
    login,
    addToCart,
    createOrder,
  };
});
