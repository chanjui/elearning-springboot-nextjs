#!/bin/bash

# Nginx 설치
sudo apt-get update
sudo apt-get install -y nginx

# Nginx 설정
sudo tee /etc/nginx/sites-available/elearning-app << EOF
server {
    listen 80;
    server_name your-domain.com;  # 도메인 이름을 변경하세요

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# 심볼릭 링크 생성
sudo ln -s /etc/nginx/sites-available/elearning-app /etc/nginx/sites-enabled/

# Nginx 설정 테스트
sudo nginx -t

# Nginx 재시작
sudo systemctl restart nginx

echo "Nginx 설정이 완료되었습니다." 