FROM mysql:latest
ENV MYSQL_ROOT_PASSWORD=my-secret-pw
EXPOSE 3306
#COPY ./database.sql /docker-entrypoint-initdb.d/
ADD ./database.sql /docker-entrypoint-initdb.d/