<template>
  <div class="focus">
    <!-- 面包屑区域 -->
    <div class="bread">
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item>文章管理</el-breadcrumb-item>
        <el-breadcrumb-item>聚焦管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div style="margin-top: 2em;">
      <el-card>
        <el-table :data="tableData" border height="700px">
          <!-- title -->
          <el-table-column prop="title" label="title" />
          <!-- img -->
          <el-table-column prop="img" label="背景" />
          <!-- address -->
          <el-table-column label="跳转目录" prop="href" />
          <!-- 操作 -->
          <el-table-column label="操作">
            <template #default="scope">
              <el-tooltip effect="light" content="编辑" placement="bottom" :enterable="false">
                <el-button circle :icon="Edit" type="success" @click="focusEdit(scope.row)"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>


    <el-dialog v-model="focusVisible" title="编辑聚焦管理" width="50%">
      <el-form :model="focusForm" status-icon ref="editRef" label-width="120px">
        <!-- title -->
        <el-form-item label="title" prop="title">
          <el-input v-model="focusForm.title" autocomplete="off" />
        </el-form-item>
        <!-- address -->
        <el-form-item label="跳转目录" prop="href">
          <el-select v-model="focusForm.href" style="width: 100%;">
            <el-option v-for="item in options" :key="item._id" :label="item.title" :value="item.href" />
          </el-select>
        </el-form-item>
        <!-- color -->
        <el-form-item label="背景" prop="img">
          <Upload :avatar="focusForm.img" @avatarChange="handleChange" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span>
          <el-button @click="close">取消</el-button>
          <el-button type="primary" @click="focusSubmit">
            确认修改
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ArrowRight, Edit } from '@element-plus/icons-vue'
import { ref, onMounted, reactive } from 'vue'
import axios from 'axios'
// 图片上传封装方法
import upload from '@/http/service/upload.js'
// 图片上传封装组件
import Upload from '@/components/upload/Upload.vue'
import { ElMessage } from 'element-plus'

let tableData = ref([]);
let focusVisible = ref(false);

const focusForm = reactive({
  title: '',
  img: '',
  href: '/home',
  file: '',
  _id: ''
})

let options = ref([]);

const getOptions = async () => {
  const res = await axios.get('/adminapi/category/list');
  if (res.status !== 201) return ElMessage.error('获取列表失败')
  options.value = res.data.data;
}

// 图片上传change事件
const handleChange = (file) => {
  // 对图片进行处理
  focusForm.img = URL.createObjectURL(file)
  focusForm.file = file
}

const getFocus = async () => {
  const res = await axios.get('/adminapi/focus');
  if (res.status !== 201) return ElMessage.error('获取列表失败');
  tableData.value = res.data.data;
}

const focusEdit = (data) => {
  Object.assign(focusForm, data)
  focusVisible.value = true;
  // 防止上一次上传图片影响下一次
  focusForm.file = '';
}

const focusSubmit = async () => {
  const res = await upload('/adminapi/focus/edit', focusForm);
  if (res.status !== 201) return ElMessage.error('修改失败');
  focusVisible.value = false;
  getFocus();
  ElMessage.success('修改成功');
}

const close = () => {
  focusVisible.value = false
  ElMessage.info('已取消')
}

onMounted(() => {
  getFocus();
  getOptions();
});

</script>

<style lang="less" scoped>
/deep/.avatar-uploader .el-upload {
  border: 1px dashed #3d392a;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

/deep/.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

/deep/.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #2561af;
  width: 178px;
  height: 178px;
  text-align: center;
}

/deep/.avatar-uploader .avatar {
  width: 200px;
  height: 178px;
  display: block;
}
</style>