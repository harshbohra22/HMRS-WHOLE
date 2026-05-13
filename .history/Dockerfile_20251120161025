FROM eclipse-temurin:17-jdk

WORKDIR /app

COPY . .

RUN ./mvnw -DskipTests clean package

CMD ["java", "-jar", "target/*.jar"]
