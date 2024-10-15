package com.example.demo.configs;

import javax.sql.DataSource;

import org.flywaydb.core.Flyway;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FlywayConfig {
    @Autowired
    DataSource dataSource;

    @Bean(initMethod = "migrate")
    Flyway flyway() {
        Flyway flyway = Flyway.configure()
                .dataSource(dataSource)
                .locations("classpath:db/migration")
                .outOfOrder(true) // Enable out of order migrations
                .load();

        return flyway;
    }
}
