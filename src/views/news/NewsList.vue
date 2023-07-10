<template>
  <div class="news-list">
    <!-- 面包屑区域 -->
    <div class="bread">
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item>新闻管理</el-breadcrumb-item>
        <el-breadcrumb-item>新闻列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- table表格区域 -->
    <div style="margin-top: 2em;">
      <el-card>
        <el-table :data="tableData" border>
          <!-- 名称 -->
          <el-table-column prop="title" label="标题" />
          <!-- 分类 -->
          <el-table-column label="分类">
            <template #default="scope">
              {{ categoryFormat(scope.row.category) }}
            </template>
          </el-table-column>
          <!-- 修改时间 -->
          <el-table-column label="修改时间">
            <template #default="scope">
              {{ formatTime.getTime(scope.row.editTime) }}
            </template>
          </el-table-column>
          <!-- 是否发布 -->
          <el-table-column label="是否发布">
            <template #default="scope">
              <el-switch v-model="scope.row.isPublish" :active-value="1" :inactive-value="0"
                @change="hanldSwitchChange(scope.row)"></el-switch>
            </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column label="操作">
            <template #default="scope">
              <el-tooltip effect="light" content="预览" placement="bottom" :enterable="false">
                <el-button type="success" :icon="Star" circle @click="hanldPreview(scope.row)" />
              </el-tooltip>
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


    <!-- 预览对话框 -->
    <div class="dialog">
      <el-dialog v-model="previewVisible" title="新闻预览" width="50%">
        <h2 style="font-size: 28px;">{{ previewList.title }}</h2>
        <p style="font-size: 13px; margin-top: 1em;">编辑时间: &nbsp;{{ formatTime.getTime(previewList.editTime) }} </p>
        <!-- 分割线 -->
        <el-divider>
          <el-icon><star-filled /></el-icon>
        </el-divider>
        <div class="content" v-html="previewList.content" />
      </el-dialog>
    </div>
  </div>
</template>
<script setup>
import { ArrowRight, Edit, Star, Delete, StarFilled } from '@element-plus/icons-vue'
import { ref, onMounted } from 'vue'
import axios from 'axios'
import formatTime from '@/util/formantTime'
import { useRouter } from 'vue-router'

const router = useRouter();
const tableData = ref([]);
// 预览数据
const previewList = ref({})
// 新闻预览对话框可见
let previewVisible = ref(false)

onMounted(() => {
  getTableData();
})

// 获取新闻数据
const getTableData = async () => {
  const res = await axios.get(`adminapi/news/list`);
  if (res.status !== 201) return ElMessage.error('获取新闻列表失败');
  tableData.value = res.data.data
}

// 格式化分类数据
const categoryFormat = (category) => {
  const Arr = ['最新发布', '典型案例', '通知公告'];
  return Arr[category - 1];
}

// 发布关闭新闻
const hanldSwitchChange = async (data) => {
  const res = await axios.put(`/adminapi/news/publish/`, {
    _id: data._id,
    isPublish: data.isPublish
  });
  if (res.status !== 201) return ElMessage.error('修改失败');
  ElMessage.success('修改成功')
}

// 监听预览事件
const hanldPreview = (data) => {
  previewList.value = data;
  previewVisible.value = true
}

// 删除新闻
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
      const res = await axios.delete(`adminapi/news/list/${data._id}`);
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

// 编辑新闻
const editNews = (data) => {
  router.push(`/editnews/${data._id}`)
}
</script>

<style lang="less" scoped>
/deep/.content {
  img {
    max-width: 100%;
  }
}
</style>