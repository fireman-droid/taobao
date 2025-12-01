<template>
  <div class="home">
    <el-container>
      <el-header>
        <h1>Vue + Element Plus 项目111</h1>
      </el-header>
      <el-main>
        <el-card>
          <template #header>
            <div class="card-header">
              <span>欢迎使用</span>
            </div>
          </template>
          <el-button type="primary" @click="handleClick">点击测试</el-button>
          <p v-if="message">{{ message }}</p>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { ref } from "vue";
import { ElMessage } from "element-plus";

export default {
  name: "HomeView",
  setup() {
    const message = ref("");

    const handleClick = () => {
      message.value = "Element Plus 工作正常！";
      ElMessage.success("点击成功！");
    };

    return {
      message,
      handleClick,
    };
  },
};
</script>

<style scoped>
.home {
  padding: 20px;
}

.el-header {
  background-color: #409eff;
  color: white;
  text-align: center;
  line-height: 60px;
}

.el-main {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
