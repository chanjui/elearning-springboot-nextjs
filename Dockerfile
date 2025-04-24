FROM openjdk:17-jdk-slim

WORKDIR /app

# libs 디렉토리 복사
COPY libs/ /app/libs/

# 애플리케이션 JAR 파일 복사
COPY target/*.jar app.jar

# 애플리케이션 실행 (classpath에 libs 디렉토리 추가)
ENTRYPOINT ["java", "-Dloader.path=/app/libs/", "-jar", "app.jar"] 