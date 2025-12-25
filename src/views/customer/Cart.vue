<template>
  <div class="cart-page">
    <div class="view-header">
      <h2 class="page-title">
        <el-icon>
          <ShoppingCart />
        </el-icon> 我的购物车
      </h2>
      <span class="sub-info">共 {{ myCart.length }} 件商品</span>
    </div>

    <el-empty v-if="myCart.length === 0" description="购物车还是空的，快去选购吧">
      <el-button type="primary" @click="$router.push('/customer')">去逛逛</el-button>
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
          <el-button type="danger" size="large" :disabled="selectedCount === 0" class="checkout-btn"
            @click="handleCheckout">
            结算
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useMainStore } from "@/stores/mainStore";
import { ElMessage, ElMessageBox } from "element-plus";
import { ShoppingCart } from "@element-plus/icons-vue";

const store = useMainStore();
const router = useRouter();

const myCart = computed(() => {
  if (!store.currentUser) return [];
  return store.cart.filter((item) => item.customerId === store.currentUser.id);
});

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

const removeFromCart = async (id) => {
  await store.removeFromCart(id);
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
  }).then(async () => {
    const success = await store.createOrder(selectedItems);
    if (success) {
      ElMessage.success("下单成功！");
      router.push("/customer/orders");
    }
  });
};

// 页面加载时获取购物车数据
onMounted(async () => {
  if (store.currentUser) {
    await store.fetchCartList();
  }
});
</script>

<style scoped>
.cart-page {
  padding: 20px;
  background: #f5f5f5;
  min-height: calc(100vh - 160px);
}

.view-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  background: #fff;
  padding: 15px 20px;
  border-radius: 8px;
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

.orange {
  color: #ff5000;
}

.cart-content {
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

.col-check {
  width: 80px;
  display: flex;
  align-items: center;
}

.col-item {
  display: flex;
  align-items: center;
  flex: 1;
}

.col-price,
.col-total {
  width: 120px;
  text-align: center;
  display: flex;
  align-items: center;
}

.col-num {
  width: 140px;
  text-align: center;
  display: flex;
  align-items: center;
}

.col-action {
  width: 80px;
  text-align: center;
  display: flex;
  align-items: center;
}

.cart-item {
  display: flex;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #f5f5f5;
  transition: background 0.2s;
}

.cart-item:hover {
  background: #fafafa;
}

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

.col-total {
  font-weight: bold;
}

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
</style>
