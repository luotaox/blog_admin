<template>
  <div class="main-box">
    <el-container>
      <el-aside :width="store.state.isCollapsed ? '64px' : '200px'">
        <side-menu />
      </el-aside>
      <el-container>
        <el-header>
          <top-header />
        </el-header>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>

  </div>
</template>

<script setup>
import TopHeader from './TopHeader.vue'
import SideMenu from './SideMenu.vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router';

const store = useStore();
const router = useRouter();

router.push('/home')
</script>

<style lang="less" scoped>
.main-box {
  background-color: #eff0f2;
}
</style>