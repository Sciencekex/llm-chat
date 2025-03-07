// 主聊天界面组件：整合聊天消息显示和输入功能
<template>
  <!-- 聊天界面主容器 -->
  <div class="container">
    <!-- 聊天消息组件：用于显示消息历史记录 -->
    <chat-message ref="messageRef" />
    <!-- 底部输入组件：用于用户输入和发送消息 -->
    <chat-bottom />
    <ImageParse />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import ChatMessage from './ChatMessage.vue'
import ChatBottom from './ChatBottom.vue'
import { onSwitchChat, onDeleteChat, onRenameChat, removeListener } from '../utils/ListChatToMitter'
import { useSessionStore } from '../store/SessionStore'
import { useMessageStore } from '../store/MessageStore'
import ImageParse from "../components/ImageParse.vue";


// 初始化会话和消息状态管理
const sessionStore = useSessionStore()
const messageStore = useMessageStore()

// 组件引用：用于控制消息列表滚动
const messageRef = ref<{ scrollToBottom: () => void } | null>(null)

// 处理会话切换事件
const handleSwitchChat = (chatInfo: { sessionId: string; title: string }) => {
  // 切换到新会话并加载对应的消息记录
  sessionStore.switchSession(chatInfo.sessionId)
}

// 处理会话删除事件
const handleDeleteChat = (sessionId: string) => {
  if (sessionId === sessionStore.currentSessionId) {
    messageStore.clearMessages()
  }
}

// 处理会话重命名事件
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const handleRenameChat = (_chatInfo: { sessionId: string; newTitle: string }) => {
  // 不再需要更新标题
  // 使用下划线前缀表示有意不使用的参数
}

// 组件挂载时添加事件监听
onMounted(() => {
  onSwitchChat(handleSwitchChat)
  onDeleteChat(handleDeleteChat)
  onRenameChat(handleRenameChat)
})

// 组件卸载时移除事件监听
onUnmounted(() => {
  removeListener('switchChat')
  removeListener('deleteChat')
  removeListener('renameChat')
})
</script>

<style scoped>
/* 使用 @import 引入外部样式文件 */
@import '@/styles/chat.css';
</style>