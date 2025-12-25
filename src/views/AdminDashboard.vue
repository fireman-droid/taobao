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
        class="el-menu-vertical"
      >
        <el-menu-item index="users">
          <router-link to="/admin" class="menu-link">
            <el-icon><User /></el-icon>
            <span>用户与店铺管理</span>
          </router-link>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="admin-header">
        <div class="header-left">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item>运营管理</el-breadcrumb-item>
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
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useMainStore } from "@/stores/mainStore";
import { ElMessage } from "element-plus";
import {
  Monitor,
  User,
  DocumentChecked,
  Setting,
} from "@element-plus/icons-vue";

const store = useMainStore();
const router = useRouter();

const logout = () => {
  store.logout();
  router.push("/login");
  ElMessage.success("已安全退出");
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
.menu-link {
  display: flex;
  align-items: center;
  gap: 8px;
  color: inherit;
  text-decoration: none;
  width: 100%;
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
  padding: 0;
  background: #f0f2f5;
}
</style>
