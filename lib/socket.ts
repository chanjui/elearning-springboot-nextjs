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

    webSocketFactory: () => new SockJS("https://api.sistcloud.com/ws"), // SockJS 사용
    // webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
    reconnectDelay: 5000,
    onConnect: () => {
      console.log("WebSocket 연결됨")

      // 특정 채팅방만 구독
      const subscription = stompClient?.subscribe(`/topic/chat/${roomId}`, (message: IMessage) => {
        console.log("메시지 수신:", message);
        try {
          const body = JSON.parse(message.body)
          console.log("파싱된 메시지:", body);
          onMessage(body)
        } catch (error) {
          console.error("메시지 파싱 오류:", error);
        }
      })
      
      console.log("구독 정보:", subscription);

      if (onConnect) onConnect()
    },
    onStompError: (frame) => {
      console.error("STOMP 오류", frame)
    },
    onWebSocketError: (event) => {
      console.error("WebSocket 오류", event)
    },
    onWebSocketClose: (event) => {
      console.log("WebSocket 연결 종료", event)
    }
  })

  stompClient.activate()
}

export const sendChatMessage = (destination: string, payload: any) => {
  if (stompClient && stompClient.connected) {
    console.log("메시지 전송:", destination, payload);
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
