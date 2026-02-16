package com.p20.rentit.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.p20.rentit.entities.User;

public interface UserRepository extends JpaRepository<User, Integer> {

	Optional<User> findByEmail(String email);
	
}
