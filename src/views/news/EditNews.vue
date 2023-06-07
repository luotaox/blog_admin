<template>
  <div class="editnews">
    <!-- 面包屑区域 -->
    <div class="bread">
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item>编辑管理</el-breadcrumb-item>
        <el-breadcrumb-item to="/newslist">新闻列表</el-breadcrumb-item>
        <el-breadcrumb-item>编辑新闻</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 表单区域 -->
    <div class="form" style="margin-top: 2em;">
      <el-form ref="newsAddRef" :model="newsAddForm" :rules="newsRules" label-width="120px" status-icon>
        <!-- 标题 -->
        <el-form-item label="标题" prop="title">
          <el-input v-model="newsAddForm.title" />
        </el-form-item>
        <!-- 富文本编辑框 -->
        <el-form-item label="内容" prop="content">
          <Edit @event="handleChange" :content="newsAddForm.content" v-if="newsAddForm.content" />
        </el-form-item>
        <!-- 类别 -->
        <el-form-item label="类别" prop="category">
          <el-select v-model="newsAddForm.category" style="width: 100%;" placeholder="请选择类别">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <!-- 封面 -->
        <el-form-item label="封面" prop="cover">
          <Upload :avatar="newsAddForm.cover" @avatarChange="uploadImg" />
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item>
          <el-button @click="submitFrom" type="primary">更新新闻</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ArrowRight } from '@element-plus/icons-vue'
import { ref, reactive, onMounted } from 'vue'
import Edit from '@/components/editor/Editor.vue'
// 图片上传封装组件
import Upload from '@/components/upload/Upload.vue'
// 图片上传封装方法
import upload from '@/http/service/upload.js'
import { useRoute } from 'vue-router'
import axios from 'axios';
import router from '@/router'

const route = useRoute();
const newsAddRef = ref();
// 表单对象
const newsAddForm = reactive({
  title: '',
  content: '',
  category: 1, //1 最新发布 2 典型案例 3 通知公告
  cover: '',
  file: null,
  isPublish: 0 //0未发布 1已发布
})

// 富文本编辑框处理事件
const handleChange = (data) => {
  if (data) return newsAddForm.content = data;
}

// 类别数组
const options = [
  {
    label: '最新发布',
    value: 1
  },
  {
    label: '典型案例',
    value: 2
  },
  {
    label: '通知公告',
    value: 3
  }
]

// 表单验证规则
const newsRules = reactive({
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
  content: [
    {
      required: true,
      message: '请输入内容',
      trigger: 'blur'
    }
  ],
  category: [
    {
      required: true,
      message: '请选择类别'
    }
  ],
  cover: [
    {
      required: true,
      message: '请上传图片',
      trigger: 'chenge'
    }
  ]
})

// 图片上传change事件
const uploadImg = (file) => {
  // 对图片进行处理
  newsAddForm.cover = URL.createObjectURL(file)
  newsAddForm.file = file
}

// 监听提交事件
const submitFrom = async () => {
  newsAddRef.value.validate(async (valid) => {
    if (!valid) return ElMessage.error('请填写必要表单项');
    const res = await upload('/adminapi/news/list', newsAddForm);
    if (res.status !== 201) return ElMessage.error('更新失败');
    ElMessage.success('更新成功')
    router.back()
  })
}

onMounted(async () => {
  const res = await axios.get(`/adminapi/news/list/${route.params.id}`);
  if (res.status !== 201) return ElMessage.error('获取失败');
  Object.assign(newsAddForm, res.data.data[0])
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