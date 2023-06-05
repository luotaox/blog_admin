<template>
  <div class="userlist">
    <!-- 面包屑区域 -->
    <div class="bread">
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- table表格区域 -->
    <div style="margin-top: 2em;">
      <el-card>
        <el-table :data="tableData" border>
          <!-- 名称 -->
          <el-table-column prop="username" label="用户名称" />
          <!-- 头像 -->
          <el-table-column prop="avatar" label="头像">
            <template #default="scope">
              <!-- 判断是否有头像 -->
              <div v-if="scope.row.avatar">
                <el-avatar :size="50" :src="'http://localhost:3000' + scope.row.avatar"></el-avatar>
              </div>
              <div v-else>
                <el-avatar :size="50" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
              </div>
            </template>
          </el-table-column>
          <!-- 权限 -->
          <el-table-column prop="role" label="权限">
            <template #default="scope">
              <el-tag class="ml-2" type="danger" v-if="scope.row.role == 1"> 管理员</el-tag>
              <el-tag class="ml-2" type="success" v-else>编辑</el-tag>
            </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column label="操作">
            <template #default="scope">
              <el-button size="small" type="success" @click="userEdit(scope.row)">编辑</el-button>
              <el-button size="small" type="danger" @click="userDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <!-- dialog对话框区域 -->
    <div class="dialog">
      <el-dialog v-model="editUserVisible" title="编辑用户" width="50%">
        <el-form :model="editForm" :rules="UserAddRules" status-icon ref="editRef" label-width="120px">
          <!-- 用户名 -->
          <el-form-item label="用户名" prop="username">
            <el-input v-model="editForm.username" autocomplete="off" />
          </el-form-item>
          <!-- 密码 -->
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="editForm.password" show-password />
          </el-form-item>
          <!-- 权限 -->
          <el-form-item label="角色" prop="role">
            <el-select v-model="editForm.role" placeholder="请选择角色" style="width: 100%;">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <!-- 个人简介 -->
          <el-form-item label="个人简介" prop="introduction">
            <el-input v-model="editForm.introduction" type="textarea" placeholder="介绍一下自己哦 ~" :rows="3" />
          </el-form-item>
        </el-form>
        <template #footer>
          <span>
            <el-button @click="close">取消</el-button>
            <el-button type="primary" @click="editSubmit">
              确认修改
            </el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import axios from 'axios'
import { ArrowRight } from '@element-plus/icons-vue'

const editRef = ref();
// table数据
let tableData = ref([]);

// dislog对话框显示与否
let editUserVisible = ref(false)

// 获取用户列表
const getTableList = async () => {
  const res = await axios.get('adminapi/user/list');
  if (res.status !== 201) return ElMessage.error('获取用户列表失败');
  tableData.value = res.data.data;
}

// 用户表单
let editForm = reactive({
  username: '',
  password: '',
  role: 1,
  introduction: ''
})

// 编辑用户事件
const userEdit = (data) => {
  Object.assign(editForm, data)
  editUserVisible.value = true;
}

// 权限管理数组
const options = [
  {
    label: '编辑',
    value: 2
  },
  {
    label: '管理员',
    value: 1
  }
]

// 删除用户事件
const userDelete = (data) => {
  ElMessageBox.confirm(
    '是否删除?',
    '警告',
    {
      confirmButtonText: '确认',
      cancelButtonText: '否',
      type: 'warning',
    }
  )
    .then(async () => {
      const res = await axios.delete(`adminapi/user/list/${data._id}`);
      if (res.status !== 201) return ElMessage.error('删除失败');
      ElMessage({
        type: 'success',
        message: '删除成功',
      });
      getTableList();
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消',
      })
    })
}

// 表单规则
const UserAddRules = reactive({
  username: [
    {
      required: true,
      message: '用户名不能为空',
      trigger: 'blur'
    },
  ],
  password: [
    {
      required: true,
      message: '密码不能为空',
      trigger: 'blur'
    },
    {
      min: 5,
      message: '密码不能少于5个字符',
      trigger: 'blur'
    }
  ],
  introduction: [
    {
      required: true,
      message: '简介不能为空',
      trigger: 'blur'
    }
  ],
  role: [
    {
      required: true,
      trigger: 'blur'
    }
  ]
})

// 对话框取消事件
const close = () => {
  editUserVisible = false
  ElMessage.info('已取消')
}

// 编辑用户提交事件
const editSubmit = () => {
  editRef.value.validate(async (valid) => {
    if (!valid) return ElMessage.error('请填写必要表单项');
    const res = await axios.put(`adminapi/user/list/${editForm._id}`, editForm);
    if (res.status !== 201) return ElMessage.error('修改失败');
    ElMessage.success('修改成功');
    editUserVisible.value = false;
    getTableList();
  })
}

onMounted(() => {
  getTableList();
})
</script>

<style lang="less" scoped></style>