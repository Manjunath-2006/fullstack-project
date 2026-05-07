# Use Eclipse Temurin JDK 17 as base image
FROM eclipse-temurin:17-jdk-slim

# Set working directory
WORKDIR /app

# Copy the JAR file
COPY target/*.jar app.jar

# Expose port 8080
EXPOSE 8080

# Run the application
CMD ["java", "-jar", "app.jar"]