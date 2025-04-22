FROM openjdk:17-jdk-slim

WORKDIR /app

# libs 디렉토리 복사
COPY libs/ /app/libs/

# 애플리케이션 JAR 파일 복사
COPY target/*.jar app.jar

# 애플리케이션 실행
ENTRYPOINT ["java", "-jar", "app.jar"] 