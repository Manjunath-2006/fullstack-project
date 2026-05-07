# Build stage: compile the Spring Boot application with Maven
FROM mcr.microsoft.com/maven:3.9.8-jdk-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn -B package -DskipTests

# Runtime stage: use a stable OpenJDK 17 runtime image
FROM mcr.microsoft.com/java/jdk:17
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
