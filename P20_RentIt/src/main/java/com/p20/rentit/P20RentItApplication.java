package com.p20.rentit;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
@EnableDiscoveryClient
public class P20RentItApplication {

	public static void main(String[] args) {
		SpringApplication.run(P20RentItApplication.class, args);
		System.out.println("RentIt Authentication Services started on port 9090");
	}

	@Bean
	public org.springframework.web.client.RestTemplate restTemplate() {
		return new org.springframework.web.client.RestTemplate();
	}

}
