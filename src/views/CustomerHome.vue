<template>
  <div class="mall-page">
    <!-- 顶部导航 -->
    <div class="site-nav">
      <div class="container nav-content">
        <div class="nav-left">
          <span v-if="store.currentUser" class="welcome">
            <el-icon><User /></el-icon>
            Hi，{{ store.currentUser.name }}
          </span>
          <span v-else class="welcome text-link" @click="$router.push('/login')">
            亲，请登录
          </span>
          <el-divider direction="vertical" v-if="store.currentUser" />
          <span v-if="store.currentUser" class="text-link" @click="logout">退出</span>
        </div>
        <div class="nav-right">
          <span class="nav-item" :class="{ active: activeTab === 'home' }" @click="activeTab = 'home'">
            <el-icon><HomeFilled /></el-icon> 首页
          </span>
          <span class="nav-item" :class="{ active: activeTab === 'cart' }" @click="activeTab = 'cart'">
            <el-icon><ShoppingCart /></el-icon> 购物车
            <el-badge :value="myCartCount" :hidden="myCartCount === 0" class="cart-badge" />
          </span>
          <span class="nav-item" :class="{ active: activeTab === 'orders' }" @click="activeTab = 'orders'">
            <el-icon><List /></el-icon> 我的订单
          </span>
        </div>
      </div>
    </div>

    <!-- 搜索头部 -->
    <div class="header-search">
      <div class="container header-inner">
        <div class="logo" @click="activeTab = 'home'">
          <span class="tb-icon">淘</span>
          <span class="tb-text">淘宝商城</span>
        </div>
        <div class="search-box">
          <el-input
            v-model="searchKey"
            placeholder="搜索你想要的宝贝..."
            size="large"
            clearable
            @keyup.enter="activeTab = 'home'"
          >
            <template #append>
              <el-button type="primary" @click="activeTab = 'home'">
                <el-icon><Search /></el-icon> 搜索
              </el-button>
            </template>
          </el-input>
        </div>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="main-content container">
      <!-- 首页商品 -->
      <div v-if="activeTab === 'home'" class="home-view">
        <div class="section-header">
          <h3 class="section-title">
            <el-icon><Star /></el-icon> 热卖推荐
          </h3>
          <span class="product-count">共 {{ filteredProducts.length }} 件商品</span>
        </div>
        
        <el-empty v-if="filteredProducts.length === 0" description="暂无相关商品" />
        
        <div class="product-grid" v-else>
          <div class="product-card" v-for="item in filteredProducts" :key="item.id">
            <div class="img-wrapper">
              <img :src="item.image" :alt="item.name" />
              <div class="sale-tag" v-if="item.sales > 500">热销</div>
            </div>
            <div class="p-info">
              <div class="p-name">{{ item.name }}</div>
              <div class="p-bottom">
                <div class="p-price">
                  <span class="symbol">¥</span>
                  <span class="num">{{ item.price }}</span>
                </div>
                <div class="p-sales">{{ item.sales }}人付款</div>
              </div>
            </div>
            <div class="hover-actions">
              <el-button type="warning" round @click="handleAddToCart(item)">
                <el-icon><ShoppingCart /></el-icon> 加入购物车
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 购物车 -->
      <div v-if="activeTab === 'cart'" class="cart-view">
        <div class="view-header">
          <h2 class="page-title">
            <el-icon><ShoppingCart /></el-icon> 我的购物车
          </h2>
          <span class="sub-info">共 {{ myCart.length }} 件商品</span>
        </div>

        <el-empty v-if="myCart.length === 0" description="购物车还是空的，快去选购吧">
          <el-button type="primary" @click="activeTab = 'home'">去逛逛</el-button>
        </el-empty>

        <div v-else class="cart-content">
          <div class="cart-header">
            <div class="col-check"><el-checkbox v-model="isAllSelected" @change="toggleSelectAll">全选</el-checkbox></div>
            <div class="col-item">商品信息</div>
            <div class="col-price">单价</div>
            <div class="col-num">数量</div>
            <div class="col-total">金额</div>
            <div class="col-action">操作</div>
          </div>

          <div class="cart-list">
            <div class="cart-item" v-for="item in myCart" :key="item.id">
              <div class="col-check"><el-checkbox v-model="item.selected" /></div>
              <div class="col-item info-flex">
                <img :src="item.image" class="thumb" />
                <span class="name">{{ item.productName }}</span>
              </div>
              <div class="col-price">¥ {{ item.price.toFixed(2) }}</div>
              <div class="col-num">
                <el-input-number v-model="item.quantity" :min="1" :max="99" size="small" />
              </div>
              <div class="col-total orange">¥ {{ (item.price * item.quantity).toFixed(2) }}</div>
              <div class="col-action">
                <el-button link type="danger" @click="removeFromCart(item.id)">删除</el-button>
              </div>
            </div>
          </div>

          <div class="cart-footer">
            <div class="footer-left">
              <el-checkbox v-model="isAllSelected" @change="toggleSelectAll">全选</el-checkbox>
              <el-button link type="danger" @click="removeSelected">删除选中</el-button>
            </div>
            <div class="footer-right">
              <span class="summary">已选 <strong class="orange">{{ selectedCount }}</strong> 件</span>
              <span class="total-price">合计：<strong class="orange price-num">¥{{ totalPrice.toFixed(2) }}</strong></span>
              <el-button type="danger" size="large" :disabled="selectedCount === 0" class="checkout-btn" @click="handleCheckout">
                结算
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 订单列表 -->
      <div v-if="activeTab === 'orders'" class="order-view">
        <div class="view-header">
          <h2 class="page-title"><el-icon><List /></el-icon> 我的订单</h2>
        </div>
        
        <el-empty v-if="myOrders.length === 0" description="暂无订单">
          <el-button type="primary" @click="activeTab = 'home'">去购物</el-button>
        </el-empty>

        <div class="order-list" v-else>
          <div class="order-item" v-for="order in myOrders" :key="order.id">
            <div class="order-header">
              <span class="time">{{ order.createTime }}</span>
              <span class="order-id">订单号：{{ order.id }}</span>
              <el-tag :type="order.status === 1 ? 'warning' : 'success'" size="small">
                {{ order.status === 1 ? '待支付' : '已支付' }}
              </el-tag>
            </div>
            <div class="order-body" v-for="p in order.items" :key="p.productId">
              <img :src="p.image" class="thumb" />
              <div class="info">{{ p.productName }}</div>
              <div class="price">¥{{ p.price }} × {{ p.quantity }}</div>
            </div>
            <div class="order-footer">
              <div class="total">实付款：<strong class="orange">¥{{ order.total.toFixed(2) }}</strong></div>
              <el-button v-if="order.status === 1" type="danger" size="small" @click="pay(order)">立即支付</el-button>
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
import { User, HomeFilled, ShoppingCart, List, Search, Star } from "@element-plus/icons-vue";

const store = useMainStore();
const router = useRouter();
const activeTab = ref("home");
const searchKey = ref("");

const filteredProducts = computed(() => {
  if (!searchKey.value) return store.products;
  return store.products.filter((p) => p.name.includes(searchKey.value));
});

const myOrders = computed(() => {
  if (!store.currentUser) return [];
  return store.orders.filter((o) => o.customerId === store.currentUser.id).reverse();
});

const logout = () => {
  store.currentUser = null;
  router.push("/login");
};

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
  return myCart.value.filter((item) => item.selected).reduce((sum, item) => sum + item.price * item.quantity, 0);
});

const selectedCount = computed(() => myCart.value.filter((item) => item.selected).length);

const isAllSelected = computed({
  get: () => myCart.value.length > 0 && myCart.value.every((item) => item.selected),
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
  const selectedIds = myCart.value.filter((item) => item.selected).map((i) => i.id);
  selectedIds.forEach((id) => removeFromCart(id));
};

const handleCheckout = () => {
  const selectedItems = myCart.value.filter((item) => item.selected);
  if (selectedItems.length === 0) return;
  ElMessageBox.confirm(`共 ${selectedCount.value} 件商品，合计 ¥${totalPrice.value.toFixed(2)}，确认下单吗？`, "结算确认", {
    confirmButtonText: "提交订单",
    type: "success",
  }).then(() => {
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
.mall-page {
  background: #f5f5f5;
  min-height: 100vh;
}

.container {
  width: 1200px;
  margin: 0 auto;
}

.orange { color: #ff5000; }

/* 顶部导航 */
.site-nav {
  background: #fff;
  border-bottom: 1px solid #eee;
  height: 40px;
  line-height: 40px;
  font-size: 13px;
  color: #666;
}
.nav-content {
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
}
.nav-left {
  display: flex;
  align-items: center;
  gap: 5px;
}
.welcome {
  display: flex;
  align-items: center;
  gap: 4px;
}
.text-link {
  cursor: pointer;
  color: #ff5000;
}
.text-link:hover { text-decoration: underline; }
.nav-right {
  display: flex;
  gap: 25px;
}
.nav-item {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  position: relative;
  transition: color 0.2s;
}
.nav-item:hover { color: #ff5000; }
.nav-item.active {
  color: #ff5000;
  font-weight: 500;
}
.cart-badge {
  position: absolute;
  top: -8px;
  right: -15px;
}

/* 搜索头部 */
.header-search {
  background: #fff;
  padding: 20px 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.header-inner {
  display: flex;
  align-items: center;
  padding: 0 20px;
}
.logo {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-right: 60px;
}
.tb-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #ff5000, #ff7800);
  color: #fff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: bold;
  margin-right: 10px;
}
.tb-text {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}
.search-box {
  flex: 1;
  max-width: 550px;
}
.search-box :deep(.el-input-group__append) {
  background: #ff5000;
  border-color: #ff5000;
  color: #fff;
  padding: 0 20px;
}
.search-box :deep(.el-input__wrapper) {
  border-color: #ff5000;
}

/* 主内容 */
.main-content {
  padding: 20px;
}

/* 首页 */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.section-title {
  font-size: 18px;
  color: #333;
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0;
}
.section-title .el-icon { color: #ff5000; }
.product-count {
  font-size: 13px;
  color: #999;
}

/* 商品卡片 */
.product-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 15px;
}
.product-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s;
  cursor: pointer;
  position: relative;
}
.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
}
.img-wrapper {
  height: 200px;
  overflow: hidden;
  background: #fafafa;
  position: relative;
}
.img-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}
.product-card:hover .img-wrapper img {
  transform: scale(1.05);
}
.sale-tag {
  position: absolute;
  top: 10px;
  left: 0;
  background: linear-gradient(90deg, #ff5000, #ff7800);
  color: #fff;
  font-size: 11px;
  padding: 2px 10px 2px 6px;
  border-radius: 0 10px 10px 0;
}
.p-info {
  padding: 12px;
}
.p-name {
  font-size: 13px;
  color: #333;
  height: 36px;
  line-height: 18px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-bottom: 10px;
}
.p-bottom {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}
.p-price {
  color: #ff5000;
  font-weight: bold;
}
.p-price .symbol { font-size: 12px; }
.p-price .num { font-size: 18px; }
.p-sales {
  font-size: 12px;
  color: #999;
}
.hover-actions {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 0;
  background: rgba(255,255,255,0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: height 0.3s;
}
.product-card:hover .hover-actions {
  height: 55px;
}

/* 购物车 & 订单通用 */
.view-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}
.page-title {
  font-size: 18px;
  font-weight: 500;
  color: #333;
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0;
}
.sub-info {
  font-size: 13px;
  color: #999;
}

/* 购物车 */
.cart-view, .order-view {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
}
.cart-header {
  display: flex;
  background: #fafafa;
  padding: 12px 15px;
  font-size: 13px;
  color: #666;
  border-radius: 4px;
  margin-bottom: 10px;
}
.col-check { width: 80px; display: flex; align-items: center; }
.col-item { flex: 1; }
.col-price, .col-total { width: 120px; text-align: center; }
.col-num { width: 140px; text-align: center; }
.col-action { width: 80px; text-align: center; }

.cart-item {
  display: flex;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #f5f5f5;
  transition: background 0.2s;
}
.cart-item:hover { background: #fafafa; }
.info-flex {
  display: flex;
  align-items: center;
  flex: 1;
}
.info-flex .thumb {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  margin-right: 15px;
  object-fit: cover;
}
.info-flex .name {
  font-size: 14px;
  color: #333;
}
.col-total { font-weight: bold; }

.cart-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fafafa;
  margin-top: 15px;
  padding: 15px;
  border-radius: 4px;
}
.footer-left {
  display: flex;
  align-items: center;
  gap: 15px;
}
.footer-right {
  display: flex;
  align-items: center;
  gap: 20px;
}
.price-num {
  font-size: 22px;
}
.checkout-btn {
  width: 120px;
  height: 45px;
  font-size: 16px;
}

/* 订单 */
.order-item {
  border: 1px solid #eee;
  border-radius: 8px;
  margin-bottom: 15px;
  overflow: hidden;
}
.order-header {
  background: #fafafa;
  padding: 12px 15px;
  font-size: 13px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 20px;
}
.order-id { color: #999; }
.order-body {
  display: flex;
  padding: 15px;
  align-items: center;
  border-bottom: 1px solid #f5f5f5;
}
.order-body .thumb {
  width: 60px;
  height: 60px;
  border-radius: 4px;
  margin-right: 15px;
  object-fit: cover;
}
.order-body .info {
  flex: 1;
  font-size: 14px;
  color: #333;
}
.order-body .price {
  font-size: 14px;
  color: #666;
}
.order-footer {
  padding: 12px 15px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 20px;
}
.order-footer .total {
  font-size: 14px;
}
</style>
