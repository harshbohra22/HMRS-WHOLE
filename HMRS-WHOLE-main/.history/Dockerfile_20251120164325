FROM eclipse-temurin:17-jdk

WORKDIR /app

COPY . .

# FIX: give execute permission to mvnw
RUN chmod +x mvnw

RUN ./mvnw -DskipTests clean package

CMD ["java", "-jar", "target/*.jar"]
