FROM maven:3.9-eclipse-temurin-25 AS build

WORKDIR /workspace
COPY demo/pom.xml ./pom.xml
COPY demo/src ./src
RUN mvn -B package -DskipTests

FROM eclipse-temurin:25-jre

WORKDIR /app
COPY --from=build /workspace/target/*.jar ./app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75.0", "-jar", "/app/app.jar"]
