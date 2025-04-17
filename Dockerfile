FROM openjdk:17-jdk-slim

WORKDIR /app

# 애플리케이션 JAR 파일 복사
COPY target/*.jar app.jar

# 애플리케이션 실행
ENTRYPOINT ["java", "-jar", "app.jar"] 