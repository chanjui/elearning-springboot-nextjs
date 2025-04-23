import { Client, IMessage } from "@stomp/stompjs"
import SockJS from "sockjs-client"

let stompClient: Client | null = null

export const connectSocket = (
  roomId: number,
  onMessage: (msg: any) => void,
  onConnect?: () => void
) => {
  stompClient = new Client({
    // webSocketFactory: () => new SockJS("http://192.168.35.75:8080/ws"), // SockJS 사용

    webSocketFactory: () => new SockJS("https://3.34.90.186/ws"), // SockJS 사용
    // webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
    reconnectDelay: 5000,
    onConnect: () => {
      console.log("WebSocket 연결됨")

      stompClient?.subscribe("/topic/chat", (message: IMessage) => {
        const body = JSON.parse(message.body)
        onMessage(body)
      })

      if (onConnect) onConnect()
    },
    onStompError: (frame) => {
      console.error("STOMP 오류", frame)
    },
  })

  stompClient.activate()
}

export const sendChatMessage = (destination: string, payload: any) => {
  if (stompClient && stompClient.connected) {
    stompClient.publish({
      destination,
      body: JSON.stringify(payload),
    })
  } else {
    console.warn("WebSocket이 아직 연결되지 않았습니다.")
  }
}

export const disconnectSocket = () => {
  if (stompClient) {
    stompClient.deactivate()
    console.log("🚪 WebSocket 연결 해제됨")
  }
}
