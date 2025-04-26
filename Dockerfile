FROM openjdk:17-jdk-slim

WORKDIR /app

# Copy the application JAR
COPY target/*.jar app.jar

# Copy the libs directory
COPY target/libs/ /app/libs/

# Set the classpath to include the libs directory
ENV CLASSPATH=/app/libs/*

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"] 