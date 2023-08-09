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
            <Monitor />
          </el-icon>
          <span>网站设置</span>
        </template>
        <el-menu-item index="/siteinfo">网站基本信息</el-menu-item>
        <el-menu-item index="/footer">页脚设置</el-menu-item>
      </el-sub-menu>

      <el-sub-menu index="5">
        <template #title>
          <el-icon>
            <MessageBox />
          </el-icon>
          <span>文章管理</span>
        </template>
        <el-menu-item index="/focus">聚焦设置</el-menu-item>
        <el-menu-item index="/categories">文章分类</el-menu-item>
        <el-menu-item index="/essay/list">文章列表</el-menu-item>
        <el-menu-item index="/essay">写文章</el-menu-item>
      </el-sub-menu>

      <el-sub-menu index="6">
        <template #title>
          <el-icon>
            <Reading />
          </el-icon>
          <span>友链关于</span>
        </template>
        <el-menu-item index="/friend">友联</el-menu-item>
        <el-menu-item index="/blog">关于</el-menu-item>
      </el-sub-menu>
    </el-menu>
  </div>
</template>

<script setup>
import { HomeFilled, UserFilled, Avatar, MessageBox, Reading, Monitor } from '@element-plus/icons-vue'
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