<template>
  <div class="login-container">
    <div class="login-content">
      <div class="login-left">
        <div class="logo-area">
          <h1>TAOBAO</h1>
          <p>让购物更简单</p>
        </div>
      </div>

      <div class="login-box">
        <h2>账号登录</h2>
        <el-tabs v-model="activeRole" class="role-tabs">
          <el-tab-pane label="我是顾客" name="user"></el-tab-pane>
          <el-tab-pane label="我是商家" name="shop"></el-tab-pane>
          <el-tab-pane label="管理员" name="admin"></el-tab-pane>
        </el-tabs>

        <el-form size="large" class="login-form">
          <el-form-item>
            <el-input
              v-model="form.username"
              placeholder="请输入用户名"
              :prefix-icon="User"
            />
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="form.password"
              type="password"
              placeholder="请输入密码"
              :prefix-icon="Lock"
              show-password
            />
          </el-form-item>
          <el-button type="primary" class="submit-btn" @click="handleLogin"
            >登 录</el-button
          >

          <div class="links">
            <el-link type="primary" @click="$router.push('/register')">立即注册</el-link>
            <el-link type="info" @click="$router.push('/')">游客访问商城 >></el-link>
          </div>
        </el-form>

        <div class="tips">
          <p>测试账号：user1/123 (顾客)</p>
          <p>测试账号：shop1/123 (商家)</p>
          <p>测试账号：admin/123 (管理员)</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useMainStore } from "../stores/mainStore";
import { ElMessage } from "element-plus";
import { User, Lock } from "@element-plus/icons-vue"; // 需要先安装图标库

const store = useMainStore();
const router = useRouter();
const activeRole = ref("user"); // 仅用于视觉切换，实际逻辑看账号
const form = reactive({ username: "", password: "" });

const handleLogin = () => {
  if (store.login(form.username, form.password)) {
    ElMessage.success(`欢迎回来，${store.currentUser.name}`);
    const role = store.currentUser.role;
    if (role === "admin") router.push("/admin");
    else if (role === "shop") router.push("/shop");
    else router.push("/");
  } else {
    ElMessage.error("账号或密码错误");
  }
};
</script>

<style scoped>
.login-container {
  height: 100vh;
  background: linear-gradient(135deg, #ff9000 0%, #ff5000 100%);
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-content {
  width: 900px;
  height: 500px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  display: flex;
  overflow: hidden;
}
.login-left {
  flex: 1;
  background: #fff5f0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.logo-area h1 {
  font-size: 48px;
  color: #ff5000;
  margin: 0;
  font-weight: 800;
  letter-spacing: 2px;
}
.logo-area p {
  color: #666;
  letter-spacing: 5px;
  margin-top: 10px;
}

.login-box {
  flex: 1;
  padding: 40px 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.login-box h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}
.role-tabs {
  margin-bottom: 20px;
}
.submit-btn {
  width: 100%;
  font-weight: bold;
  letter-spacing: 2px;
}
.links {
  margin-top: 15px;
  display: flex;
  justify-content: space-between;
}
.tips {
  margin-top: 30px;
  font-size: 12px;
  color: #999;
  background: #f9f9f9;
  padding: 10px;
  border-radius: 4px;
}
.tips p {
  margin: 4px 0;
}
</style>
