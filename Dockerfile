FROM openjdk:17-jdk-slim

WORKDIR /app

# Copy the application JAR
COPY target/*.jar app.jar

# Copy the libs directory
COPY libs/ /app/libs/

# Run the application with the libs directory in the classpath
ENTRYPOINT ["java", "-Dloader.path=/app/libs/", "-jar", "app.jar"] 