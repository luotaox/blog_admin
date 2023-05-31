<template>
  <div class="top-header">
    <div class="left">
      <div @click="changeMenu">
        <el-icon :size="24">
          <Menu />
        </el-icon>
      </div>
      <div>
        <span>新闻门户网站</span>
      </div>
    </div>

    <div class="right">
      <div>
        <el-dropdown>
          <el-icon :size="24">
            <User />
          </el-icon>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="toUser">个人中心</el-dropdown-item>
              <el-dropdown-item @click="outLogin">退出</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
import { Menu, User } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router';
const store = useStore();
const router = useRouter();
// 左侧菜单栏的切换
const changeMenu = () => {
  store.commit('changeCollapsed')
}
// 监听点击个人中心事件
const toUser = () => {
  router.push('/centent')
}
// 监听退出事件
const outLogin = () => {
  // 确认组件
  ElMessageBox.confirm(
    '是否退出?',
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '否',
      type: 'warning',
    }
  )
    .then(() => {
      window.sessionStorage.clear();
      router.push('/login')
      ElMessage({
        type: 'success',
        message: '退出成功',
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消',
      })
    })
}
</script>


<style lang="less" scoped>
.top-header {
  height: 4em;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #dfdfdf;

  .left {
    display: flex;
    margin: 0 1em;

    >div {
      margin-right: 1em;
    }

    span {
      font-size: 18px;
    }
  }

  .right {
    margin-right: 2em;
  }
}
</style>