import { defineStore } from 'pinia'
import { ref } from 'vue'
import { sendStreamMessage, processStream, type StreamResponseChunk } from '../services/chat'
import { useCreateMessageStore } from './CreateMessageStore'

// 定义并导出聊天输入状态管理store
export const useChatBottomStore = defineStore('chatBottom', () => {
  // 状态定义
  const inputText = ref('') // 输入框文本
  const messageRef = ref<{ usageData: StreamResponseChunk['usage'] | null }>({ usageData: null }) // 消息引用

  // 设置输入文本
  const setInputText = (text: string) => {
    inputText.value = text
  }

  // 清空输入文本
  const clearInputText = () => {
    inputText.value = ''
  }
  // 发送消息处理函数
  const sendMessage = async (messageHistory: any[], addMessage: Function, setLoading: Function, onScroll: Function) => {
    const message = inputText.value.trim()
    if (!message) return

    setLoading(true)
    clearInputText()

    // 导入创建会话store
    const createMessageStore = useCreateMessageStore()
    
    try {
      // 如果是首次发送消息（没有当前会话），先创建新会话
      if (!createMessageStore.currentSessionId) {
        createMessageStore.createNewSession(message)
        // 等待状态更新完成
        await new Promise(resolve => setTimeout(resolve, 1000))
      }

      // 添加用户消息并等待DOM更新
      addMessage({
        role: 'user',
        content: message
      })
      await new Promise(resolve => setTimeout(resolve, 100))

      // 设置加载状态并添加AI消息
      setLoading(true)
      addMessage({
        role: 'assistant',
        content: ''
      })

      // 发送消息并获取流式响应
      const stream = await sendStreamMessage(messageHistory.slice(0, -1))
      if (stream) {
        await processStream(
          stream,
          (content) => {
            // 更新最后一条消息内容
            const lastMessage = messageHistory[messageHistory.length - 1]
            if (lastMessage) {
              lastMessage.content = content
            }
          },
          (usage) => {
            // 更新使用统计数据
            messageRef.value.usageData = usage
          }
        )
      }
      onScroll() // 触发滚动事件
    } catch (error) {
      console.error('发送消息失败:', error)
      // 移除空的AI消息
      messageHistory.pop()
      // 错误处理：显示错误提示消息
      addMessage({
        role: 'assistant',
        content: '请求失败，请稍后再试'
      })
    } finally {
      setLoading(false)
    }
  }
  return {
    inputText,
    messageRef,
    setInputText,
    clearInputText,
    sendMessage
  }
})