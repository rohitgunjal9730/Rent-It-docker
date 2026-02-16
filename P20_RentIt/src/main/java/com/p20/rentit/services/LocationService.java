package com.p20.rentit.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.p20.rentit.entities.Area;
import com.p20.rentit.entities.City;
import com.p20.rentit.repositories.AreaRepository;
import com.p20.rentit.repositories.CityRepository;

@Service
public class LocationService {
	
	@Autowired
	private CityRepository cityRepository;
	
	@Autowired
	private AreaRepository areaRepository;
	
	
	// Get all city
	public List<City> getAllCities(){
		return cityRepository.findAll();
	}
	
	// Get all area
	public List<Area> getAllAreas(int cityId){
		return areaRepository.findByCityCityId(cityId);
	}
	
	
	
}
