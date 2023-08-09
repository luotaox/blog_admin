<template>
  <div class="footer">
    <!-- 面包屑区域 -->
    <div class="bread">
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item>网站设置</el-breadcrumb-item>
        <el-breadcrumb-item>页脚设置</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
  </div>


  <el-tabs type="border-card" style="margin-top: 2em;">
    <!-- 社交信息 -->
    <el-tab-pane label="页脚">
      <el-card>
        <el-table :data="tableData" border height="700px">
          <!-- title -->
          <el-table-column prop="title" label="title" />
          <!-- address -->
          <el-table-column prop="href" label="跳转地址" />
          <!-- 操作 -->
          <el-table-column label="操作">
            <template #default="scope">
              <el-tooltip effect="light" content="编辑" placement="left" :enterable="false">
                <el-button circle :icon="Edit" type="success" @click="footerEdit(scope.row)"></el-button>
              </el-tooltip>
              <el-tooltip effect="light" content="删除" placement="right" :enterable="false">
                <el-button circle :icon="Delete" type="danger" @click="delSite(scope.row)"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-tab-pane>
    <el-tab-pane label="添加页脚信息">
      <div style="width: 50%; margin-left: -3%;">
        <el-form :model="addForm" status-icon label-width="120px" :rules="addFormRules" ref="addRef">
          <!-- title -->
          <el-form-item label="title" prop="title">
            <el-input v-model="addForm.title" autocomplete="off" />
          </el-form-item>
          <!-- address -->
          <el-form-item label="跳转地址" prop="href">
            <el-input v-model="addForm.href" />
          </el-form-item>
        </el-form>
        <el-divider />

      </div>
      <el-button type="primary" @click="addSubmit">添加</el-button>
    </el-tab-pane>
  </el-tabs>
  <div>

    <el-dialog v-model="editUserVisible" title="编辑页脚信息" width="50%">
      <el-form :model="editForm" status-icon label-width="120px">
        <!-- title -->
        <el-form-item label="title" prop="title">
          <el-input v-model="editForm.title" autocomplete="off" />
        </el-form-item>
        <!-- address -->
        <el-form-item label="跳转地址" prop="href">
          <el-input v-model="editForm.href" />
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
import { ArrowRight, Edit, Delete } from '@element-plus/icons-vue'
import { ref, onMounted, reactive } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

// table数据
let tableData = ref([]);
let editUserVisible = ref(false);
const addRef = ref();
// 用户表单
let editForm = reactive({
  title: '',
  href: '',
});

let addForm = reactive({
  title: '',
  href: '',
});

const getList = async () => {
  const res = await axios.get('adminapi/footer');
  if (res.status !== 201) return ElMessage.error('获取列表失败');
  tableData.value = res.data.data;
}

const editSubmit = async () => {
  const res = await axios.post('/adminapi/footer/edit', editForm);
  if (res.status !== 201) return ElMessage.error('修改失败');
  editUserVisible.value = false;
  getList();
  ElMessage.success('修改成功');
}

const addSubmit = async () => {
  addRef.value.validate(async (valid) => {
    if (!valid) return ElMessage.error('请填写必要表单项');
    const res = await axios.post('/adminapi/footer/add', addForm);
    if (res.status !== 201) return ElMessage.error('添加失败');
    // 重置
    addRef.value.resetFields();
    ElMessage.success('添加成功');
    getList();
  })


}

const footerEdit = (data) => {
  Object.assign(editForm, data)
  editUserVisible.value = true;
}

const close = () => {
  editUserVisible.value = false
  ElMessage.info('已取消')
}

const addFormRules = reactive({
  title: [
    {
      required: true,
      trigger: 'blur',
      message: 'title不能为空'
    }
  ],
  href: [
    {
      required: true,
      trigger: 'blur',
      message: '链接不能为空'
    },
    {
      pattern: /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/[\]@!\$&'\*\+,;=.]+$/,
      trigger: 'blur',
      message: '链接不合法'
    }
  ]
})

const delSite = async (data) => {
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
      const res = await axios.delete(`/adminapi/footer/${data._id}`);
      if (res.status !== 201) return ElMessage.error('删除失败');
      ElMessage({
        type: 'success',
        message: '删除成功',
      });
      getList();
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消',
      })
    })

}
onMounted(() => {
  getList();
})

</script>