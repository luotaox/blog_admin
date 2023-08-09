<template>
  <div class="friends">
    <!-- 面包屑区域 -->
    <div class="bread">
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item>友联关于</el-breadcrumb-item>
        <el-breadcrumb-item>友联</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-tabs type="border-card" style="margin-top: 2em;">
      <el-tab-pane label="友联信息">
        <div>
          <el-card>
            <el-table :data="tableData" border height="240px">
              <el-table-column prop="siteName" label="名称" />
              <el-table-column prop="path" label="链接" />
              <el-table-column prop="desc" label="描述" />
              <el-table-column label="操作">
                <template #default="scope">
                  <el-tooltip effect="light" content="编辑" placement="bottom" :enterable="false">
                    <el-button circle :icon="Edit" type="success" @click="friendEdit(scope.row)"></el-button>
                  </el-tooltip>
                  <el-tooltip effect="light" content="删除" placement="bottom" :enterable="false">
                    <el-button type="danger" circle :icon="Delete" @click="friendDelete(scope.row)"></el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </div>
      </el-tab-pane>

      <el-tab-pane label="添加友联">
        <div style="width: 50%; margin-left: -3%;">
          <el-form :model="addFriendForm" status-icon label-width="120px" :rules="addFriendFormRules" ref="addFriendoRef">
            <el-form-item label="站点名称" prop="siteName">
              <el-input v-model="addFriendForm.siteName" />
            </el-form-item>
            <el-form-item label="站点链接" prop="path">
              <el-input v-model="addFriendForm.path" />
            </el-form-item>
            <el-form-item label="简短描述" prop="desc">
              <el-input v-model="addFriendForm.desc" />
            </el-form-item>
          </el-form>
          <el-divider />

        </div>
        <el-button type="primary" @click="addSubmit">添加</el-button>
      </el-tab-pane>

      <el-tab-pane label="示例信息">
        <div style="width: 50%; margin-left: -3%;">
          <el-form :model="demoInfo" status-icon label-width="120px" :rules="demoFormRules" ref="demoInfoRef">
            <el-form-item label="站点名称" prop="name">
              <el-input v-model="demoInfo.name" autocomplete="off" />
            </el-form-item>
            <el-form-item label="站点链接" prop="href">
              <el-input v-model="demoInfo.href" />
            </el-form-item>
            <el-form-item label="简短描述" prop="desc">
              <el-input v-model="demoInfo.desc" />
            </el-form-item>
          </el-form>
          <el-divider />

        </div>
        <el-button type="primary" @click="upSubmit">更新</el-button>
      </el-tab-pane>
    </el-tabs>


    <el-dialog v-model="editUserVisible" title="编辑友联信息" width="50%">
      <el-form :model="editForm" status-icon label-width="120px" ref="editFormRef">
        <!-- title -->
        <el-form-item label="名称" prop="name">
          <el-input v-model="editForm.siteName" autocomplete="off" />
        </el-form-item>
        <!-- address -->
        <el-form-item label="链接" prop="href">
          <el-input v-model="editForm.path" />
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input v-model="editForm.desc" :rows="3" type="textarea" />
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
let editUserVisible = ref(false);
const demoInfoRef = ref();
const editFormRef = ref();
const addFriendoRef = ref();

const demoFormRules = reactive({
  name: [
    {
      required: true,
      message: '不能为空',
      trigger: 'blur'
    }
  ],
  href: [
    {
      required: true,
      message: '不能为空',
      trigger: 'blur'
    }
  ],
  desc: [
    {
      required: true,
      message: '不能为空',
      trigger: 'blur'
    }
  ]
})

const addFriendFormRules = reactive({
  siteName: [
    {
      required: true,
      message: '不能为空',
      trigger: 'blur'
    }
  ],
  path: [
    {
      required: true,
      message: '不能为空',
      trigger: 'blur'
    }
  ],
  desc: [
    {
      required: true,
      message: '不能为空',
      trigger: 'blur'
    }
  ]
})

let demoInfo = reactive({
  name: '',
  href: '',
  desc: ''
})

let tableData = ref([]);

let editForm = reactive({
  _id: '',
  siteName: '',
  path: '',
  desc: ''
});

// 添加友联表单
let addFriendForm = reactive({
  siteName: '',
  path: '',
  desc: ''
})

const getDemoInfo = async () => {
  const res = await axios.get('/adminapi/notice');
  if (res.status !== 201) return ElMessage.error('获取列表失败');
  Object.assign(demoInfo, res.data.data[0]);
}

const friendList = async () => {
  const res = await axios.get('/adminapi/friend');
  if (res.status !== 201) return ElMessage.error('获取列表失败');
  tableData.value = res.data.data;
}

const upSubmit = async () => {
  demoInfoRef.value.validate(async (valid) => {
    if (!valid) return ElMessage.error('请填写必要表单项');
    const res = await axios.post('/adminapi/notice', demoInfo);
    if (res.status !== 201) return ElMessage.error('修改失败');
    ElMessage.success('修改成功');
  })
}

const friendEdit = (data) => {
  Object.assign(editForm, data)
  editUserVisible.value = true;
}
const close = () => {
  editUserVisible.value = false
  ElMessage.info('已取消')
}

const editSubmit = async () => {
  const res = await axios.put('/adminapi/friend', editForm);
  if (res.status !== 201) return ElMessage.error('修改失败');
  ElMessage.success('修改成功');
  editUserVisible.value = false;
  friendList();
}

// 删除友联
const friendDelete = (data) => {
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
      const res = await axios.delete(`/adminapi/friend/${data._id}`);
      if (res.status !== 201) return ElMessage.error('删除失败');
      ElMessage({
        type: 'success',
        message: '删除成功',
      });
      friendList();
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消',
      })
    })
}

// 添加友联
const addSubmit = async () => {
  addFriendoRef.value.validate(async (valid) => {
    if (!valid) return ElMessage.error('请填写必要表单项');
    const res = await axios.post('/adminapi/friend/add', addFriendForm);
    if (res.status !== 201) return ElMessage.error('添加失败');
    addFriendoRef.value.resetFields();
    ElMessage.success('添加成功');
  })
}

onMounted(() => {
  friendList();
  getDemoInfo();
})
</script>