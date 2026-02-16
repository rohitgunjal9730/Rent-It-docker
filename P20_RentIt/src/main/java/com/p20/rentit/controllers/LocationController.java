package com.p20.rentit.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.p20.rentit.entities.Area;
import com.p20.rentit.entities.City;
import com.p20.rentit.services.LocationService;

@RestController
@RequestMapping("/auth/location")
//@CrossOrigin(origins = "http://localhost:5173/")
public class LocationController {
	
	@Autowired
	private LocationService locationService;
	
	// get all city 
	@GetMapping("/cities")
	public List<City> getAllCities(){
		return locationService.getAllCities();
	}
	
	// get areas by city id
	@GetMapping("/areas/{cityId}")
	public List<Area> getAllAreas(@PathVariable int cityId){
		return locationService.getAllAreas(cityId);
	}
	
	
	

}
