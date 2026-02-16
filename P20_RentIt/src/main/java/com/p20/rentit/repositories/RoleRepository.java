package com.p20.rentit.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.p20.rentit.entities.Role;

public interface RoleRepository extends JpaRepository<Role, Integer> {

}
