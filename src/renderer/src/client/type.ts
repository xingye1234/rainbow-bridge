import type { ClientEvent } from '@renderer/client/event'
import type { Identity } from '@renderer/database/identit'
import type { BufferFile } from '@renderer/utils/ky'
import type Peer from 'peerjs'
import type { DataConnection, PeerError, PeerErrorType } from 'peerjs'
import type { Reactive, Ref } from 'vue'
import type { DataType } from './enums'

export type ClientProviderState = Reactive<{
  id: Ref<string | undefined>
  client: Ref<Peer | undefined>
  event: ClientEvent
  connecting: Ref<boolean>
  connected: Ref<boolean>
  connectError: Ref<boolean>
  peerId: Ref<string | undefined>
  retryCount: Ref<number>
  connectionIds: Ref<string[] | null>
}>

export interface ClientProviderMethods {
  destroy: () => void
  getServerConnections: () => Promise<string[]>
  hasServerConnection: (id: string) => Promise<boolean>
  searchFriend: (id: string) => Promise<string | undefined>
  getClient: () => Peer
  tryGetClient: () => Peer | undefined
  connectClient: (id: string, needDecrypt?: boolean) => Promise<DataConnection | undefined>
}

export type ClientError = PeerError<`${PeerErrorType}`>
export type OpponentError = PeerError<'not-open-yet' | 'message-too-big' | 'negotiation-failed' | 'connection-closed'>

export interface Metadata {
  id: string
  info: Pick<Identity, 'uuid' | 'email' | 'name'> & {
    avatar: BufferFile
  }
}

export interface CommonData {
  id: string
  timestamp: number
  reply?: string
}

export type JsonData = CommonData & {
  type: DataType.JSON
  data: any
}

export type BinaryData = CommonData & {
  type: DataType.BINARY
  data: ArrayBuffer
}

export type Data = JsonData | BinaryData
