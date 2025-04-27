import { Client, IMessage } from "@stomp/stompjs"
import SockJS from "sockjs-client"

let stompClient: Client | null = null

export const connectSocket = (
   roomId: number,
  onMessage: (msg: any) => void,
  onConnect?: () => void
) => {
  // 이미 연결된 경우 기존 연결 해제
  if (stompClient?.connected) {
    disconnectSocket()
  }

  stompClient = new Client({
    // webSocketFactory: () => new SockJS("http://192.168.0.7:8080/ws"), // SockJS 사용

    webSocketFactory: () => new SockJS("https://api.sistcloud.com/ws"), // SockJS 사용
    // webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
    onConnect: () => {
      console.log("WebSocket 연결됨")

      // 특정 채팅방만 구독
    //   const subscription = stompClient?.subscribe(`/topic/chat/${roomId}`, (message: IMessage) => {
    //     console.log("메시지 수신:", message);
    //     try {
    //       const body = JSON.parse(message.body)
    //       console.log("파싱된 메시지:", body);
    //       onMessage(body)
    //     } catch (error) {
    //       console.error("메시지 파싱 오류:", error);
    //     }
    //   })
    //
    //   console.log("구독 정보:", subscription);
    //
    //   if (onConnect) onConnect()
    // },
      stompClient?.subscribe(`/topic/chat/${roomId}`, (message: IMessage) => {
        console.log("roomId}", roomId)
        const body = JSON.parse(message.body)
        onMessage(body)
      })


      if (onConnect) onConnect()
    },
    onStompError: (frame) => {
      console.error("STOMP 오류", frame)
      // 자동 재연결 시도
      setTimeout(() => {
        if (!stompClient?.connected) {
          console.log("WebSocket 재연결 시도...")
          stompClient?.activate()
        }
      }, 5000)
    },
    onWebSocketError: (event) => {
      console.error("WebSocket 오류", event)
    },
    onWebSocketClose: (event) => {
      console.log("WebSocket 연결 종료", event)
      // 연결 종료 시 자동 재연결
      if (!event.wasClean) {
        setTimeout(() => {
          if (!stompClient?.connected) {
            console.log("WebSocket 재연결 시도...")
            stompClient?.activate()
          }
        }, 5000)
      }
    }
  })

  try {
    stompClient.activate()
  } catch (error) {
    console.error("WebSocket 연결 실패:", error)
  }
}

export const sendChatMessage = (destination: string, payload: any) => {
  if (!stompClient?.connected) {
    console.warn("WebSocket이 연결되지 않았습니다. 재연결을 시도합니다.")
    // 연결이 끊어졌을 때 재연결 시도
    if (stompClient) {
      try {
        stompClient.activate()
      } catch (error) {
        console.error("WebSocket 재연결 실패:", error)
      }
    }
    return
  }

  try {
    console.log("메시지 전송:", destination, payload)
    stompClient.publish({
      destination,
      body: JSON.stringify(payload),
    })
  } catch (error) {
    console.error("메시지 전송 실패:", error)
  }
}

export const disconnectSocket = () => {
  if (stompClient) {
    try {
      stompClient.deactivate()
      console.log("🚪 WebSocket 연결 해제됨")
    } catch (error) {
      console.error("WebSocket 연결 해제 실패:", error)
    }
  }
}
