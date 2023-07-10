<template>
  <div class="login">
    <div class="formBox">
      <div class="text">
        <h2>新闻后台管理系统</h2>
      </div>
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" status-icon>
        <el-form-item label="" prop="username">
          <el-icon style="margin-left: -2em; padding-right: 1em;">
            <User />
          </el-icon>
          <el-input v-model="loginForm.username" />
        </el-form-item>
        <el-form-item label="" prop="password">
          <el-icon style="margin-left: -2em; padding-right: 1em;">
            <Lock />
          </el-icon>
          <el-input type="password" v-model="loginForm.password" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login()">
            登录
          </el-button>
          <el-button @click="resetForm()">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { Lock, User } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useStore } from 'vuex'

const router = useRouter();
const store = useStore();
const loginForm = reactive({
  username: 'admin',
  password: '123456'
})

const loginFormRef = ref()
// 验证规则
const loginRules = reactive({
  username: [
    {
      trigger: 'blur',
      message: '请输入用户名',
      required: true
    },
    {
      pattern: /^[A-Za-z0-9]+$/,
      trigger: 'blur',
      message: '用户名只能是数字或字母'
    }
  ],
  password: [
    {
      trigger: 'blur',
      message: '请输入密码',
      required: true
    }
  ]
})
// 登录
const login = () => {
  // 效验表单
  loginFormRef.value.validate(async (valid) => {
    if (!valid) return ElMessage.error('请填写必要表单项');
    const res = await axios.post('/adminapi/user/login', loginForm);
    if (res.status !== 201) return ElMessage.error("账号或密码错误");
    // 存储userInfo
    store.commit('changeUserInfo', res.data.data);
    router.push('/home');
    ElMessage.success('登录成功');
    store.commit('changeRouter', false);
  });

}
// 重置
const resetForm = () => {
  loginFormRef.value.resetFields()
}
</script>

<style lang="less" scoped>
.login {
  height: 100vh;
  background-image: linear-gradient(125deg, #38618a, #33a161, #4192c8, #a54439, #b467d5);
  background-size: 400%;
  animation: backs 8s infinite;
}

@keyframes backs {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

/deep/.el-input__suffix-inner {
  color: #409eff;
}

.formBox {
  width: 30%;
  height: 40%;
  margin: 0 auto;
  background-color: rgba(0, 0, 0, 0.1);
  transform: translateY(50%);
  border-radius: 18px;

  .el-form-item {
    padding: 0.2rem 4rem;
    display: flex;
    flex-wrap: nowrap;
  }

  .el-form {
    transform: translateY(50%);

    /deep/.el-input__wrapper {
      background-color: rgba(0, 0, 0, 0);
    }

    /deep/.el-input__inner {
      color: #fff;
    }
  }

  .text {
    text-align: center;
    padding-top: 2em;

    h2 {
      color: #fff;
    }
  }
}
</style>