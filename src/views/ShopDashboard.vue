<template>
  <el-container class="admin-layout">
    <el-aside width="200px" class="aside-menu">
      <div class="brand">商家中心</div>
      <el-menu
        active-text-color="#ff5000"
        background-color="#303133"
        text-color="#fff"
        default-active="1"
      >
        <el-menu-item index="1" @click="activeMenu = 'goods'">
          <el-icon><Goods /></el-icon> <span>商品管理</span>
        </el-menu-item>
        <el-menu-item index="2" @click="activeMenu = 'orders'">
          <el-icon><List /></el-icon> <span>订单管理</span>
        </el-menu-item>
        <el-menu-item index="3">
          <el-icon><Shop /></el-icon> <span>店铺设置</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="admin-header">
        <div class="header-left">当前店铺：{{ store.currentUser?.name }}</div>
        <el-button type="info" size="small" @click="$router.push('/')"
          >返回商城</el-button
        >
        <el-button size="small" @click="$router.push('/login')"
          >退出登录</el-button
        >
      </el-header>

      <el-main class="admin-main">
        <div v-if="activeMenu === 'goods'">
          <div class="panel-header">
            <h3>商品列表</h3>
            <el-button type="primary" @click="dialogVisible = true"
              >发布新商品</el-button
            >
          </div>
          <el-card shadow="never">
            <el-table :data="myProducts" stripe>
              <el-table-column prop="id" label="ID" width="60" />
              <el-table-column label="商品图片" width="100">
                <template #default="{ row }">
                  <img
                    :src="row.image"
                    style="width: 50px; height: 50px; border-radius: 4px"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="name" label="商品名称" />
              <el-table-column prop="price" label="价格(元)" width="100" />
              <el-table-column prop="sales" label="销量" width="100" />
              <el-table-column label="操作" width="150">
                <template #default="scope">
                  <el-button link type="primary">编辑</el-button>
                  <el-button
                    link
                    type="danger"
                    @click="removeProduct(scope.index)"
                    >下架</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </div>

        <div v-if="activeMenu === 'orders'">
          <div class="panel-header"><h3>订单处理</h3></div>
          <el-card shadow="never">
            <el-table :data="shopOrders">
              <el-table-column prop="id" label="订单号" width="150" />
              <el-table-column prop="productName" label="商品" />
              <el-table-column prop="createTime" label="下单时间" width="180" />
              <el-table-column label="状态" width="100">
                <template #default="{ row }">
                  <el-tag :type="row.status === 2 ? 'warning' : 'success'">
                    {{ row.status === 2 ? "待发货" : "已处理" }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作">
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
      </el-main>
    </el-container>

    <el-dialog v-model="dialogVisible" title="发布新宝贝" width="30%">
      <el-form label-position="top">
        <el-form-item label="商品标题">
          <el-input
            v-model="newProd.name"
            placeholder="请输入吸引人的标题"
          ></el-input>
        </el-form-item>
        <el-form-item label="价格">
          <el-input
            v-model="newProd.price"
            type="number"
            placeholder="0.00"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="addProduct">确定上架</el-button>
        </span>
      </template>
    </el-dialog>
  </el-container>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { useMainStore } from "../stores/mainStore";
import { ElMessage } from "element-plus";
import { Goods, List, Shop } from "@element-plus/icons-vue";

const store = useMainStore();
const activeMenu = ref("goods");
const dialogVisible = ref(false);
const newProd = reactive({ name: "", price: "" });

// 过滤数据
const myProducts = computed(() =>
  store.products.filter((p) => p.shopId === store.currentUser.id)
);
const shopOrders = computed(() =>
  store.orders.filter((o) => o.shopId === store.currentUser.id)
);

const addProduct = () => {
  store.products.push({
    id: Date.now(),
    name: newProd.name,
    price: Number(newProd.price),
    sales: 0,
    shopId: store.currentUser.id,
    image: "https://picsum.photos/200/200?random=" + Date.now(),
  });
  dialogVisible.value = false;
  ElMessage.success("上架成功");
};
const removeProduct = (index) => store.products.splice(index, 1);
const ship = (order) => {
  order.status = 3;
  ElMessage.success("发货成功");
};
</script>

<style scoped>
.admin-layout {
  height: 100vh;
}
.aside-menu {
  background-color: #303133;
  color: white;
}
.brand {
  height: 60px;
  line-height: 60px;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  background: #ff5000;
}
.admin-header {
  background: white;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
}
.header-left {
  margin-right: auto;
  font-weight: bold;
}
.admin-main {
  background: #f0f2f5;
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
