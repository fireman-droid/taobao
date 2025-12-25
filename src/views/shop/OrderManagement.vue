<template>
  <div class="order-management">
    <div class="panel-header"><h3>订单处理</h3></div>
    <el-card shadow="never">
      <el-table :data="shopOrders">
        <el-table-column prop="id" label="订单号" width="150" />
        <el-table-column label="商品" min-width="200">
          <template #default="{ row }">
            <div v-for="item in row.items" :key="item.id" style="margin: 5px 0;">
              {{ item.productName }} × {{ item.quantity }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="total" label="订单金额" width="120">
          <template #default="{ row }">
            ¥{{ row.total.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="下单时间" width="180" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 2 ? 'warning' : 'success'">
              {{ row.status === 2 ? "待发货" : "已处理" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button
              v-if="row.status === 2"
              type="primary"
              size="small"
              @click="ship(row)"
              >立即发货</el-button
            >
            <span v-else style="color: #999">无需操作</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { computed, onMounted, watch, inject } from "vue";
import { useMainStore } from "@/stores/mainStore";
import { ElMessage } from "element-plus";

const store = useMainStore();

// 从父组件注入当前店铺ID
const currentShopId = inject('currentShopId');

// 页面加载时获取数据
onMounted(async () => {
  if (currentShopId.value) {
    await store.fetchOrderList();
  }
});

// 监听店铺切换
watch(currentShopId, async (newShopId) => {
  if (newShopId) {
    await store.fetchOrderList();
  }
});

// 订单 - 根据当前选中的店铺
const shopOrders = computed(() =>
  store.orders.filter((o) => o.shopId === currentShopId.value)
);

const ship = async (order) => {
  const success = await store.shipOrder(order.id);
  if (success) {
    ElMessage.success("发货成功");
  }
};
</script>

<style scoped>
.order-management {
  padding: 20px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.panel-header h3 {
  margin: 0;
}
</style>
