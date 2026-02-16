package com.rentit.config;

import java.util.Arrays;
import com.rentit.filter.AuthenticationFilter;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

@Configuration
public class RouterConfig {

        @Bean
        public RouteLocator createRoutes(RouteLocatorBuilder builder, AuthenticationFilter authFilter) {
                return builder.routes()

                                // 🔓 Auth Service (PUBLIC)
                                .route("auth-service", r -> r
                                                .path("/auth/**")
                                                .uri("http://auth-service:9090"))

                                // 👨‍💼 Admin (.NET)
                                .route("admin-service", r -> r
                                                .path("/admin/**")
                                                .filters(f -> f.filter(
                                                                authFilter.apply(c -> c.setRole("ADMIN"))))
                                                .uri("http://admin-service:9091"))

                                // 🚗 Owner (.NET)
                                .route("owner-service", r -> r
                                                .path("/owner/**")
                                                .filters(f -> f.filter(
                                                                authFilter.apply(c -> c.setRole("OWNER"))))
                                                .uri("http://owner-service:9092"))

                                // 👤 Customer (Spring)
                                .route("customer-service", r -> r
                                                .path("/customer/**")
                                                .filters(f -> f.filter(
                                                                authFilter.apply(c -> c.setRole("CUSTOMER"))))
                                                .uri("http://customer-service:9093"))

                                .build();
        }

        @Bean
        public CorsWebFilter corsWebFilter() {
                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

                CorsConfiguration config = new CorsConfiguration();
                config.setAllowedOriginPatterns(Arrays.asList("*")); // ✅ Use Patterns instead of Origins
                config.setAllowedMethods(
                                Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                config.setAllowedHeaders(
                                Arrays.asList("Authorization", "Content-Type"));
                config.setExposedHeaders(Arrays.asList("Authorization"));
                config.setAllowCredentials(true);

                source.registerCorsConfiguration("/**", config);
                return new CorsWebFilter(source);
        }
}
