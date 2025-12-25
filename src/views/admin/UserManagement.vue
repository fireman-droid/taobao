<template>
  <div class="user-management">
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
            <el-button type="primary" @click="addAdminDialogVisible = true">新增管理员</el-button>
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
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="editUser(row)">编辑</el-button>
            <el-button link type="warning" size="small" @click="resetPassword(row)"
              >重置密码</el-button
            >
            <el-popconfirm
              title="确定要强制注销该账号吗？"
              @confirm="deleteUser(row)"
            >
              <template #reference>
                <el-button
                  link
                  type="danger"
                  size="small"
                  :disabled="row.role === 'admin'"
                  >注销</el-button
                >
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 编辑用户对话框 -->
    <el-dialog v-model="editDialogVisible" title="编辑用户信息" width="500px">
      <el-form :model="editForm" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="昵称/店铺名">
          <el-input v-model="editForm.name" placeholder="请输入昵称或店铺名" />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="editForm.role" placeholder="请选择角色" style="width: 100%">
            <el-option label="普通顾客" value="user" />
            <el-option label="入驻商家" value="shop" />
            <el-option label="超级管理员" value="admin" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitEdit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 新增管理员对话框 -->
    <el-dialog v-model="addAdminDialogVisible" title="新增管理员" width="500px">
      <el-form :model="addAdminForm" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="addAdminForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="addAdminForm.password" type="password" placeholder="请输入密码" show-password />
        </el-form-item>
        <el-form-item label="管理员名称">
          <el-input v-model="addAdminForm.name" placeholder="请输入管理员名称" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addAdminDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAddAdmin">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from "vue";
import { useMainStore } from "@/stores/mainStore";
import { ElMessage, ElMessageBox } from "element-plus";
import { Search } from "@element-plus/icons-vue";

const store = useMainStore();
const searchKey = ref("");

// 页面加载时获取用户列表
onMounted(async () => {
  await store.fetchUserList();
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

const deleteUser = async (user) => {
  const success = await store.deleteUser(user.id);
  if (success) {
    ElMessage.success("账号已注销");
    await store.fetchUserList();
  }
};

// 编辑用户对话框
const editDialogVisible = ref(false);
const editForm = reactive({
  id: null,
  username: "",
  name: "",
  role: ""
});

// 新增管理员对话框
const addAdminDialogVisible = ref(false);
const addAdminForm = reactive({
  username: "",
  password: "",
  name: ""
});

const editUser = (user) => {
  editForm.id = user.id;
  editForm.username = user.username;
  editForm.name = user.name;
  editForm.role = user.role;
  editDialogVisible.value = true;
};

const submitEdit = async () => {
  if (!editForm.username || !editForm.name || !editForm.role) {
    ElMessage.warning("请填写完整信息");
    return;
  }
  
  const success = await store.updateUser({
    id: editForm.id,
    username: editForm.username,
    name: editForm.name,
    role: editForm.role
  });
  
  if (success) {
    ElMessage.success("编辑成功");
    editDialogVisible.value = false;
  } else {
    ElMessage.error("编辑失败");
  }
};

const resetPassword = async (user) => {
  ElMessageBox.prompt('请输入新密码（留空则重置为默认密码123456）', '重置密码', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputPattern: /.*/,
    inputPlaceholder: '新密码（可选）'
  }).then(async ({ value }) => {
    const success = await store.resetUserPassword(user.id, value || null);
    if (success) {
      ElMessage.success(value ? "密码已重置为新密码" : "密码已重置为默认密码123456");
    } else {
      ElMessage.error("重置密码失败");
    }
  }).catch(() => {
    // 用户取消
  });
};

const submitAddAdmin = async () => {
  if (!addAdminForm.username || !addAdminForm.password || !addAdminForm.name) {
    ElMessage.warning("请填写完整信息");
    return;
  }
  
  const success = await store.addAdmin({
    username: addAdminForm.username,
    password: addAdminForm.password,
    name: addAdminForm.name
  });
  
  if (success) {
    ElMessage.success("管理员添加成功");
    addAdminDialogVisible.value = false;
    // 清空表单
    addAdminForm.username = "";
    addAdminForm.password = "";
    addAdminForm.name = "";
  } else {
    ElMessage.error("添加失败");
  }
};
</script>

<style scoped>
.user-management {
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
</style>
