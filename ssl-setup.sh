#!/bin/bash

# Certbot 설치
sudo apt-get update
sudo apt-get install -y certbot python3-certbot-nginx

# SSL 인증서 발급
sudo certbot --nginx -d your-domain.com  # 도메인 이름을 변경하세요

# 자동 갱신 설정
echo "0 0 1 * * root certbot renew --quiet" | sudo tee -a /etc/crontab

echo "SSL 인증서 설정이 완료되었습니다." 