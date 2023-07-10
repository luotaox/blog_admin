<template>
  <div class="editproduct">
    <!-- 面包屑区域 -->
    <div class="bread">
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item>产品管理</el-breadcrumb-item>
        <el-breadcrumb-item to="/productlist">产品列表</el-breadcrumb-item>
        <el-breadcrumb-item>编辑产品</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 表单区域 -->
    <div class="product-form" style="margin-top: 2em;">
      <el-form ref="productAddRef" :model="productAddForm" :rules="productAddRules" label-width="120px" status-icon>
        <!-- 产品名称 -->
        <el-form-item label="产品名称" prop="title">
          <el-input v-model="productAddForm.title" />
        </el-form-item>
        <!-- 产品简要描述 -->
        <el-form-item label="产品简要描述" prop="introduction">
          <el-input v-model="productAddForm.introduction" type="textarea" placeholder="请填写产品简要描述 ~" :rows="3" />
        </el-form-item>
        <!-- 产品详细描述 -->
        <el-form-item label="产品详细描述" prop="detail">
          <el-input v-model="productAddForm.detail" type="textarea" placeholder="请填写产品详细描述 ~" :rows="8" />
        </el-form-item>
        <!-- 产品图片 -->
        <el-form-item label="产品图片" prop="cover">
          <Upload :avatar="productAddForm.cover" @avatarChange="handleChange" />
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item>
          <el-button @click="submitFrom" type="primary">更新产品</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ArrowRight } from '@element-plus/icons-vue'
import { ref, reactive, onMounted } from 'vue'
// 图片上传封装组件
import Upload from '@/components/upload/Upload.vue'
// 图片上传封装方法
import upload from '@/http/service/upload.js'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios';

const router = useRouter();
const route = useRoute();
const productAddRef = ref();
// 表单对象
const productAddForm = reactive({
  title: '',
  detail: '',
  introduction: '',
  cover: '',
  file: null,
})

// 表单验证规则
const productAddRules = reactive({
  title: [
    {
      required: true,
      message: '产品名称不能为空',
      trigger: 'blur'
    },
  ],
  detail: [
    {
      required: true,
      message: '产品详细描述不能为空',
      trigger: 'blur'
    }
  ],
  introduction: [
    {
      required: true,
      message: '产品简要描述不能为空',
      trigger: 'blur'
    }
  ],
  cover: [
    {
      required: true,
      message: '封面不能为空',
      trigger: 'blur'
    }
  ]
})


// 图片上传change事件
const handleChange = (file) => {
  // 对图片进行处理
  productAddForm.cover = URL.createObjectURL(file)
  productAddForm.file = file
}

// 点击提交事件
const submitFrom = () => {
  productAddRef.value.validate(async (valid) => {
    if (!valid) return ElMessage.error('请填写必要表单项');
    const res = await upload('/adminapi/product/list', productAddForm);
    if (res.status !== 201) return ElMessage.error('添加失败');
    // 重置
    router.push('/productlist')
    ElMessage.success('更新成功')
  })
}

onMounted(async () => {
  const res = await axios.get(`/adminapi/product/list/${route.params.id}`);
  if (res.status !== 201) return ElMessage.error('获取失败');
  Object.assign(productAddForm, res.data.data[0])
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