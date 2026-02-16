package com.rentit;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.rentit.repositories")
@EnableDiscoveryClient

public class RentItCustomerServicesApplication {

	public static void main(String[] args) {
		SpringApplication.run(RentItCustomerServicesApplication.class, args);
		System.out.println("RentIt Customer Services started on port 9093");
	}

}
