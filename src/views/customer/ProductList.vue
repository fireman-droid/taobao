<template>
  <div class="product-list-page">
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
          <el-button type="primary" size="small" plain @click="showDetail(item)">
            <el-icon><View /></el-icon> 查看详情
          </el-button>
          <el-button type="warning" size="small" @click="handleAddToCart(item)">
            <el-icon><ShoppingCart /></el-icon> 加入购物车
          </el-button>
        </div>
      </div>
    </div>

    <!-- 商品详情对话框 -->
    <el-dialog v-model="detailVisible" title="商品详情" width="800px" :close-on-click-modal="false">
      <div v-if="currentProduct" class="product-detail">
        <div class="detail-main">
          <div class="detail-image">
            <img :src="currentProduct.image" :alt="currentProduct.name" />
          </div>
          <div class="detail-info">
            <h2 class="detail-title">{{ currentProduct.name }}</h2>
            <div class="detail-price">
              <span class="price-label">价格：</span>
              <span class="price-value">¥{{ currentProduct.price }}</span>
            </div>
            <div class="detail-sales">已售 {{ currentProduct.sales }} 件</div>
            <div class="detail-desc">
              <p>商品描述：这是一款优质商品，品质保证，值得信赖。</p>
              <p>• 正品保障</p>
              <p>• 七天无理由退换</p>
              <p>• 全国包邮</p>
            </div>
            <div class="detail-actions">
              <el-button type="warning" size="large" @click="handleAddToCart(currentProduct)">
                <el-icon><ShoppingCart /></el-icon> 加入购物车
              </el-button>
            </div>
          </div>
        </div>

        <!-- 用户评价区域 -->
        <div class="reviews-section">
          <h3 class="section-title">用户评价</h3>
          <div class="review-item" v-for="(review, index) in mockReviews" :key="index">
            <div class="review-header">
              <el-avatar :size="40">{{ review.user.substring(0, 1) }}</el-avatar>
              <div class="review-user-info">
                <div class="review-user">{{ review.user }}</div>
                <el-rate v-model="review.rating" disabled size="small" />
              </div>
              <div class="review-time">{{ review.time }}</div>
            </div>
            <div class="review-content">{{ review.content }}</div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useMainStore } from "@/stores/mainStore";
import { ElMessage } from "element-plus";
import { Star, ShoppingCart, View } from "@element-plus/icons-vue";

const store = useMainStore();
const router = useRouter();

// 商品详情对话框
const detailVisible = ref(false);
const currentProduct = ref(null);

// 模拟评价数据
const mockReviews = ref([
  {
    user: "张三",
    rating: 5,
    time: "2025-12-20",
    content: "商品质量非常好，物流也很快，非常满意！"
  },
  {
    user: "李四",
    rating: 4,
    time: "2025-12-18",
    content: "整体不错，性价比很高，值得购买。"
  },
  {
    user: "王五",
    rating: 5,
    time: "2025-12-15",
    content: "超出预期，包装精美，商品完好无损，好评！"
  }
]);

// 从父组件接收搜索关键词
const props = defineProps({
  searchKey: {
    type: String,
    default: ''
  }
});

const filteredProducts = computed(() => {
  if (!props.searchKey) return store.products;
  return store.products.filter((p) => p.name.includes(props.searchKey));
});

// 页面加载时获取商品列表
onMounted(async () => {
  await store.fetchProductList();
});

// 显示商品详情
const showDetail = (product) => {
  currentProduct.value = product;
  detailVisible.value = true;
};

const handleAddToCart = async (product) => {
  if (!store.currentUser) {
    ElMessage.warning("请先登录");
    router.push("/login");
    return;
  }
  const success = await store.addToCart(product);
  if (success) {
    ElMessage.success("已加入购物车");
  }
};
</script>

<style scoped>
.product-list-page {
  padding: 20px;
  background: #f5f5f5;
  min-height: calc(100vh - 160px);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  background: #fff;
  padding: 15px 20px;
  border-radius: 8px;
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
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
  overflow: hidden;
  transition: height 0.3s;
  padding: 0 10px;
}
.product-card:hover .hover-actions {
  height: 80px;
}

/* 商品详情对话框样式 */
.product-detail {
  max-height: 70vh;
  overflow-y: auto;
}
.detail-main {
  display: flex;
  gap: 30px;
  margin-bottom: 30px;
}
.detail-image {
  width: 350px;
  height: 350px;
  flex-shrink: 0;
}
.detail-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}
.detail-info {
  flex: 1;
}
.detail-title {
  font-size: 20px;
  color: #333;
  margin: 0 0 20px 0;
}
.detail-price {
  margin-bottom: 15px;
}
.price-label {
  font-size: 14px;
  color: #666;
}
.price-value {
  font-size: 28px;
  color: #ff5000;
  font-weight: bold;
  margin-left: 10px;
}
.detail-sales {
  font-size: 14px;
  color: #999;
  margin-bottom: 20px;
}
.detail-desc {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
  line-height: 1.8;
}
.detail-desc p {
  margin: 5px 0;
  color: #666;
}
.detail-actions {
  margin-top: 30px;
}

/* 评价区域样式 */
.reviews-section {
  border-top: 1px solid #eee;
  padding-top: 20px;
}
.reviews-section .section-title {
  font-size: 16px;
  color: #333;
  margin-bottom: 20px;
}
.review-item {
  padding: 15px;
  background: #f9f9f9;
  border-radius: 8px;
  margin-bottom: 15px;
}
.review-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}
.review-user-info {
  flex: 1;
}
.review-user {
  font-size: 14px;
  color: #333;
  font-weight: 500;
  margin-bottom: 5px;
}
.review-time {
  font-size: 12px;
  color: #999;
}
.review-content {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  padding-left: 50px;
}
</style>
