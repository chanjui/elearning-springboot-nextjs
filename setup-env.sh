#!/bin/bash

# 환경 변수 설정
cat << EOF > /home/ubuntu/.env
AWS_REGION=ap-northeast-2
ECR_REGISTRY=YOUR_ECR_REGISTRY
IMAGE_TAG=latest
AWS_ACCESS_KEY_ID=AKIASVLKCESEYRYMVMNG
AWS_SECRET_ACCESS_KEY=yIyT3IBntqnm1ArjFb9UTD2yuXEfxvlcERO9dU3M
JWT_ADMIN_SECRET=your-admin-secret-key
JWT_USER_SECRET=your-user-secret-key
SPRING_DATASOURCE_URL=jdbc:mysql://43.201.111.220:3306/elearning?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true&readOnly=false
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=gj1111
EOF

# 환경 변수 파일 권한 설정
chmod 600 /home/ubuntu/.env

echo "환경 변수 설정이 완료되었습니다." 