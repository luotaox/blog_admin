<template>
  <div class="sidemenu">
    <el-menu :default-active="route.fullPath" unique-opened :collapse="store.state.isCollapsed" router
      :collapse-transition="false">
      <el-menu-item index="/home">
        <el-icon>
          <HomeFilled />
        </el-icon>
        <span>首页</span>
      </el-menu-item>

      <el-menu-item index="/centent">
        <el-icon>
          <UserFilled />
        </el-icon>
        <span>个人中心</span>
      </el-menu-item>

      <el-sub-menu index="3" v-admin>
        <template #title>
          <el-icon>
            <Avatar />
          </el-icon>
          <span>用户管理</span>
        </template>
        <el-menu-item index="/useradd">添加用户</el-menu-item>
        <el-menu-item index="/userlist">用户列表</el-menu-item>
      </el-sub-menu>

      <el-sub-menu index="4">
        <template #title>
          <el-icon>
            <MessageBox />
          </el-icon>
          <span>新闻管理</span>
        </template>
        <el-menu-item index="/newsadd">创建新闻</el-menu-item>
        <el-menu-item index="/newslist">新闻列表</el-menu-item>
      </el-sub-menu>

      <el-sub-menu index="5">
        <template #title>
          <el-icon>
            <Reading />
          </el-icon>
          <span>产品管理</span>
        </template>
        <el-menu-item index="/productadd">添加产品</el-menu-item>
        <el-menu-item index="/productlist">产品列表</el-menu-item>
      </el-sub-menu>
    </el-menu>
  </div>
</template>

<script setup>
import { HomeFilled, UserFilled, Avatar, MessageBox, Reading } from '@element-plus/icons-vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
const store = useStore();
const route = useRoute();

// 封装权限指令
const vAdmin = {
  mounted(el) {
    if (store.state.userInfo.role !== 1) {
      el.parentNode.removeChild(el)
    }
  },
}

</script>

<style lang="less" scoped>
.sidemenu {
  .el-menu {
    height: 100vh;
  }
}
</style>