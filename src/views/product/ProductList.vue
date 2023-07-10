<template>
  <div class="news-list">
    <!-- 面包屑区域 -->
    <div class="bread">
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item>产品管理</el-breadcrumb-item>
        <el-breadcrumb-item>产品列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- table表格区域 -->
    <div style="margin-top: 2em;">
      <el-card>
        <el-table :data="tableData" border>
          <!-- 名称 -->
          <el-table-column prop="title" label="产品名称" />
          <!-- 分类 -->
          <el-table-column label="简要描述">
            <template #default="scope">
              {{ scope.row.introduction }}
            </template>
          </el-table-column>
          <!-- 修改时间 -->
          <el-table-column label="修改时间">
            <template #default="scope">
              {{ formatTime.getTime(scope.row.editTime) }}
            </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column label="操作">
            <template #default="scope">
              <el-tooltip effect="light" content="编辑" placement="bottom" :enterable="false">
                <el-button type="primary" :icon="Edit" circle @click="editNews(scope.row)" />
              </el-tooltip>
              <el-tooltip effect="light" content="删除" placement="bottom" :enterable="false">
                <el-button type="danger" :icon="Delete" circle @click="delNews(scope.row)" />
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

  </div>
</template>
<script setup>
import { ArrowRight, Edit, Delete, StarFilled } from '@element-plus/icons-vue'
import { ref, onMounted } from 'vue'
import axios from 'axios'
import formatTime from '@/util/formantTime'
import { useRouter } from 'vue-router'

const router = useRouter();
const tableData = ref([]);

onMounted(() => {
  getTableData();
})

// 获取产品数据
const getTableData = async () => {
  const res = await axios.get(`adminapi/product/list`);
  if (res.status !== 201) return ElMessage.error('获取产品列表失败');
  tableData.value = res.data.data
}

// 删除产品
const delNews = async (data) => {
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
      const res = await axios.delete(`adminapi/product/list/${data._id}`);
      if (res.status !== 201) return ElMessage.error('删除失败');
      ElMessage({
        type: 'success',
        message: '删除成功',
      });
      getTableData();
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消',
      })
    })

}

// 编辑产品
const editNews = (data) => {
  router.push(`/editproduct/${data._id}`);
}
</script>

<style lang="less" scoped>
/deep/.content {
  img {
    max-width: 100%;
  }
}
</style>