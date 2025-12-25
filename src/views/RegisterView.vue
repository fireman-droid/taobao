<template>
  <div class="register-container">
    <div class="register-content">
      <div class="register-left">
        <div class="logo-area">
          <h1>TAOBAO</h1>
          <p>加入我们，开启购物之旅</p>
        </div>
      </div>

      <div class="register-box">
        <h2>用户注册</h2>
        
        <el-form :model="form" :rules="rules" ref="formRef" size="large" class="register-form">
          <!-- 角色选择 -->
          <el-form-item>
            <el-radio-group v-model="form.role" class="role-radio">
              <el-radio-button value="user">
                <el-icon><User /></el-icon> 我是顾客
              </el-radio-button>
              <el-radio-button value="shop">
                <el-icon><Shop /></el-icon> 我是商家
              </el-radio-button>
            </el-radio-group>
          </el-form-item>

          <el-form-item prop="username">
            <el-input v-model="form.username" placeholder="请输入用户名" :prefix-icon="User" />
          </el-form-item>

          <el-form-item prop="name">
            <el-input v-model="form.name" :placeholder="form.role === 'shop' ? '请输入店铺名称' : '请输入昵称'" :prefix-icon="form.role === 'shop' ? Shop : UserFilled" />
          </el-form-item>

          <el-form-item prop="password">
            <el-input v-model="form.password" type="password" placeholder="请输入密码" :prefix-icon="Lock" show-password />
          </el-form-item>

          <el-form-item prop="confirmPassword">
            <el-input v-model="form.confirmPassword" type="password" placeholder="请确认密码" :prefix-icon="Lock" show-password />
          </el-form-item>

          <!-- 商家额外信息 -->
          <template v-if="form.role === 'shop'">
            <el-form-item prop="phone">
              <el-input v-model="form.phone" placeholder="请输入联系电话" :prefix-icon="Phone" />
            </el-form-item>
          </template>

          <el-button type="primary" class="submit-btn" @click="handleRegister">立即注册</el-button>

          <div class="links">
            <span>已有账号？</span>
            <el-link type="primary" @click="$router.push('/login')">去登录</el-link>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useMainStore } from "../stores/mainStore";
import { ElMessage } from "element-plus";
import { User, UserFilled, Lock, Shop, Phone } from "@element-plus/icons-vue";

const store = useMainStore();
const router = useRouter();
const formRef = ref(null);

const form = reactive({
  role: "user",
  username: "",
  name: "",
  password: "",
  confirmPassword: "",
  phone: ""
});

const validateConfirmPassword = (rule, value, callback) => {
  if (value !== form.password) {
    callback(new Error("两次输入的密码不一致"));
  } else {
    callback();
  }
};

const rules = {
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 3, max: 20, message: "用户名长度为3-20个字符", trigger: "blur" }
  ],
  name: [
    { required: true, message: "请输入昵称/店铺名", trigger: "blur" }
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 3, max: 20, message: "密码长度为3-20个字符", trigger: "blur" }
  ],
  confirmPassword: [
    { required: true, message: "请确认密码", trigger: "blur" },
    { validator: validateConfirmPassword, trigger: "blur" }
  ],
  phone: [
    { required: true, message: "请输入联系电话", trigger: "blur" }
  ]
};

const handleRegister = async () => {
  if (!formRef.value) return;
  
  await formRef.value.validate(async (valid) => {
    if (!valid) return;

    // 注册新用户
    const userData = {
      username: form.username,
      password: form.password,
      name: form.name,
      role: form.role
    };

    if (form.role === "shop") {
      userData.phone = form.phone;
    }

    const success = await store.register(userData);
    if (success) {
      ElMessage.success("注册成功，请登录");
      router.push("/login");
    }
  });
};
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #ff9000 0%, #ff5000 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}
.register-content {
  width: 900px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  display: flex;
  overflow: hidden;
}
.register-left {
  width: 320px;
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
  letter-spacing: 2px;
  margin-top: 10px;
  text-align: center;
}

.register-box {
  flex: 1;
  padding: 40px 50px;
}
.register-box h2 {
  text-align: center;
  margin-bottom: 25px;
  color: #333;
}

.role-radio {
  width: 100%;
  display: flex;
}
.role-radio .el-radio-button {
  flex: 1;
}
.role-radio :deep(.el-radio-button__inner) {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.submit-btn {
  width: 100%;
  font-weight: bold;
  letter-spacing: 2px;
  margin-top: 10px;
}

.links {
  margin-top: 20px;
  text-align: center;
  color: #666;
  font-size: 14px;
}
</style>
