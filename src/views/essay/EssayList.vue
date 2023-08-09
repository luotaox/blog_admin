<template>
  <div class="essay_add">
    <!-- 面包屑区域 -->
    <div>
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item>文章管理</el-breadcrumb-item>
        <el-breadcrumb-item>文章列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- table表格区域 -->
    <div style="margin-top: 2em;">
      <el-card>
        <div class="select">
          <el-select v-model="cateValue" placeholder="全部" size="large" clearable @change="selectChange">
            <el-option v-for="item in options" :key="item._id" :label="item.title" :value="item.href" />
          </el-select>
        </div>

        <el-table :data="tableData" border>
          <!-- title -->
          <el-table-column prop="title" label="标题" />
          <!-- 观看次数 -->
          <el-table-column prop="viewsCount" label="观看次数" />
          <!-- 分类 -->
          <el-table-column prop="category" label="类别" />
          <!-- 修改时间 -->
          <el-table-column label="修改时间">
            <template #default="scope">
              {{ formatTime.getTime(scope.row.pubTime) }}
            </template>
          </el-table-column>
          <!-- 是否热门 -->
          <el-table-column prop="isHot" label="是否热门">
            <template #default="scope">
              <el-switch v-model="scope.row.isHot" :active-value="true" :inactive-value="false"
                @change="hanldSwitchChange(scope.row, 'isHot')"></el-switch>
            </template>
          </el-table-column>
          <!-- 是否置顶 -->
          <el-table-column prop="isTop" label="是否置顶">
            <template #default="scope">
              <el-switch v-model="scope.row.isTop" :active-value="true" :inactive-value="false"
                @change="hanldSwitchChange(scope.row, 'isTop')"></el-switch>
            </template>
          </el-table-column>
          <!-- 是否发布 -->
          <el-table-column label="是否发布">
            <template #default="scope">
              <el-switch v-model="scope.row.isPublish" :active-value="1" :inactive-value="0"
                @change="hanldSwitchChange(scope.row, 'isPublish')"></el-switch>
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
                <el-button type="danger" :icon="Delete" circle @click="delEssay(scope.row)" />
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>


    <!-- 预览对话框 -->
    <div class="dialog">
      <el-dialog v-model="previewVisible" title="文章预览" width="50%">
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
let tableData = ref([]);
let tableDatas = ref([]);
// 预览数据
const previewList = ref({});
let options = ref([]);
let cateValue = ref('');
// 预览对话框可见
let previewVisible = ref(false)

onMounted(() => {
  getTableData();
  getCateList();
})

// 获取文章数据
const getTableData = async () => {
  const res = await axios.get(`/adminapi/essay/list`);
  if (res.status !== 201) return ElMessage.error('获取文章列表失败');
  tableData.value = res.data.data;
  tableDatas.value = res.data.data;
}


// 状态
const hanldSwitchChange = async (data, is) => {
  if (is === 'isHot') {
    const res = await axios.put(`/adminapi/essay/ishot`, {
      _id: data._id,
      isHot: data.isHot
    });
    if (res.status !== 201) return ElMessage.error('修改失败');
    ElMessage.success('修改成功')
  } else if (is === 'isTop') {
    const res = await axios.put(`/adminapi/essay/istop`, {
      _id: data._id,
      isTop: data.isTop
    });
    if (res.status !== 201) return ElMessage.error('修改失败');
    ElMessage.success('修改成功')
  } else {
    const res = await axios.put(`/adminapi/essay/ispublish`, {
      _id: data._id,
      isPublish: data.isPublish
    });
    if (res.status !== 201) return ElMessage.error('修改失败');
    ElMessage.success('修改成功')
  }


}

// 监听预览事件

const hanldPreview = (data) => {
  previewList.value = data;
  previewVisible.value = true
}

// 删除
const delEssay = async (data) => {
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
      const res = await axios.delete(`/adminapi/essay/${data._id}`);
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

// 编辑文章
const editNews = (data) => {
  router.push(`/editessay/${data._id}`)
}

// 获取分类
const getCateList = async () => {
  const res = await axios.get('/adminapi/category/list');
  if (res.status !== 201) return ElMessage.error('获取列表失败')
  options.value = res.data.data;
}
// 选择分类
const selectChange = () => {
  if (!cateValue.value) return tableData.value = tableDatas.value;
  const search = tableDatas.value.filter((item) => item.category == cateValue.value);
  tableData.value = search;
}

</script>

<style lang="less" scoped>
/deep/.content {
  img {
    max-width: 100%;
  }
}

.select {
  margin-bottom: 2em;
}
</style>