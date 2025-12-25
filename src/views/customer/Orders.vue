<template>
  <div class="orders-page">
    <div class="view-header">
      <h2 class="page-title"><el-icon><List /></el-icon> 我的订单</h2>
    </div>
    
    <el-empty v-if="myOrders.length === 0" description="暂无订单">
      <el-button type="primary" @click="$router.push('/customer')">去购物</el-button>
    </el-empty>

    <div class="order-list" v-else>
      <div class="order-item" v-for="order in myOrders" :key="order.id">
        <div class="order-header">
          <span class="time">{{ order.createTime }}</span>
          <span class="order-id">订单号：{{ order.id }}</span>
          <el-tag :type="getStatusTag(order.status).type" size="small">
            {{ getStatusTag(order.status).label }}
          </el-tag>
        </div>
        <div class="order-body" v-for="p in order.items" :key="p.productId">
          <img :src="p.image" class="thumb" />
          <div class="info">{{ p.productName }}</div>
          <div class="price">¥{{ p.price }} × {{ p.quantity }}</div>
        </div>
        <div class="order-footer">
          <div class="total">实付款：<strong class="orange">¥{{ order.total.toFixed(2) }}</strong></div>
          <div class="actions">
            <el-button v-if="order.status === 1" type="danger" size="small" @click="pay(order)">立即支付</el-button>
            <el-button v-if="order.status === 3" type="success" size="small" @click="confirmReceipt(order)">确认收货</el-button>
            <el-button v-if="order.status === 4" type="primary" size="small" @click="openReview(order)">评价</el-button>
            <span v-if="order.status === 5" class="completed-text">已完成</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 评价对话框 -->
    <el-dialog v-model="reviewVisible" title="商品评价" width="600px">
      <div v-if="currentOrder" class="review-form">
        <div v-for="item in currentOrder.items" :key="item.productId" class="review-product">
          <div class="product-info">
            <img :src="item.image" class="product-thumb" />
            <span class="product-name">{{ item.productName }}</span>
          </div>
          <el-form label-width="80px">
            <el-form-item label="评分">
              <el-rate v-model="item.rating" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" />
            </el-form-item>
            <el-form-item label="评价内容">
              <el-input
                v-model="item.review"
                type="textarea"
                :rows="3"
                placeholder="分享你的购物体验吧~"
                maxlength="200"
                show-word-limit
              />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <template #footer>
        <el-button @click="reviewVisible = false">取消</el-button>
        <el-button type="primary" @click="submitReview">提交评价</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useMainStore } from "@/stores/mainStore";
import { ElMessage, ElMessageBox } from "element-plus";
import { List } from "@element-plus/icons-vue";

const store = useMainStore();

// 评价对话框
const reviewVisible = ref(false);
const currentOrder = ref(null);

const myOrders = computed(() => {
  if (!store.currentUser) return [];
  return store.orders.filter((o) => o.customerId === store.currentUser.id).reverse();
});

// 获取订单状态标签
const getStatusTag = (status) => {
  const map = {
    1: { type: 'warning', label: '待支付' },
    2: { type: 'info', label: '待发货' },
    3: { type: 'primary', label: '已发货' },
    4: { type: 'success', label: '待评价' },
    5: { type: '', label: '已完成' }
  };
  return map[status] || { type: 'info', label: '未知状态' };
};

const pay = async (order) => {
  const success = await store.payOrder(order.id);
  if (success) {
    ElMessage.success("支付成功");
  }
};

// 确认收货
const confirmReceipt = async (order) => {
  ElMessageBox.confirm('确认已收到商品吗？', '确认收货', {
    confirmButtonText: '确认收货',
    cancelButtonText: '取消',
    type: 'success'
  }).then(() => {
    // 模拟确认收货，将状态改为4（待评价）
    order.status = 4;
    ElMessage.success("收货成功，快去评价吧！");
  }).catch(() => {
    // 用户取消
  });
};

// 打开评价对话框
const openReview = (order) => {
  // 为每个商品添加评分和评价字段
  order.items.forEach(item => {
    if (!item.rating) item.rating = 5;
    if (!item.review) item.review = '';
  });
  currentOrder.value = order;
  reviewVisible.value = true;
};

// 提交评价
const submitReview = () => {
  // 检查是否所有商品都有评价
  const allReviewed = currentOrder.value.items.every(item => item.review && item.review.trim());
  
  if (!allReviewed) {
    ElMessage.warning("请为所有商品填写评价内容");
    return;
  }
  
  // 模拟提交评价，将订单状态改为5（已完成）
  currentOrder.value.status = 5;
  ElMessage.success("评价成功，感谢您的反馈！");
  reviewVisible.value = false;
  currentOrder.value = null;
};

// 页面加载时获取订单数据
onMounted(async () => {
  if (store.currentUser) {
    await store.fetchOrderList();
  }
});
</script>

<style scoped>
.orders-page {
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

.orange { color: #ff5000; }

.order-item {
  border: 1px solid #eee;
  border-radius: 8px;
  margin-bottom: 15px;
  overflow: hidden;
  background: #fff;
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
.order-footer .actions {
  display: flex;
  gap: 10px;
  align-items: center;
}
.completed-text {
  color: #67c23a;
  font-size: 14px;
}

/* 评价对话框样式 */
.review-form {
  max-height: 60vh;
  overflow-y: auto;
}
.review-product {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}
.review-product:last-child {
  border-bottom: none;
}
.product-info {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}
.product-thumb {
  width: 50px;
  height: 50px;
  border-radius: 4px;
  object-fit: cover;
}
.product-name {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}
</style>
