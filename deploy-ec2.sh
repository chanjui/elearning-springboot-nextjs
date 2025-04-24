#!/bin/bash

# AWS ECR 로그인
aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY}

# 기존 컨테이너 중지 및 제거
docker stop elearning-backend || true
docker rm elearning-backend || true

# 최신 이미지 가져오기
docker pull ${ECR_REGISTRY}/elearning-backend:${IMAGE_TAG}

# 새 컨테이너 실행
docker run -d --name elearning-backend \
  -p 8080:8080 \
  -e SPRING_DATASOURCE_URL=jdbc:mysql://43.201.111.220:3306/elearning?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true&readOnly=false \
  -e SPRING_DATASOURCE_USERNAME=root \
  -e SPRING_DATASOURCE_PASSWORD=gj1111 \
  -e SPRING_JPA_HIBERNATE_DDL_AUTO=update \
  -e SPRING_PROFILES_ACTIVE=prod \
  -e CLOUD_AWS_CREDENTIALS_ACCESS_KEY=${AWS_ACCESS_KEY_ID} \
  -e CLOUD_AWS_CREDENTIALS_SECRET_KEY=${AWS_SECRET_ACCESS_KEY} \
  -e CLOUD_AWS_REGION_STATIC=ap-northeast-2 \
  -e CLOUD_AWS_S3_BUCKET=my-home-shoppingmall-bucket \
  -e CUSTOM_JWT_SECRETKEY=q0wkldsfskldfje93k3l2kdfjalxkdfj34ldk12093dfkalkdfj \
  -e CUSTOM_JWT_TOKEN_VALIDITY_IN_SECONDS=1800 \
  -e CUSTOM_JWT_ADMIN_SECRET=${JWT_ADMIN_SECRET} \
  -e CUSTOM_JWT_USER_SECRET=${JWT_USER_SECRET} \
  -e SPRING_MAIL_HOST=smtp.gmail.com \
  -e SPRING_MAIL_PORT=587 \
  -e SPRING_MAIL_USERNAME=elearning0326@gmail.com \
  -e SPRING_MAIL_PASSWORD=yeocyrtaeyhblglt \
  -e RESET_BASE_URL=http://localhost:3000/auth/forgot-password \
  -e EMAIL_AUTH_CODE_EXPIRATION_TIME=180000 \
  -e EMAIL_AUTH_CODE_SEND_LIMIT=10 \
  -e EMAIL_AUTH_CODE_SEND_LIMIT_WINDOW=3600000 \
  -e NAVER_MAIL_HOST=smtp.naver.com \
  -e NAVER_MAIL_PORT=465 \
  -e NAVER_MAIL_USERNAME=knh1721@naver.com \
  -e NAVER_MAIL_PASSWORD=RPPSPK9D13YL \
  -e IAMPORT_APIKEY=1071808156831361 \
  -e IAMPORT_APISECRET=RVHf64jJyYhQq0rajK61ZJmFlJRyBUNljUafCrJFOs9w66uKvLjKgBU46Tc8vwbmUNIKYHdjVFVRmWbn \
  -e IAMPORT_MID=INIpayTest \
  -e IAMPORT_RETURNURL=https://abcdefgh.ngrok.io/api/payment/result \
  -e FRONTEND_URL=http://localhost:3000 \
  -e OAUTH_KAKAO_CLIENT_ID=e3aecedb65b63e1fac9d777cd66fb3e1 \
  -e OAUTH_KAKAO_CLIENT_SECRET=ftICfRArx3LAj0GOLOO7jqOzyLiF7OwK \
  -e OAUTH_KAKAO_REDIRECT_URI=http://localhost:3000/auth/auth/kakao-callback \
  -e OAUTH_GOOGLE_CLIENT_ID=617172854156-b05pg0gp7ktjl08lcil6svh8bj87dnvl.apps.googleusercontent.com \
  -e OAUTH_GOOGLE_CLIENT_SECRET=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 \
  -e OAUTH_GOOGLE_REDIRECT_URI=http://localhost:3000/auth/auth/google-callback \
  -e OAUTH_GITHUB_CLIENT_ID=Ov23lihKiKICvlydhVsj \
  -e OAUTH_GITHUB_CLIENT_SECRET=bf755cae913574910ab166476bccaa9884399582 \
  -e OAUTH_GITHUB_REDIRECT_URI=http://localhost:3000/auth/auth/github-callback \
  -e COOLSMS_API_KEY=NCSZWG45BBQAFWFV \
  -e COOLSMS_API_SECRET=UTFXT1NPIX07N21HGNWIL9RYPNOPKNBN \
  ${ECR_REGISTRY}/elearning-backend:${IMAGE_TAG}

echo "배포가 완료되었습니다." 