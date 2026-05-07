package com.edutrack.config;

import com.zaxxer.hikari.HikariDataSource;
import jakarta.sql.DataSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.env.Environment;

import java.net.URI;
import java.net.URISyntaxException;

@Configuration
public class DataSourceConfig {

    @Bean
    @Primary
    public DataSource dataSource(Environment env) throws URISyntaxException {
        String databaseUrl = env.getProperty("DATABASE_URL");
        if (databaseUrl == null || databaseUrl.isBlank()) {
            databaseUrl = env.getProperty("SPRING_DATASOURCE_URL");
        }
        if (databaseUrl == null || databaseUrl.isBlank()) {
            throw new IllegalStateException("DATABASE_URL or SPRING_DATASOURCE_URL must be configured.");
        }

        HikariDataSource dataSource = new HikariDataSource();
        dataSource.setDriverClassName("org.postgresql.Driver");
        dataSource.setMaximumPoolSize(10);

        if (databaseUrl.startsWith("postgres://")) {
            URI dbUri = new URI(databaseUrl);
            String[] userInfo = dbUri.getUserInfo().split(":");
            String username = userInfo[0];
            String password = userInfo[1];
            String jdbcUrl = String.format("jdbc:postgresql://%s:%d%s?sslmode=require", dbUri.getHost(), dbUri.getPort(), dbUri.getPath());
            dataSource.setJdbcUrl(jdbcUrl);
            dataSource.setUsername(username);
            dataSource.setPassword(password);
        } else {
            dataSource.setJdbcUrl(databaseUrl);
            String dbUser = env.getProperty("DB_USERNAME");
            String dbPassword = env.getProperty("DB_PASSWORD");
            if (dbUser != null) {
                dataSource.setUsername(dbUser);
            }
            if (dbPassword != null) {
                dataSource.setPassword(dbPassword);
            }
        }

        return dataSource;
    }
}