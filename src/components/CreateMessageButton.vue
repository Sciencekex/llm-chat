// 新建会话确认按钮组件：负责确认创建新会话的操作
<template>
  <!-- 确认按钮容器，仅在创建新会话状态显示 -->
  <div v-if="isCreatingNewSession" class="create-message-button">
    <!-- 确认按钮：点击时触发确认创建事件 -->
    <button class="confirm-button" @click="handleConfirm">
      <span>确认</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useCreateMessageStore } from '../store/CreateMessageStore'

// 初始化状态管理store
const store = useCreateMessageStore()
// 从store中获取创建状态
const { isCreatingNewSession } = storeToRefs(store)

// 定义组件props，接收确认回调函数
const props = defineProps<{
  onConfirm: () => void
}>()

// 处理确认按钮点击事件
// 调用父组件传入的确认回调函数，并重置创建状态
const handleConfirm = () => {
  props.onConfirm()
  store.setCreatingNewSession(false)
}
</script>

<style scoped>

@import '@/styles/CreateMessageButton.css';

</style>