package com.rentit.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;

import java.util.Arrays;

@Configuration
public class CorsConfig {

    @Bean
    @ConditionalOnProperty(name = "app.cors.enabled", havingValue = "true", matchIfMissing = false)
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();

        // Allow frontend origin (React dev server) and API Gateway
        config.setAllowedOrigins(Arrays.asList(
                "http://localhost:5173", // Vite default port
                "http://localhost:3000", // Create React App default port
                "http://localhost:5174", // Alternative Vite port
                "http://localhost:8080"  // API Gateway during development
        ));

        // Allow all HTTP methods
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));

        // Allow all headers
        config.setAllowedHeaders(Arrays.asList("*"));

        // Allow credentials (cookies, authorization headers)
        config.setAllowCredentials(true);

        // How long the response from a pre-flight request can be cached (in seconds)
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        // NOTE: This bean is disabled by default via app.cors.enabled=false. The API Gateway handles CORS
        // to avoid duplicate Access-Control-Allow-Origin headers. Enable this service-level CORS only when
        // needed by setting app.cors.enabled=true in application.properties.
        return new CorsFilter(source);
    }
}
