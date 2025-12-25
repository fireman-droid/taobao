<template>
  <div class="goods-management">
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
          <template #default="{ row }">
            <el-button link type="primary" @click="editProduct(row)">编辑</el-button>
            <el-popconfirm
              title="确定要下架该商品吗？"
              @confirm="removeProduct(row)"
            >
              <template #reference>
                <el-button link type="danger">下架</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 发布新商品对话框 -->
    <el-dialog v-model="dialogVisible" title="发布新商品" width="500px">
      <el-form label-position="top">
        <el-form-item label="商品标题">
          <el-input
            v-model="newProd.name"
            placeholder="请输入商品名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="商品价格">
          <el-input
            v-model="newProd.price"
            type="number"
            placeholder="请输入价格"
          >
            <template #prepend>¥</template>
          </el-input>
        </el-form-item>
        <el-form-item label="商品图片">
          <el-upload
            class="image-uploader"
            :show-file-list="false"
            :before-upload="beforeUpload"
            :on-change="handleImageChange"
            :auto-upload="false"
            accept="image/*"
          >
            <img v-if="newProd.image" :src="newProd.image" class="uploaded-image" />
            <el-icon v-else class="uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="addProduct">确定上架</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 编辑商品对话框 -->
    <el-dialog v-model="editDialogVisible" title="编辑商品" width="500px">
      <el-form label-position="top">
        <el-form-item label="商品标题">
          <el-input
            v-model="editProd.name"
            placeholder="请输入商品名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="商品价格">
          <el-input
            v-model="editProd.price"
            type="number"
            placeholder="请输入价格"
          >
            <template #prepend>¥</template>
          </el-input>
        </el-form-item>
        <el-form-item label="商品图片">
          <el-upload
            class="image-uploader"
            :show-file-list="false"
            :before-upload="beforeEditUpload"
            :on-change="handleEditImageChange"
            :auto-upload="false"
            accept="image/*"
          >
            <img v-if="editProd.image" :src="editProd.image" class="uploaded-image" />
            <el-icon v-else class="uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitEdit">确定修改</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch, inject } from "vue";
import { useMainStore } from "@/stores/mainStore";
import { ElMessage } from "element-plus";
import { Plus } from "@element-plus/icons-vue";

const store = useMainStore();
const dialogVisible = ref(false);
const editDialogVisible = ref(false);
const showUrlInput = ref(false);
const showEditUrlInput = ref(false);
const newProd = reactive({ name: "", price: "", image: "", imageFile: null });
const editProd = reactive({ id: null, name: "", price: "", image: "", imageFile: null });

// 从父组件注入当前店铺ID
const currentShopId = inject('currentShopId');

// 监听对话框关闭，清空表单
watch(dialogVisible, (newVal) => {
  if (!newVal) {
    resetNewProductForm();
  }
});

watch(editDialogVisible, (newVal) => {
  if (!newVal) {
    showEditUrlInput.value = false;
  }
});

// 页面加载时获取数据
onMounted(async () => {
  if (currentShopId.value) {
    await store.fetchProductList({ shopId: currentShopId.value });
  }
});

// 监听店铺切换
watch(currentShopId, async (newShopId) => {
  if (newShopId) {
    await store.fetchProductList({ shopId: newShopId });
  }
});

// 过滤数据 - 根据当前选中的店铺
const myProducts = computed(() =>
  store.products.filter((p) => p.shopId === currentShopId.value)
);

// 图片上传处理（新增商品）
const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/');
  const isLt2M = file.size / 1024 / 1024 < 2;

  if (!isImage) {
    ElMessage.error('只能上传图片文件!');
    return false;
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!');
    return false;
  }
  return false; // 阻止自动上传
};

const handleImageChange = (file) => {
  // 保存文件对象
  newProd.imageFile = file.raw;
  
  // 预览图片
  const reader = new FileReader();
  reader.onload = (e) => {
    newProd.image = e.target.result;
  };
  reader.readAsDataURL(file.raw);
};

// 图片上传处理（编辑商品）
const beforeEditUpload = (file) => {
  const isImage = file.type.startsWith('image/');
  const isLt2M = file.size / 1024 / 1024 < 2;

  if (!isImage) {
    ElMessage.error('只能上传图片文件!');
    return false;
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!');
    return false;
  }
  return false;
};

const handleEditImageChange = (file) => {
  // 保存文件对象
  editProd.imageFile = file.raw;
  
  // 预览图片
  const reader = new FileReader();
  reader.onload = (e) => {
    editProd.image = e.target.result;
  };
  reader.readAsDataURL(file.raw);
};

const addProduct = async () => {
  if (!newProd.name || !newProd.price) {
    ElMessage.warning("请填写完整信息");
    return;
  }
  
  if (!currentShopId.value) {
    ElMessage.warning("请先选择店铺");
    return;
  }
  
  // 使用 FormData 格式提交
  const formData = new FormData();
  formData.append('name', newProd.name);
  formData.append('price', Number(newProd.price));
  formData.append('shopId', currentShopId.value);
  
  // 如果有上传文件，添加文件；否则添加图片URL
  if (newProd.imageFile) {
    formData.append('imageFile', newProd.imageFile);
  } else if (newProd.image) {
    formData.append('image', newProd.image);
  }
  
  const success = await store.addProduct(formData);
  
  if (success) {
    dialogVisible.value = false;
    resetNewProductForm();
    ElMessage.success("上架成功");
  }
};

// 重置新增商品表单
const resetNewProductForm = () => {
  newProd.name = "";
  newProd.price = "";
  newProd.image = "";
  newProd.imageFile = null;
  showUrlInput.value = false;
};

// 打开编辑对话框
const editProduct = (product) => {
  editProd.id = product.id;
  editProd.name = product.name;
  editProd.price = product.price;
  editProd.image = product.image;
  editDialogVisible.value = true;
};

// 提交编辑
const submitEdit = async () => {
  if (!editProd.name || !editProd.price) {
    ElMessage.warning("请填写完整信息");
    return;
  }
  
  // 使用 FormData 格式提交
  const formData = new FormData();
  formData.append('id', editProd.id);
  formData.append('name', editProd.name);
  formData.append('price', Number(editProd.price));
  
  // 如果有上传新文件，添加文件；否则添加图片URL
  if (editProd.imageFile) {
    formData.append('imageFile', editProd.imageFile);
  } else if (editProd.image) {
    formData.append('image', editProd.image);
  }
  
  const success = await store.updateProduct(formData);
  
  if (success) {
    editDialogVisible.value = false;
    ElMessage.success("修改成功");
  } else {
    ElMessage.error("修改失败");
  }
};

const removeProduct = async (product) => {
  const success = await store.deleteProduct(product.id);
  if (success) {
    ElMessage.success("下架成功");
  } else {
    ElMessage.error("下架失败");
  }
};
</script>

<style scoped>
.goods-management {
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

/* 图片上传样式 */
.image-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s;
}
.image-uploader:hover {
  border-color: #ff5000;
}
.uploaded-image {
  width: 178px;
  height: 178px;
  display: block;
  object-fit: cover;
}
.uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
  line-height: 178px;
}
.upload-tip {
  margin-top: 8px;
  font-size: 12px;
  color: #999;
}
</style>
