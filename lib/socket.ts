// lib/socket.ts
import SockJS from "sockjs-client"
import Stomp from "stompjs"

let stompClient: Stomp.Client | null = null

export const connectSocket = (
  onMessage: (msg: any) => void,
  onConnect?: () => void
) => {
  const socket = new SockJS("http://localhost:8080/ws") // 백엔드 서버 주소
  stompClient = Stomp.over(socket)

  stompClient.connect({}, () => {
    console.log("WebSocket 연결 성공")

    // 메시지 구독 (채널명 예시: /topic/chat)
    stompClient?.subscribe("/topic/chat", (message) => {
      const body = JSON.parse(message.body)
      onMessage(body)
    })

    if (onConnect) onConnect()
  })
}

export const sendChatMessage = (destination: string, payload: any) => {
  if (stompClient && stompClient.connected) {
    stompClient.send(destination, {}, JSON.stringify(payload))
  } else {
    console.warn("WebSocket 연결이 아직 안 됐어요.")
  }
}

export const disconnectSocket = () => {
  if (stompClient) {
    stompClient.disconnect(() => {
      console.log("WebSocket 연결 해제")
    })
  }
}
