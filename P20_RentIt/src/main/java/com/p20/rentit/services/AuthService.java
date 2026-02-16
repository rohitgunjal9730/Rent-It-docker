package com.p20.rentit.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.p20.rentit.dto.RegisterRequest;
import com.p20.rentit.entities.Area;
import com.p20.rentit.entities.Role;
import com.p20.rentit.entities.SecurityQuestion;
import com.p20.rentit.entities.User;
import com.p20.rentit.repositories.AreaRepository;
import com.p20.rentit.repositories.RoleRepository;
import com.p20.rentit.repositories.SecurityQuestionRepository;
import com.p20.rentit.repositories.UserRepository;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private AreaRepository areaRepository;

    @Autowired
    private SecurityQuestionRepository securityQuestionRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // ---------- LOGIN ----------
    public User login(String email, String password) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        System.out.println("RAW PASSWORD (input) = [" + password + "]");
        System.out.println("DB PASSWORD (stored) = [" + user.getPassword() + "]");

        boolean match = passwordEncoder.matches(password, user.getPassword());
        System.out.println("PASSWORD MATCH = " + match);
        System.out.println(new BCryptPasswordEncoder().encode("Rohit@1234"));

        if (!match) {
            throw new RuntimeException("Invalid password");
        }

        return user;
    }

    // ---------- REGISTER ----------
    public User register(RegisterRequest request) {

        // Check email already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        // Fetch role
        Role role = roleRepository.findById(request.getRoleId())
                .orElseThrow(() -> new RuntimeException("Role Not Found"));

        Area area = areaRepository.findById(request.getAreaId())
                .orElseThrow(() -> new RuntimeException("Area Not Found"));

        SecurityQuestion securityQuestion = securityQuestionRepository.findById(request.getQuestionId())
                .orElseThrow(() -> new RuntimeException("Question Not Found"));

        // Create User object
        User user = new User();
        user.setFname(request.getFname());
        user.setMname(request.getMname());
        user.setLname(request.getLname());
        user.setEmail(request.getEmail());
        user.setRole(role);

        user.setPhone(request.getPhone());
        user.setDrivingLicenceNo(request.getDrivingLicenceNo());
        user.setAdharNo(request.getAdharNo());
        user.setPanNo(request.getPanNo());
        user.setAddress(request.getAddress());
        user.setArea(area);
        user.setSecurityQuestion(securityQuestion);
        user.setAnswer(
                passwordEncoder.encode(
                        request.getAnswer().trim().toLowerCase()));

        // Encode password ONCE
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        // Save user
        return userRepository.save(user);
    }

    // forgot - passord
    public SecurityQuestion getSecurityQuestion(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User Not Found"));

        SecurityQuestion question = user.getSecurityQuestion();

        return new SecurityQuestion(question.getQuestionId(), question.getQuestion());
    }

    // ---------- VERIFY SECURITY ANSWER ----------
    public void verifySecurityAnswer(String email, Integer questionId, String answer) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User Not Found"));
        Integer dbQuestionId = user.getSecurityQuestion().getQuestionId();

        if (!dbQuestionId.equals(questionId)) {
            throw new RuntimeException("Invalid security question");
        }

        String inputAnswer = answer.trim().toLowerCase();

        if (!passwordEncoder.matches(inputAnswer, user.getAnswer())) {
            System.out.println(passwordEncoder.encode(user.getAnswer()));
            System.out.println(passwordEncoder.encode(inputAnswer));

            throw new RuntimeException("Incorrect answer");
        }

    }

    // ---------- RESET PASSWORD ----------
    public void resetPassword(String email, String newPassword) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User Not Found"));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    // ---------- STATUS UPDATE ----------
    @org.springframework.transaction.annotation.Transactional
    public void updateUserStatus(String email, com.p20.rentit.entities.UserStatus status) {
        System.out.println("DEBUG: updateUserStatus called for email: " + email + " with status: " + status);
        try {
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User Not Found"));
            user.setIsActive(status);
            userRepository.saveAndFlush(user); // Force immediate write
            System.out.println("DEBUG: User status updated and saved (flushed) for " + email);
        } catch (Exception e) {
            System.out.println("ERROR: Failed to update user status in DB: " + e.getMessage());
            e.printStackTrace();
            throw e; // Re-throw to controller
        }
    }

}
