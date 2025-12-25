<template>
  <div class="shop-settings">
    <el-card header="店铺设置">
      <el-form label-width="120px">
        <el-form-item label="店铺名称">
          <el-input placeholder="请输入店铺名称" />
        </el-form-item>
        <el-form-item label="店铺简介">
          <el-input type="textarea" :rows="4" placeholder="请输入店铺简介" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary">保存修改</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
</script>

<style scoped>
.shop-settings {
  padding: 20px;
}
</style>
