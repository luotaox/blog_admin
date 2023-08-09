<template>
  <div class="categories">
    <!-- 面包屑区域 -->
    <div class="bread">
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item>文章管理</el-breadcrumb-item>
        <el-breadcrumb-item>分类管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-tabs type="border-card" style="margin-top: 2em;">
      <!-- 文章分类 -->
      <el-tab-pane label="文章分类">
        <el-card>
          <el-table :data="cateData" border height="700px">
            <!-- title -->
            <el-table-column prop="title" label="title" />
            <!-- address -->
            <el-table-column prop="href" label="跳转地址" />
            <!-- 操作 -->
            <el-table-column label="操作">
              <template #default="scope">
                <el-tooltip effect="light" content="编辑" placement="bottom" :enterable="false">
                  <el-button circle :icon="Edit" type="success" @click="cateEdit(scope.row)"></el-button>
                </el-tooltip>
                <el-tooltip effect="light" content="删除" placement="bottom" :enterable="false">
                  <el-button type="danger" :icon="Delete" circle @click="delCate(scope.row)" />
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="添加分类">
        <div style="width: 50%; margin-left: -3%;">
          <el-form :model="addForm" status-icon ref="addRef" :rules="cateRules" label-width="120px">
            <el-form-item prop="title" label="目录名称">
              <el-input v-model="addForm.title" :prefix-icon="Document" />
            </el-form-item>
            <el-form-item prop="href" label="跳转地址">
              <el-input v-model="addForm.href" :prefix-icon="Position" />
            </el-form-item>
          </el-form>
          <el-divider />

        </div>
        <el-button type="primary" @click="addSubmit">
          添加目录
        </el-button>
      </el-tab-pane>
    </el-tabs>


    <el-dialog v-model="editCateVisible" title="编辑目录" width="50%">
      <el-form :model="cateForm" status-icon ref="editRef" label-width="120px">
        <!-- title -->
        <el-form-item label="title" prop="title">
          <el-input v-model="cateForm.title" autocomplete="off" />
        </el-form-item>
        <!-- address -->
        <el-form-item label="目录" prop="href">
          <el-input v-model="cateForm.href" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span>
          <el-button @click="close">取消</el-button>
          <el-button type="primary" @click="editSubmit">
            确认修改
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ArrowRight, Edit, Divider, Delete, Position, Document } from '@element-plus/icons-vue'
import { ref, onMounted, reactive } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import store from '@/store';

let cateData = ref([]);
const addRef = ref();

let editCateVisible = ref(false);

let cateForm = reactive({
  title: '',
  href: '',
  _id: ''
})

let addForm = reactive({
  title: '',
  href: '/category/'
})

// 验证规则
const cateRules = reactive({
  title: [
    {
      trigger: 'blur',
      required: true,
      message: 'title不能为空'
    }
  ],
  href: [
    {
      trigger: 'blur',
      required: true,
      message: 'href不能为空'
    }
  ]
})

const getCateList = async () => {
  const res = await axios.get('/adminapi/category/list');
  if (res.status !== 201) return ElMessage.error('获取列表失败')
  cateData.value = res.data.data;
}

const cateEdit = (data) => {
  Object.assign(cateForm, data)
  editCateVisible.value = true;
}

const editSubmit = async () => {
  const res = await axios.put('/adminapi/category', cateForm);
  if (res.status !== 201) return ElMessage.error('修改失败');
  editCateVisible.value = false;
  ElMessage.success('修改成功');
  getCateList();
}

const close = () => {
  editCateVisible.value = false
  ElMessage.info('已取消')
}

const addSubmit = async () => {
  addRef.value.validate(async (valid) => {
    if (!valid) return ElMessage.error('请填写必要表单项');
    const res = await axios.post('/adminapi/category/add', addForm);
    if (res.status !== 201) return ElMessage.error('添加失败');
    ElMessage.success('添加成功');
    addRef.value.resetFields();
    getCateList();
  })
}

// 删除目录
const delCate = (data) => {
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
      const res = await axios.delete(`/adminapi/category/${data._id}`);
      if (res.status !== 201) return ElMessage.error('删除失败');
      ElMessage({
        type: 'success',
        message: '删除成功',
      });
      getCateList();
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消',
      })
    })

}

onMounted(() => {
  getCateList();
})
</script>