package com.rentit.controllers;

import com.rentit.dto.CustomerProfileDto;
import com.rentit.dto.UpdateCustomerProfileRequest;
import com.rentit.entities.Area;
import com.rentit.entities.User;
import com.rentit.repositories.AreaRepository;
import com.rentit.repositories.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/customer/profile")
public class CustomerProfileController {

    private final UserRepository userRepository;
    private final AreaRepository areaRepository;

    public CustomerProfileController(UserRepository userRepository, AreaRepository areaRepository) {
        this.userRepository = userRepository;
        this.areaRepository = areaRepository;
    }

    // GET /customer/profile/{userId}
    @GetMapping("/{userId}")
    public ResponseEntity<?> getProfile(@PathVariable int userId) {
        Optional<User> opt = userRepository.findById(userId);
        if (opt.isEmpty())
            return ResponseEntity.notFound().build();

        User u = opt.get();
        CustomerProfileDto dto = mapToDto(u);
        return ResponseEntity.ok(dto);
    }

    // PUT /customer/profile/{userId}
    @PutMapping("/{userId}")
    public ResponseEntity<?> updateProfile(@PathVariable int userId, @RequestBody UpdateCustomerProfileRequest req) {
        Optional<User> opt = userRepository.findById(userId);
        if (opt.isEmpty())
            return ResponseEntity.notFound().build();

        User u = opt.get();

        // Only allow updating phone, area and address
        if (req.getPhone() != null) {
            u.setPhone(req.getPhone());
        }
        if (req.getAddress() != null) {
            u.setAddress(req.getAddress());
        }
        if (req.getAreaId() != null) {
            Optional<Area> areaOpt = areaRepository.findById(req.getAreaId());
            if (areaOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Invalid area id");
            }
            u.setArea(areaOpt.get());
        }

        userRepository.save(u);
        return ResponseEntity.ok(mapToDto(u));
    }

    private CustomerProfileDto mapToDto(User u) {
        CustomerProfileDto dto = new CustomerProfileDto();
        dto.setUserId(u.getUserId());
        dto.setFname(u.getFname());
        dto.setMname(u.getMname());
        dto.setLname(u.getLname());
        dto.setPhone(u.getPhone());
        dto.setEmail(u.getEmail());
        dto.setDrivingLicenceNo(u.getDrivingLicenceNo());
        dto.setAdharNo(u.getAdharNo());
        dto.setPanNo(u.getPanNo());
        dto.setAddress(u.getAddress());
        if (u.getArea() != null) {
            dto.setAreaId(u.getArea().getAreaId());
            dto.setAreaName(u.getArea().getAreaName());
            if (u.getArea().getCity() != null) {
                dto.setCityId(u.getArea().getCity().getCityId());
                dto.setCityName(u.getArea().getCity().getCityName());
            }
        }
        if (u.getApprovalStatus() != null) {
            dto.setApprovalStatus(u.getApprovalStatus().name());
        }
        return dto;
    }
}