#!/bin/bash

# 시스템 업데이트
sudo apt-get update
sudo apt-get upgrade -y

# 도커 설치
sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io

# 도커 권한 설정
sudo usermod -aG docker ubuntu

# AWS CLI 설치
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
sudo apt-get install -y unzip
unzip awscliv2.zip
sudo ./aws/install

# 도커 자동 시작 설정
sudo systemctl enable docker
sudo systemctl start docker

# 도커 컨테이너 자동 재시작 설정
sudo mkdir -p /etc/systemd/system/docker.service.d
echo "[Service]
Restart=always" | sudo tee /etc/systemd/system/docker.service.d/override.conf
sudo systemctl daemon-reload
sudo systemctl restart docker

echo "EC2 인스턴스 설정이 완료되었습니다." 