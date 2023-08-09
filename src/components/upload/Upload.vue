<template>
  <div class="upload">
    <el-upload class="avatar-uploader" action="" :show-file-list="false" :on-change="handleChange" :auto-upload="false">
      <img v-if="props.avatar" :src="uploadAvatar" class="avatar" />
      <el-icon v-else class="avatar-uploader-icon">
        <Plus />
      </el-icon>
    </el-upload>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue'
import { Plus } from '@element-plus/icons-vue'


const props = defineProps({
  avatar: String
})
const emit = defineEmits(["avatarChange"]);

// 上传成功后图片显示
const uploadAvatar = computed(() => {
  return props.avatar.includes('blob') ? props.avatar : 'http://8.130.52.196:3000' + props.avatar;
})

// 图片上传change事件
const handleChange = (file) => {
  emit('avatarChange', file.raw)
}
</script>