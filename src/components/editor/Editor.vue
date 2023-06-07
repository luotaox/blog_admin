<template>
  <div class="edit">

  </div>
</template>

<script setup>
import E from 'wangeditor'
import { onMounted, defineEmits, defineExpose, defineProps } from 'vue'

const emit = defineEmits(['event'])
const props = defineProps({
  content: String
})

const close = () => {
  editor.txt.clear()
}

defineExpose({ close })//暴露子组件的方法或者数据

onMounted(() => {
  const editor = new E('.edit');
  editor.create();

  // 初始化数据
  props.content && editor.txt.html(props.content)
  // 配置 onchange 回调函数
  editor.config.onchange = function (newHtml) {
    emit('event', newHtml)

  };
})
</script>