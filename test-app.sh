#!/bin/bash

# 애플리케이션 상태 확인
echo "애플리케이션 상태 확인 중..."
sleep 10  # 애플리케이션이 완전히 시작될 때까지 대기

# HTTP 상태 코드 확인
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/actuator/health)

if [ "$HTTP_STATUS" -eq 200 ]; then
  echo "애플리케이션이 정상적으로 실행 중입니다."
  exit 0
else
  echo "애플리케이션 실행에 문제가 있습니다. HTTP 상태 코드: $HTTP_STATUS"
  exit 1
fi 