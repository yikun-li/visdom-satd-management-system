FROM openjdk:11-jre-slim
COPY build/libs/backend-*.jar /backend.jar
RUN mkdir /gitrepos
ENV PORT 8080
EXPOSE 8080
ENTRYPOINT ["java", "-Dspring.profiles.active=docker", "-jar", "/backend.jar"]
