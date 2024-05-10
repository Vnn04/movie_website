FROM mysql:latest

# Thiết lập môi trường
ENV MYSQL_ROOT_PASSWORD=vnn04
ENV MYSQL_DATABASE=mlops
ENV MYSQL_USER=user
ENV MYSQL_PASSWORD=password
ENV MYSQL_ALLOW_EMPTY_PASSWORD=yes

# Copy file script.sql và file CSV vào container
COPY ./add_data.sql /docker-entrypoint-initdb.d/
COPY user.csv /var/lib/mysql-files/
COPY movie.csv /var/lib/mysql-files/
COPY rating.csv /var/lib/mysql-files/
COPY view.csv /var/lib/mysql-files/
COPY watch_trailer.csv /var/lib/mysql-files/


RUN echo "[mysqld]" > /etc/mysql/conf.d/disable_secure_file_priv_option.cnf \
    && echo "secure-file-priv=\"/var/lib/mysql-files\"" >> /etc/mysql/conf.d/disable_secure_file_priv_option.cnf
