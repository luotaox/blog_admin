<template>
  <div class="edit">

  </div>
</template>

<script setup>
import E from 'wangeditor'
import { onMounted, defineEmits, defineExpose, defineProps, reactive, ref } from 'vue'
import upload from '@/http/service/upload.js'
import { ElMessage } from 'element-plus';
const emit = defineEmits(['event'])
const props = defineProps({
  content: String
})

const close = () => {
  editor.txt.clear()
}

defineExpose({ close })//暴露子组件的方法或者数据
let url = ref('');

const uploadImg = async () => {
  const res = await upload('/adminapi/essay/img', uploadForm);
  if (res.status !== 201) return ElMessage.error('上传失败');
  return res.data.data.img;
}

let uploadForm = reactive({
  file: '',
  img: ''
})

onMounted(async () => {
  const editor = new E('.edit');
  editor.config.uploadImgMaxSize = 50 * 1024 * 1024;
  editor.config.customUploadImg = function (resultFiles, insertImgFn) {
    let img = window.URL.createObjectURL(new Blob(resultFiles));
    uploadForm.img = img;
    uploadForm.file = resultFiles[0];
    new Promise((resole, reject) => {
      let res = uploadImg();
      resole(res)
    }).then((res) => {
      let imgUrl = `http://8.130.52.196:3000/${res}`
      insertImgFn(imgUrl)
    })
  }
  editor.create();

  // 初始化数据
  props.content && editor.txt.html(props.content)
  // 配置 onchange 回调函数
  editor.config.onchange = function (newHtml) {
    emit('event', newHtml)

  };
})
</script>