<template>
  <div class="center">
    <!-- 面包屑区域 -->
    <div class="bread">
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item>个人中心</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="user-info">
      <el-row :gutter="20">
        <!-- 左侧用户信息 -->
        <el-col :span="8" style="text-align: center">
          <el-card class="leftUserInfo">
            <el-avatar :size="70" :src="avatarUrl" />
            <h3>{{ store.state.userInfo.username }}</h3>
            <h5>{{ store.state.userInfo.role === 1 ? '管理员' : '编辑' }}</h5>
          </el-card>
        </el-col>
        <!-- 右侧用户信息更新 -->
        <el-col :span="8">
          <template #header>
            <span>个人信息</span>
          </template>

          <el-form ref="UserRef" :model="userForm" :rules="UserRules" label-width="120px" status-icon>
            <!-- 用户名 -->
            <el-form-item label="用户名" prop="username">
              <el-input v-model="userForm.username" />
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="userForm.password" type="password" show-password />
            </el-form-item>
            <el-form-item label="性别" prop="gender">
              <el-select v-model="userForm.gender" style="width: 100%;" placeholder="请选择性别">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <!-- 个人简介 -->
            <el-form-item label="个人简介" prop="introduction">
              <el-input v-model="userForm.introduction" type="textarea" placeholder="介绍一下自己哦 ~" />
            </el-form-item>
            <!-- 头像上传 -->
            <el-form-item label="头像上传" prop="avatar">
              <Upload :avatar="userForm.avatar" @avatarChange="handleChange" />
            </el-form-item>
            <el-form-item>
              <el-button @click="submitFrom" type="primary">更新</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
import { computed, ref, reactive } from 'vue'
import { ArrowRight } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
// 图片上传封装方法
import upload from '@/http/service/upload.js'
// 图片上传封装组件
import Upload from '@/components/upload/Upload.vue'
const store = useStore();


// 用户头像
const avatarUrl = computed(() => {
  return store.state.userInfo.avatar ? 'http://8.130.52.196:3000' + store.state.userInfo.avatar : 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
})

const UserRef = ref();
// 用户信息
const { username, gender, introduction, avatar, name, password } = store.state.userInfo;
const userForm = reactive({
  username,
  password,
  gender,
  introduction,
  avatar,
  file: '',
})

// 验证规则
const UserRules = reactive({
  username: [
    {
      required: true,
      message: '用户名不能为空',
      trigger: 'blur'
    },
    {
      pattern: /^[A-Za-z0-9]+$/,
      trigger: 'blur',
      message: '用户名只能是数字或字母'
    }
  ],
  gender: [
    {
      required: true,
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

// 性别选择
const options = [
  {
    label: '保密',
    value: 0
  },
  {
    label: '男',
    value: 1
  },
  {
    label: '女',
    value: 2
  },
]

// 图片上传change事件
const handleChange = (file) => {
  // 对图片进行处理
  userForm.avatar = URL.createObjectURL(file)
  userForm.file = file
}

// 点击提交更新事件
const submitFrom = () => {
  UserRef.value.validate(async (valid) => {
    if (!valid) return ElMessage.error('请填写必要表单项');
    const res = await upload('/adminapi/user/upload', userForm)
    if (res.status !== 201) return ElMessage.error('修改失败');
    ElMessage.success('修改成功');
    store.commit('changeUserInfo', res.data.data);
  })
}
</script>

<style lang="less" scoped>
.center {
  .user-info {
    margin-top: 2em;
  }

  .el-card__body {
    text-align: center;
  }

  h3 {
    margin-top: 1em;
    font-size: 25px;
  }

  h5 {
    margin-top: 1em;
    font-size: 20px;
  }

  /deep/.el-form-item--feedback .el-input__validateIcon {
    color: green;
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