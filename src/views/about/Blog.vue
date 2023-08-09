<template>
  <div class="blog">
    <!-- 面包屑区域 -->
    <div class="bread">
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item>友联关于</el-breadcrumb-item>
        <el-breadcrumb-item>关于</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div style="margin-top: 2em; width: 50%;">
      <el-card>
        <el-input v-model="editForm.content" :rows="4" type="textarea" />
        <el-button style="margin-top: 2em;" type="primary" @click="submit">更新</el-button>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ArrowRight } from '@element-plus/icons-vue'
import { onMounted, reactive } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'


const editForm = reactive({
  content: ''
})

const getInfo = async () => {
  const res = await axios.get('/adminapi/notice');
  Object.assign(editForm, res.data.data[0]);
}

const submit = async () => {
  const res = await axios.post('/adminapi/notice', editForm);
  if (res.status !== 201) return ElMessage.error('修改失败');
  ElMessage.success('修改成功');
}

onMounted(() => {
  getInfo();
})
</script>