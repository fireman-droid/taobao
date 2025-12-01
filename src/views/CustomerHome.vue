<template>
  <div class="mall-page">
    <div class="site-nav">
      <div class="container nav-content">
        <div class="nav-left">
          <span v-if="store.currentUser" class="welcome"
            >Hi，{{ store.currentUser.name }}</span
          >
          <span v-else class="welcome text-link" @click="$router.push('/login')"
            >亲，请登录</span
          >
          <span v-if="store.currentUser" class="text-link" @click="logout"
            >退出</span
          >
        </div>
        <div class="nav-right">
          <span
            class="nav-item"
            :class="{ active: activeTab === 'home' }"
            @click="activeTab = 'home'"
            >首页</span
          >
          <span
            class="nav-item"
            :class="{ active: activeTab === 'cart' }"
            @click="activeTab = 'cart'"
          >
            购物车
            <span style="color: #ff5000; font-weight: bold">{{
              myCartCount
            }}</span>
          </span>
          <span
            class="nav-item"
            :class="{ active: activeTab === 'orders' }"
            @click="activeTab = 'orders'"
            >我的订单</span
          >
        </div>
      </div>
    </div>

    <div class="header-search container">
      <div class="logo" @click="activeTab = 'home'">
        <span class="tb-icon">Tao</span>
        <span class="tb-text">淘宝商城</span>
      </div>
      <div class="search-box">
        <div class="search-input-group">
          <input v-model="searchKey" placeholder="搜索宝贝..." />
          <button @click="activeTab = 'home'">搜 索</button>
        </div>
      </div>
    </div>

    <div class="main-content container">
      <div v-if="activeTab === 'home'" class="home-view">
        <h3 class="section-title">热卖推荐</h3>
        <div class="product-grid">
          <div
            class="product-card"
            v-for="item in filteredProducts"
            :key="item.id"
          >
            <div class="img-wrapper">
              <img :src="item.image" />
            </div>
            <div class="p-info">
              <div class="p-price">¥ {{ item.price }}</div>
              <div class="p-name">{{ item.name }}</div>
              <div class="p-meta">
                <span>月销 {{ item.sales }}+</span>
              </div>
            </div>
            <div class="hover-mask">
              <el-button round type="warning" @click="handleAddToCart(item)"
                >加入购物车</el-button
              >
            </div>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'cart'" class="cart-view">
        <h2 class="page-title">
          购物车 <small>(全部 {{ myCart.length }})</small>
        </h2>

        <el-empty
          v-if="myCart.length === 0"
          description="购物车还是空的，快去选购吧"
        />

        <div v-else>
          <div class="cart-header">
            <div class="col-check">
              <el-checkbox v-model="isAllSelected" @change="toggleSelectAll"
                >全选</el-checkbox
              >
            </div>
            <div class="col-item">商品信息</div>
            <div class="col-price">单价</div>
            <div class="col-num">数量</div>
            <div class="col-total">金额</div>
            <div class="col-action">操作</div>
          </div>

          <div class="cart-list">
            <div class="cart-item" v-for="item in myCart" :key="item.id">
              <div class="col-check">
                <el-checkbox v-model="item.selected"></el-checkbox>
              </div>
              <div class="col-item info-flex">
                <img :src="item.image" class="thumb" />
                <span class="name">{{ item.productName }}</span>
              </div>
              <div class="col-price">¥ {{ item.price.toFixed(2) }}</div>
              <div class="col-num">
                <el-input-number
                  v-model="item.quantity"
                  :min="1"
                  :max="99"
                  size="small"
                />
              </div>
              <div class="col-total orange">
                ¥ {{ (item.price * item.quantity).toFixed(2) }}
              </div>
              <div class="col-action">
                <el-button link type="danger" @click="removeFromCart(item.id)"
                  >删除</el-button
                >
              </div>
            </div>
          </div>

          <div class="cart-footer">
            <div class="footer-left">
              <el-checkbox v-model="isAllSelected" @change="toggleSelectAll"
                >全选</el-checkbox
              >
              <el-button link @click="removeSelected">删除选中商品</el-button>
            </div>
            <div class="footer-right">
              <span class="summary"
                >已选商品
                <strong class="orange">{{ selectedCount }}</strong> 件</span
              >
              <span class="total-price"
                >合计：<strong class="orange price-text"
                  >¥ {{ totalPrice.toFixed(2) }}</strong
                ></span
              >
              <el-button
                type="primary"
                size="large"
                :disabled="selectedCount === 0"
                class="checkout-btn"
                @click="handleCheckout"
              >
                结 算
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'orders'" class="order-view">
        <h2 class="page-title">我的订单</h2>
        <div class="order-list">
          <div class="order-item" v-for="order in myOrders" :key="order.id">
            <div class="order-header">
              <span>{{ order.createTime }}</span>
              <span>订单号：{{ order.id }}</span>
            </div>
            <div class="order-body" v-for="p in order.items" :key="p.productId">
              <img :src="p.image" class="thumb" />
              <div class="info">{{ p.productName }}</div>
              <div class="price">¥ {{ p.price }} x {{ p.quantity }}</div>
            </div>
            <div class="order-footer">
              <div class="total">
                实付款：<strong>¥ {{ order.total.toFixed(2) }}</strong>
              </div>
              <div class="action">
                <el-button
                  v-if="order.status === 1"
                  type="primary"
                  size="small"
                  @click="pay(order)"
                  >立即支付</el-button
                >
                <el-tag v-else type="success">已支付</el-tag>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useMainStore } from "../stores/mainStore";
import { ElMessage, ElMessageBox } from "element-plus";

const store = useMainStore();
const router = useRouter();
const activeTab = ref("home");
const searchKey = ref("");

// --- 基础逻辑 ---
const filteredProducts = computed(() => {
  if (!searchKey.value) return store.products;
  return store.products.filter((p) => p.name.includes(searchKey.value));
});

const myOrders = computed(() => {
  if (!store.currentUser) return [];
  return store.orders
    .filter((o) => o.customerId === store.currentUser.id)
    .reverse();
});

const logout = () => {
  store.currentUser = null;
  router.push("/login");
};

// --- 购物车逻辑 ---
const myCart = computed(() => {
  if (!store.currentUser) return [];
  return store.cart.filter((item) => item.customerId === store.currentUser.id);
});
const myCartCount = computed(() => myCart.value.length || 0);

const handleAddToCart = (product) => {
  if (!store.currentUser) {
    ElMessage.warning("请先登录");
    router.push("/login");
    return;
  }
  store.addToCart(product);
  ElMessage.success("已加入购物车");
};

const totalPrice = computed(() => {
  return myCart.value
    .filter((item) => item.selected)
    .reduce((sum, item) => sum + item.price * item.quantity, 0);
});

const selectedCount = computed(
  () => myCart.value.filter((item) => item.selected).length
);

const isAllSelected = computed({
  get: () =>
    myCart.value.length > 0 && myCart.value.every((item) => item.selected),
  set: (val) => toggleSelectAll(val),
});
const toggleSelectAll = (val) => {
  const checked = typeof val === "boolean" ? val : !isAllSelected.value;
  myCart.value.forEach((item) => (item.selected = checked));
};

const removeFromCart = (id) => {
  const index = store.cart.findIndex((c) => c.id === id);
  if (index !== -1) store.cart.splice(index, 1);
};
const removeSelected = () => {
  const selectedIds = myCart.value
    .filter((item) => item.selected)
    .map((i) => i.id);
  selectedIds.forEach((id) => removeFromCart(id));
};

const handleCheckout = () => {
  const selectedItems = myCart.value.filter((item) => item.selected);
  if (selectedItems.length === 0) return;

  ElMessageBox.confirm(
    `共 ${selectedCount.value} 件商品，合计 ¥${totalPrice.value}，确认下单吗？`,
    "结算确认",
    {
      confirmButtonText: "提交订单",
      type: "success",
    }
  ).then(() => {
    store.createOrder(selectedItems);
    ElMessage.success("下单成功！");
    activeTab.value = "orders";
  });
};

const pay = (o) => {
  o.status = 2;
  ElMessage.success("支付成功");
};
</script>

<style scoped>
/* ================= 布局基础 ================= */
.mall-page {
  background-color: white;
  min-height: 100vh;
  padding-bottom: 50px;
}

/* 核心容器宽度，确保居中 */
.container {
  width: 1200px;
  margin: 0 auto;
}

/* 通用橙色文字 */
.orange {
  color: #ff5000;
}

/* ================= 顶部导航条 ================= */
.site-nav {
  background: #f5f5f5;
  border-bottom: 1px solid #eee;
  height: 35px;
  line-height: 35px;
  font-size: 12px;
  color: #666;
}
.nav-content {
  /* width:100%; */
  display: flex; /* 关键：横向布局 */
  padding: 0 25px;
  justify-content: space-between;
}
.nav-left .welcome {
  margin-right: 10px;
}
.text-link {
  cursor: pointer;
  color: #ff5000;
  margin-left: 5px;
}
.text-link:hover {
  text-decoration: underline;
}

.nav-right {
  display: flex;
  gap: 20px;
}
.nav-item {
  cursor: pointer;
}
.nav-item:hover {
  color: #ff5000;
}
.nav-item.active {
  color: #ff5000;
  font-weight: bold;
}

/* ================= 搜索区域 ================= */
.header-search {
  display: flex; /* 关键：横向布局 */
  align-items: center;
  padding: 25px 25px;
  background: #fff;
  margin-bottom: 20px;
}
.logo {
  font-size: 28px;
  font-weight: bold;
  color: #ff5000;
  margin-right: 80px;
  cursor: pointer;
  display: flex;
  align-items: center;
}
.tb-icon {
  background: #ff5000;
  color: white;
  padding: 0 5px;
  border-radius: 4px;
  margin-right: 5px;
  font-size: 20px;
}
.search-box {
  flex: 1;
  max-width: 600px;
}
.search-input-group {
  display: flex;
  border: 2px solid #ff5000;
  border-radius: 20px;
  overflow: hidden;
  height: 40px;
}
.search-input-group input {
  flex: 1;
  border: none;
  padding: 0 15px;
  outline: none;
  font-size: 14px;
}
.search-input-group button {
  background: #ff5000;
  color: white;
  border: none;
  width: 90px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
}

/* ================= 商品网格 (首页) ================= */
.section-title {
  margin: 20px 0;
  font-size: 20px;
  color: #333;
}
.product-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* 一行5个 */
  gap: 15px;
}
.product-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s;
  cursor: pointer;
  position: relative;
  border: 1px solid #eee; /* 增加默认边框 */
}
.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  border-color: #ff5000;
}
.img-wrapper {
  height: 200px; /* 固定图片容器高度 */
  overflow: hidden;
  background: #f9f9f9;
  display: flex;
  align-items: center;
  justify-content: center;
}
.img-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 关键：图片裁剪填充，防止变形过大 */
}
.p-info {
  padding: 10px;
}
.p-price {
  color: #ff5000;
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 5px;
}
.p-name {
  font-size: 13px;
  color: #333;
  height: 36px;
  line-height: 18px;
  overflow: hidden;
  margin-bottom: 5px;
}
.p-meta {
  font-size: 12px;
  color: #999;
}
.hover-mask {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 0;
  background: rgba(255, 255, 255, 0.9);
  transition: 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.product-card:hover .hover-mask {
  height: 60px;
}

/* ================= 购物车页面 ================= */
.cart-view {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
}
.page-title {
  margin-bottom: 20px;
  font-size: 22px;
  font-weight: normal;
}
.cart-header {
  display: flex;
  background: #f5f5f5;
  padding: 10px 15px;
  font-size: 12px;
  color: #666;
  margin-bottom: 10px;
}
.col-check {
  width: 60px;
  display: flex;
  align-items: center;
}
.col-item {
  flex: 1;
  display: flex;
  align-items: center;
}
.col-price {
  width: 120px;
  text-align: center;
}
.col-num {
  width: 150px;
  text-align: center;
}
.col-total {
  width: 120px;
  text-align: center;
  font-weight: bold;
}
.col-action {
  width: 80px;
  text-align: center;
}

.cart-item {
  display: flex;
  align-items: center;
  background: #fff;
  padding: 20px 15px;
  border: 1px solid #eee;
  margin-bottom: 15px;
}
.info-flex img {
  width: 80px;
  height: 80px;
  margin-right: 15px;
  border: 1px solid #eee;
  object-fit: cover;
}
.info-flex .name {
  font-size: 14px;
  max-width: 300px;
}

.cart-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f5f5f5;
  margin-top: 20px;
  padding-left: 15px;
}
.footer-right {
  display: flex;
  align-items: center;
  gap: 20px;
}
.price-text {
  font-size: 22px;
  margin-right: 10px;
}
.checkout-btn {
  width: 120px;
  height: 50px;
  font-size: 18px;
  border-radius: 0;
}

/* ================= 订单页面 ================= */
.order-view {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
}
.order-item {
  border: 1px solid #eee;
  margin-bottom: 20px;
}
.order-header {
  background: #f9f9f9;
  padding: 10px 15px;
  font-size: 12px;
  color: #666;
  display: flex;
  gap: 30px;
}
.order-body {
  display: flex;
  padding: 15px;
  border-bottom: 1px solid #f5f5f5;
  align-items: center;
}
.order-body .thumb {
  width: 60px;
  height: 60px;
  margin-right: 15px;
  border: 1px solid #eee;
}
.order-body .info {
  flex: 1;
  font-size: 13px;
}
.order-body .price {
  font-weight: bold;
}
.order-footer {
  padding: 10px 15px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 20px;
}
</style>
