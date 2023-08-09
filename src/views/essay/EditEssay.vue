<template>
  <div class="edit_essay">
    <!-- 面包屑区域 -->
    <div class="bread">
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item>文章管理</el-breadcrumb-item>
        <el-breadcrumb-item to="/essay">写文章</el-breadcrumb-item>
        <el-breadcrumb-item>编辑文章</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 表单区域 -->
    <div class="form" style="margin-top: 2em;">
      <el-form ref="essayAddRef" :model="essayAddForm" :rules="essayAddRules" label-width="120px" status-icon>
        <!-- 标题 -->
        <el-form-item label="标题" prop="title">
          <el-input v-model="essayAddForm.title" />
        </el-form-item>
        <!-- 简要 -->
        <el-form-item label="简要" prop="summary">
          <el-input v-model="essayAddForm.summary" :rows="3" type="textarea" />
        </el-form-item>
        <!-- 富文本编辑框 -->
        <el-form-item label="内容" prop="content">
          <Edit @event="handleChange" :content="essayAddForm.content" v-if="essayAddForm.content" />
        </el-form-item>
        <!-- 类别 -->
        <el-form-item label="类别" prop="category">
          <el-select v-model="essayAddForm.category" style="width: 100%;" placeholder="请选择类别">
            <el-option v-for="item in options" :key="item._id" :label="item.title" :value="item.href" />
          </el-select>
        </el-form-item>
        <!-- 封面 -->
        <el-form-item label="封面" prop="cover">
          <Upload :avatar="essayAddForm.cover" @avatarChange="uploadImg" />
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item>
          <el-button @click="submitFrom" type="primary">更新文章</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ArrowRight } from '@element-plus/icons-vue'
import { ref, reactive, onMounted } from 'vue'
import Edit from '@/components/editor/Editor.vue'
import { ElMessage } from 'element-plus'
// 图片上传封装组件
import Upload from '@/components/upload/Upload.vue'
// 图片上传封装方法
import upload from '@/http/service/upload.js'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const essayAddRef = ref();
let options = ref([]);
// 表单对象
const essayAddForm = reactive({
  title: '',
  content: '',
  category: '',
  summary: '',
  cover: '',
  file: ''
})

const getOptions = async () => {
  const res = await axios.get('/adminapi/category/list');
  if (res.status !== 201) return ElMessage.error('获取列表失败');
  options.value = res.data.data;
}

// 富文本编辑框处理事件
const handleChange = (data) => {
  if (data) return essayAddForm.content = data;
}


// 表单验证规则
const essayAddRules = reactive({
  title: [
    {
      required: true,
      message: '请输入标题',
      trigger: 'blur'
    },
    {
      min: 2,
      message: '不能少于两个字符',
      trigger: 'blur'
    }
  ],
  summary: [
    {
      required: true,
      message: '请输入简要',
      trigger: 'blur'
    }
  ],
  category: [
    {
      required: true,
      message: '请选择类别'
    }
  ]
})

// 图片上传change事件
const uploadImg = (file) => {
  // 对图片进行处理
  essayAddForm.cover = URL.createObjectURL(file)
  essayAddForm.file = file
}


// 监听提交事件
const submitFrom = async () => {
  essayAddRef.value.validate(async (valid) => {
    if (!valid) return ElMessage.error('请填写必要表单项');
    const res = await upload(`/adminapi/essay/list/${route.params.id}`, essayAddForm);
    if (res.status !== 201) return ElMessage.error('更新失败');
    ElMessage.success('更新成功');
    essayAddForm.file = '';
    router.push('/essay/list');
  })
}

onMounted(async () => {
  getOptions();
  const res = await axios.get(`/adminapi/essay/list/${route.params.id}`);
  if (res.status !== 201) return ElMessage.error('获取失败');
  Object.assign(essayAddForm, res.data.data[0])
})

</script>

<style lang="less" scoped>
.form {
  width: 55em;
}


// 封面上传样式
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
  width: 178px;
  height: 178px;
  display: block;
}
</style>