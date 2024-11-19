import type { Chat, ChatData } from '@renderer/database/chat'
import type { ExchangeUser } from '@renderer/database/user'
import { usePeerClientMethods } from '@renderer/client/use'
import { chatDatabase } from '@renderer/database/chat'
import { getClientUniqueId } from '@renderer/utils/id'
import { logger } from '@renderer/utils/logger'
import once from 'lodash/once'
import { useUser } from './user'

export const useChat = defineStore('app-chat', () => {
  const chats = ref<ChatData[]>([])
  const currentChatId = useStorage<string>('current-chat-id', '')

  const { registerHandler, connect, sendJson } = usePeerClientMethods()

  const user = useUser()

  async function init() {
    chats.value = await chatDatabase.getChats()
  }

  once(init)()

  const currentChat = computed(() => {
    return chats.value.find(chat => chat.id === currentChatId.value)
  })

  registerHandler('chat:create-private-chat', async (chat: Chat): Promise<boolean> => {
    logger.log('chat:create-private-chat')
    const newChat = await chatDatabase.createChatByCompleteInfo(chat)
    if (!newChat) {
      logger.error('passive create new chat failed')
      return false
    }
    chats.value.unshift(newChat)
    return true
  })

  async function createNewPrivateChat(userinfo: ExchangeUser) {
    const selfId = await getClientUniqueId()

    const newUser = await user.createUser(userinfo)

    if (!newUser) {
      return
    }

    const chat = await chatDatabase.createPrivateChatChat({
      title: newUser.name,
      participants: [newUser.id, selfId],
      owner: selfId,
      avatar: newUser.avatar,
    })

    if (!chat) {
      return
    }

    chats.value.unshift(chat)

    return chat
  }

  async function sendTextMessage(id: string, text: string) {
    const chat = chats.value.find(chat => chat.id === id)
    if (!chat) {
      logger.warn('Chat not found')
      return
    }

    const conn = await connect(id)

    const newMessage = await chatDatabase.createTextMessage({
      content: text,
      senderId: await getClientUniqueId(),
      receiverId: id,
      isLastMessage: false,
      chatId: chat.id,
    })

    return sendJson(conn, newMessage)
  }

  return {
    chats,
    currentChatId,
    createNewPrivateChat,
    currentChat,
    sendTextMessage,
  }
})
