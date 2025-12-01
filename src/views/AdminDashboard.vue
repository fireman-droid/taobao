<template>
  <el-container class="admin-layout">
    <el-aside width="220px" class="aside-menu">
      <div class="brand">
        <el-icon class="logo-icon"><Monitor /></el-icon>
        <span>运营管理中心</span>
      </div>

      <el-menu
        active-text-color="#ff5000"
        background-color="#304156"
        text-color="#bfcbd9"
        :default-active="activeMenu"
        class="el-menu-vertical"
      >
        <el-menu-item index="users" @click="activeMenu = 'users'">
          <el-icon><User /></el-icon>
          <span>用户与店铺管理</span>
        </el-menu-item>

        <el-menu-item index="audit" @click="activeMenu = 'audit'">
          <el-icon><DocumentChecked /></el-icon>
          <span>店铺入驻审核</span>
        </el-menu-item>

        <el-menu-item index="system" @click="activeMenu = 'system'">
          <el-icon><Setting /></el-icon>
          <span>系统设置</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="admin-header">
        <div class="header-left">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item>运营管理</el-breadcrumb-item>
            <el-breadcrumb-item>{{ menuTitle }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <el-avatar
            :size="32"
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
          />
          <span class="username">系统管理员 (Admin)</span>
          <el-divider direction="vertical" />
          <el-button link type="danger" @click="logout">退出登录</el-button>
        </div>
      </el-header>

      <el-main class="admin-main">
        <div v-if="activeMenu === 'users'" class="fade-in">
          <el-row :gutter="20" class="stat-row">
            <el-col :span="6">
              <el-card shadow="hover" class="stat-card">
                <div class="stat-value">{{ store.users.length }}</div>
                <div class="stat-label">总用户数</div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card shadow="hover" class="stat-card">
                <div class="stat-value" style="color: #67c23a">
                  {{ shopCount }}
                </div>
                <div class="stat-label">入驻店铺</div>
              </el-card>
            </el-col>
          </el-row>

          <el-card shadow="never" class="table-card">
            <template #header>
              <div class="card-header">
                <h3>账号列表</h3>
                <div class="header-actions">
                  <el-input
                    v-model="searchKey"
                    placeholder="搜索用户名..."
                    style="width: 200px; margin-right: 10px"
                    :prefix-icon="Search"
                  />
                  <el-button type="primary">新增管理员</el-button>
                </div>
              </div>
            </template>

            <el-table
              :data="filteredUsers"
              stripe
              style="width: 100%"
              size="large"
            >
              <el-table-column prop="id" label="ID" width="80" align="center" />

              <el-table-column label="用户信息" min-width="180">
                <template #default="{ row }">
                  <div class="user-info-cell">
                    <el-avatar :size="36" shape="square">{{
                      row.username.substring(0, 1).toUpperCase()
                    }}</el-avatar>
                    <div class="text-info">
                      <div class="name">{{ row.name }}</div>
                      <div class="sub">@{{ row.username }}</div>
                    </div>
                  </div>
                </template>
              </el-table-column>

              <el-table-column prop="role" label="角色身份" width="150">
                <template #default="{ row }">
                  <el-tag :type="getRoleTag(row.role).type" effect="dark">
                    {{ getRoleTag(row.role).label }}
                  </el-tag>
                </template>
              </el-table-column>

              <el-table-column label="状态" width="120">
                <template #default>
                  <el-tag type="success" size="small" effect="plain"
                    >● 正常</el-tag
                  >
                </template>
              </el-table-column>

              <el-table-column label="操作" width="200" align="right">
                <template #default="scope">
                  <el-button link type="primary" size="small">编辑</el-button>
                  <el-button link type="warning" size="small"
                    >重置密码</el-button
                  >
                  <el-popconfirm
                    title="确定要强制注销该账号吗？"
                    @confirm="deleteUser(scope.index)"
                  >
                    <template #reference>
                      <el-button
                        link
                        type="danger"
                        size="small"
                        :disabled="scope.row.role === 'admin'"
                        >注销</el-button
                      >
                    </template>
                  </el-popconfirm>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </div>

        <div v-if="activeMenu === 'audit'" class="fade-in">
          <el-empty description="暂无待审核的店铺申请" />
        </div>

        <div v-if="activeMenu === 'system'" class="fade-in">
          <el-card header="系统参数配置">
            <el-form label-width="120px">
              <el-form-item label="平台名称"
                ><el-input model-value="淘宝模拟商城"
              /></el-form-item>
              <el-form-item label="默认佣金比例"
                ><el-input model-value="5%"
              /></el-form-item>
              <el-form-item
                ><el-button type="primary">保存修改</el-button></el-form-item
              >
            </el-form>
          </el-card>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useMainStore } from "../stores/mainStore";
import { ElMessage } from "element-plus";
import {
  Monitor,
  User,
  DocumentChecked,
  Setting,
  Search,
} from "@element-plus/icons-vue";

const store = useMainStore();
const router = useRouter();
const activeMenu = ref("users");
const searchKey = ref("");

// 动态标题
const menuTitle = computed(() => {
  const map = { users: "用户列表", audit: "入驻审核", system: "系统设置" };
  return map[activeMenu.value];
});

// 统计数据
const shopCount = computed(
  () => store.users.filter((u) => u.role === "shop").length
);

// 搜索过滤
const filteredUsers = computed(() => {
  if (!searchKey.value) return store.users;
  return store.users.filter(
    (u) =>
      u.username.toLowerCase().includes(searchKey.value.toLowerCase()) ||
      u.name.includes(searchKey.value)
  );
});

// 角色标签样式
const getRoleTag = (role) => {
  const map = {
    admin: { type: "danger", label: "超级管理员" },
    shop: { type: "warning", label: "入驻商家" },
    user: { type: "", label: "普通顾客" },
  };
  return map[role] || { type: "info", label: "未知" };
};

const logout = () => {
  store.currentUser = null;
  router.push("/login");
  ElMessage.success("已安全退出");
};

const deleteUser = (index) => {
  store.users.splice(index, 1);
  ElMessage.success("账号已注销");
};
</script>

<style scoped>
/* 整体布局 */
.admin-layout {
  height: 100vh;
  background: #f0f2f5;
}

/* 侧边栏 */
.aside-menu {
  background-color: #304156;
  color: #fff;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
  z-index: 10;
}
.brand {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #2b3649;
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  letter-spacing: 1px;
}
.logo-icon {
  margin-right: 8px;
  font-size: 20px;
  color: #ff5000;
}
.el-menu-vertical {
  border-right: none;
}

/* 顶部 Header */
.admin-header {
  background: #fff;
  height: 60px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  z-index: 9;
}
.header-right {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #666;
}
.username {
  font-weight: 500;
  color: #333;
}

/* 主内容区 */
.admin-main {
  padding: 20px;
}

/* 统计卡片 */
.stat-row {
  margin-bottom: 20px;
}
.stat-card {
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
}
.stat-card:hover {
  transform: translateY(-3px);
}
.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}
.stat-label {
  font-size: 12px;
  color: #999;
}

/* 表格卡片 */
.table-card {
  border: none;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.card-header h3 {
  margin: 0;
  font-size: 16px;
  border-left: 4px solid #ff5000;
  padding-left: 10px;
}
.header-actions {
  display: flex;
  align-items: center;
}

/* 表格内部样式 */
.user-info-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}
.text-info {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}
.text-info .name {
  font-weight: bold;
  color: #333;
}
.text-info .sub {
  font-size: 12px;
  color: #999;
}

/* 动画 */
.fade-in {
  animation: fadeIn 0.3s ease-in-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
