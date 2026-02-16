package com.p20.rentit.repositories;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.p20.rentit.entities.Area;

public interface AreaRepository extends JpaRepository<Area, Integer>{
	List<Area> findByCityCityId(int cityId);
}
