<template>
  <div class="home">
    <!-- 面包屑区域 -->
    <el-col class="bread">
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <!-- 头像区域 -->
    <el-col class="avatar">
      <div class="text">
        <el-avatar :size="60" :src="avatarUrl" />
      </div>
    </el-col>
    <!-- 问候语区域 -->
    <el-col style="margin-top: 2em;">
      <div class="text">
        <h3>Hi~ {{ Welcome }}</h3>
      </div>
    </el-col>
    <el-col style="margin-top: 2em;">
      <div class="text">
        <h1>欢迎回来</h1>
      </div>
    </el-col>

    <el-col style="margin-top: 2em;">
      <div class="text">
        <h5>{{ store.state.userInfo.username }}</h5>
      </div>
    </el-col>
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
import { computed } from 'vue'
import { ArrowRight } from '@element-plus/icons-vue'

const store = useStore();
// 用户头像
const avatarUrl = computed(() => {
  return store.state.userInfo.avatar ? store.state.userInfo.avatar : 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
})
// 问候语
const Welcome = computed(() => {
  const date = new Date().getHours();
  if (date <= 11) {
    return '早上好 ~'
  }
  else if (18 < date) {
    return '晚上好 ~'
  } else if (13 < date <= 18) {
    return '下午好 ~'
  }
})
</script>

<style lang="less" scoped>
.home {
  /deep/.el-breadcrumb__inner {
    color: #000000;
  }

  .avatar {
    margin-top: 1em;
  }

  .text {
    text-align: center;
  }

  h1 {
    font-size: 22px;
  }

  h3 {
    font-size: 20px;
  }

  h5 {
    font-size: 18px;
  }
}
</style>