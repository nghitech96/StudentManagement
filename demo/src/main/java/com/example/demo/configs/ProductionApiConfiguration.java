package com.example.demo.configs;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@Profile("production")
public class ProductionApiConfiguration implements WebMvcConfigurer {

    private final DraftRateLimitInterceptor draftRateLimitInterceptor;

    public ProductionApiConfiguration(DraftRateLimitInterceptor draftRateLimitInterceptor) {
        this.draftRateLimitInterceptor = draftRateLimitInterceptor;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(draftRateLimitInterceptor)
                .addPathPatterns("/api/drafts");
    }
}
