<template>
  <div class="siteinfo">
    <!-- 面包屑区域 -->
    <div class="bread">
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item>网站设置</el-breadcrumb-item>
        <el-breadcrumb-item>网站基本信息</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-tabs type="border-card" style="margin-top: 2em;">
      <!-- 社交信息 -->
      <el-tab-pane label="社交信息">
        <div>
          <el-card>
            <el-table :data="tableData" border height="700px">
              <!-- title -->
              <el-table-column prop="title" label="title" />
              <!-- address -->
              <el-table-column prop="href" label="跳转地址" />
              <!-- color -->
              <el-table-column prop="color" label="颜色" />
              <!-- 操作 -->
              <el-table-column label="操作">
                <template #default="scope">
                  <el-tooltip effect="light" content="编辑" placement="bottom" :enterable="false">
                    <el-button circle :icon="Edit" type="success" @click="userEdit(scope.row)"></el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </div>
      </el-tab-pane>
      <!-- 背景 -->
      <el-tab-pane label="网站背景">
        <Upload :avatar="editImg.img" @avatarChange="handleChange" />
        <el-divider />
        <el-button type="primary" @click="imgSubmit">
          确认修改
        </el-button>
      </el-tab-pane>
      <!-- 公告 -->
      <el-tab-pane label="公告">
        <div style="width: 50%;" class="notice">
          <el-input v-model="noticeForm.notice" :rows="3" type="textarea"></el-input>
          <el-divider />
          <el-button type="primary" @click="noticeSubmit">
            确认修改
          </el-button>
        </div>
      </el-tab-pane>
    </el-tabs>


    <!-- dialog对话框 -->
    <el-dialog v-model="editUserVisible" title="编辑社交信息" width="50%">
      <el-form :model="editForm" status-icon ref="editRef" label-width="120px">
        <!-- title -->
        <el-form-item label="title" prop="title">
          <el-input v-model="editForm.title" autocomplete="off" disabled />
        </el-form-item>
        <!-- address -->
        <el-form-item label="跳转地址" prop="href">
          <el-input v-model="editForm.href" />
        </el-form-item>
        <!-- color -->
        <el-form-item label="颜色" prop="color">
          <el-input v-model="editForm.color" />
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
import { ArrowRight, Edit } from '@element-plus/icons-vue'
import { ref, onMounted, reactive } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'
// 图片上传封装方法
import upload from '@/http/service/upload.js'
// 图片上传封装组件
import Upload from '@/components/upload/Upload.vue'
import { useStore } from 'vuex'

const store = useStore();
// table数据
let tableData = ref([]);

let editUserVisible = ref(false);

// 用户表单
let editForm = reactive({
  href: '',
  color: '',
  _id: ''
});


// 背景图片
let editImg = reactive({
  img: store.state.backGroundImg,
  file: ''
})

let noticeForm = reactive({
  notice: store.state.notice
})


// 获取社交信息
const getData = async () => {
  const res = await axios.get('/adminapi/site');
  if (res.status !== 201) return ElMessage.error('获取列表失败');
  tableData.value = res.data.data;
}

// 编辑社交信息
const userEdit = (data) => {
  Object.assign(editForm, data)
  editUserVisible.value = true;
}
// 社交信息提交
const editSubmit = async () => {
  const res = await axios.put('/adminapi/site/edit/', editForm);
  if (res.status !== 201) return ElMessage.error('修改失败');
  ElMessage.success('修改成功');
  editUserVisible.value = false;
  getData();
}

// 背景图片提交
const imgSubmit = async () => {
  const res = await upload('/adminapi/site/img', editImg);
  if (res.status !== 201) return ElMessage.error('修改失败');
  store.commit('changeImg', res.data.data.backgroundImg);
  ElMessage.success('修改成功');
}

// 公告提交
const noticeSubmit = async () => {
  const res = await axios.post('/adminapi/notice', noticeForm);
  if (res.status !== 201) return ElMessage.error('修改失败');
  store.commit('changeNotice', noticeForm.notice)
  ElMessage.success('修改成功');
}

const getNotice = async () => {
  const res = await axios.get('/adminapi/notice');

  store.commit('changeNotice', res.data.data[0].notice)
}

const close = () => {
  editUserVisible.value = false
  ElMessage.info('已取消')
}

// 图片上传change事件
const handleChange = (file) => {
  // 对图片进行处理
  editImg.img = URL.createObjectURL(file)
  editImg.file = file
}


onMounted(() => {
  getData();
  getNotice();
})
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
  width: 800px;
  height: 500px;
  display: block;
}

.notice {
  /deep/ .el-textarea__inner {
    border: 1px solid #49cd30;
  }

}
</style>