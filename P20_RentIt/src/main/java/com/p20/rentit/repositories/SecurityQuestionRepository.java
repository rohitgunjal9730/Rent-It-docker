package com.p20.rentit.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.p20.rentit.entities.SecurityQuestion;

public interface SecurityQuestionRepository extends JpaRepository<SecurityQuestion, Integer> {

}
