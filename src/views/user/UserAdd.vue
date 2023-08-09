<template>
  <div class="userAdd">
    <!-- 面包屑区域 -->
    <div class="bread">
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>添加用户</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 表单区域 -->
    <div class="user-add-form" style="margin-top: 2em;">
      <el-form ref="UserAddRef" :model="userAddForm" :rules="UserAddRules" label-width="120px" status-icon>
        <!-- 用户名 -->
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userAddForm.username" />
        </el-form-item>
        <!-- 密码 -->
        <el-form-item label="密码" prop="password">
          <el-input v-model="userAddForm.password" show-password />
        </el-form-item>
        <!-- 权限 -->
        <el-form-item label="权限" prop="password">
          <el-select v-model="userAddForm.role" style="width: 100%;" placeholder="请选择权限">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"
              :disabled="item.value === 1 ? true : false" />
          </el-select>
        </el-form-item>
        <!-- 个人简介 -->
        <el-form-item label="个人简介" prop="introduction">
          <el-input v-model="userAddForm.introduction" type="textarea" placeholder="介绍一下自己哦 ~" :rows="3" />
        </el-form-item>
        <!-- 头像上传 -->
        <el-form-item label="头像上传" prop="avatar">
          <Upload :avatar="userAddForm.avatar" @avatarChange="handleChange" />
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item>
          <el-button @click="submitFrom" type="primary">添加用户</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'
import { ArrowRight } from '@element-plus/icons-vue'
import { ref, reactive } from 'vue'
// 图片上传封装组件
import Upload from '@/components/upload/Upload.vue'
// 图片上传封装方法
import upload from '@/http/service/upload.js'

// 表单对象
const userAddForm = reactive({
  username: '',
  password: '',
  role: 2,
  introduction: '',
  avatar: '',
  file: null,
  gender: 0//保密
})

const UserAddRef = ref();
// 表单验证规则
const UserAddRules = reactive({
  username: [
    {
      trigger: 'blur',
      validator: async (rule, value, callback) => {
        if (value === '') {
          callback(new Error('用户名不能为空'))
        } else {
          const { data: res } = await axios.post('adminapi/user/distinct', {
            username: userAddForm.username
          });
          if (res.distinct === 0) {
            callback(new Error('用户名已存在'))
          }
        }
      },
    }
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
  avatar: [
    {
      required: true,
      message: '头像不能为空',
      trigger: 'blur'
    }
  ]
})

// 权限管理
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

// 图片上传change事件
const handleChange = (file) => {
  // 对图片进行处理
  userAddForm.avatar = URL.createObjectURL(file)
  userAddForm.file = file
}

// 点击提交事件
const submitFrom = () => {
  UserAddRef.value.validate(async (valid) => {
    if (!valid) return ElMessage.error('请填写必要表单项');
    const res = await upload('adminapi/user/add', userAddForm);
    if (res.status !== 201) return ElMessage.error('添加失败');
    // 重置
    UserAddRef.value.resetFields();
    ElMessage.success('添加成功')
  })
}

</script>

<style lang="less" scoped>
.userAdd {
  .user-add-form {
    width: 55em;
  }
}

/deep/.avatar-uploader .el-upload {
  border: 1px dashed #3d392a;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

/deep/.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

/deep/.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #2561af;
  width: 178px;
  height: 178px;
  text-align: center;
}

/deep/.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>