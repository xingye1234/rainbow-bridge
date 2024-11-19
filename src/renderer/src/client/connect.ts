import type { Message } from '@renderer/database/message'
import type { ClientEvent } from './event'
import type { JsonData, JsonMessage } from './type'
import { Manager } from './manager'

export class Connect extends Manager {
  constructor(e: ClientEvent) {
    super(e)
    this.event.on('peer:json', this.onMessageData)
  }

  onMessageData(jsonData: JsonData) {
    const data = jsonData.data

    if (!('type' in data) || !['message', 'message-state'].includes(data.type)) {
      return
    }

    if (data.type === 'message') {
      this.event.emit('chat:message', data.message)
    }

    if (data.type === 'message-state') {
      this.event.emit('chat:message-state', data)
    }
  }

  async sendMessageData(id: string, message: JsonMessage) {
    const conn = await this.lazyConnect(id)
    await this.sendJson(conn, message)
  }

  async sendMessage(id: string, message: Message) {
    await this.sendMessageData(id, {
      type: 'message',
      message,
    })
  }
}
