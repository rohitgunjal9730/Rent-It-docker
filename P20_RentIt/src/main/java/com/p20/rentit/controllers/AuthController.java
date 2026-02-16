package com.p20.rentit.controllers;

import java.util.List;
import java.util.Map;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpHeaders;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.p20.rentit.dto.ForgotPasswordRequest;
import com.p20.rentit.dto.LoginRequest;
import com.p20.rentit.dto.LoginResponse;
import com.p20.rentit.dto.RegisterRequest;
import com.p20.rentit.dto.ResetPasswordRequest;
import com.p20.rentit.dto.SecurityQuestionResponse;
import com.p20.rentit.dto.VerifyAnswerRequest;
import com.p20.rentit.entities.SecurityQuestion;
import com.p20.rentit.entities.User;
import com.p20.rentit.entities.UserStatus;
import com.p20.rentit.repositories.SecurityQuestionRepository;
import com.p20.rentit.security.JwtUtil;
import com.p20.rentit.services.AuthService;

//@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/auth")
public class AuthController {

	@Autowired
	private SecurityQuestionRepository securityQuestionRepository;

	@Autowired
	private AuthService authService;

	@Autowired
	private org.springframework.web.client.RestTemplate restTemplate;

	@Value("${owner.service.url}")
	private String ownerServiceUrl;

	@Value("${customer.service.url}")
	private String customerServiceUrl;

	@Autowired
	private JwtUtil jwtUtil;

	AuthController(SecurityQuestionRepository securityQuestionRepository) {
		this.securityQuestionRepository = securityQuestionRepository;
	}

	// login they insert data
	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody LoginRequest request) {
		try {
			User user = authService.login(request.getEmail(), request.getPassword());

			// Create Owner/Customer Validation Check
			// Check Role and Verify Approval Status
			String roleName = user.getRole().getRoleName();
			if (roleName != null) {
				roleName = roleName.trim().toUpperCase();
			} else {
				roleName = ""; // Prevention of null pointer
			}

			System.out.println("DEBUG: User Role: " + roleName);

			String approvalStatus = null;

			try {
				if ("OWNER".equals(roleName)) {
					String url = ownerServiceUrl + "/owner/profile/" + user.getUserId();
					System.out.println("DEBUG: Calling Owner Service: " + url);
					com.p20.rentit.dto.OwnerStatusDTO ownerStatus = restTemplate.getForObject(url,
							com.p20.rentit.dto.OwnerStatusDTO.class);
					if (ownerStatus != null) {
						approvalStatus = ownerStatus.getApprovalStatus();
					}
				} else if ("CUSTOMER".equals(roleName)) {
					String url = customerServiceUrl + "/customer/profile/" + user.getUserId();
					System.out.println("DEBUG: Calling Customer Service: " + url);
					com.p20.rentit.dto.CustomerStatusDTO customerStatus = restTemplate.getForObject(url,
							com.p20.rentit.dto.CustomerStatusDTO.class);
					if (customerStatus != null) {
						approvalStatus = customerStatus.getApprovalStatus();
					}
				}

				// If role is OWNER or CUSTOMER, validate status
				if ("OWNER".equals(roleName) || "CUSTOMER".equals(roleName)) {
					System.out.println("DEBUG: Role requires approval check. Status fetched: " + approvalStatus);

					if (approvalStatus == null) {
						return ResponseEntity
								.status(HttpStatus.FORBIDDEN)
								.body("Please wait for admin approval");
					} else if ("REJECTED".equalsIgnoreCase(approvalStatus)) {
						return ResponseEntity
								.status(HttpStatus.FORBIDDEN)
								.body("Your registration has been rejected by admin");
					} else if (!"APPROVED".equalsIgnoreCase(approvalStatus)) {
						// Fallback for any other non-approved status
						return ResponseEntity
								.status(HttpStatus.FORBIDDEN)
								.body("Please wait for admin approval");
					}
				}

			} catch (Exception e) {
				// safe fail - if service is down or returns error, block login
				System.out.println("ERROR: Approval Check Failed: " + e.getMessage());
				e.printStackTrace();
				return ResponseEntity
						.status(HttpStatus.SERVICE_UNAVAILABLE)
						.body("Unable to verify approval status. Please try again later.");
			}

			String token = jwtUtil.generateToken(user);

			authService.updateUserStatus(user.getEmail(), UserStatus.ACTIVE);

			LoginResponse response = new LoginResponse(
					user.getUserId(),
					user.getEmail(),
					user.getRole().getRoleName(),
					token);

			return ResponseEntity.ok(response);

		} catch (RuntimeException e) {
			return ResponseEntity
					.status(HttpStatus.UNAUTHORIZED)
					.body(e.getMessage());
		}
	}

	// register
	@PostMapping("/register")
	public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {

		User savedUser = authService.register(registerRequest);

		return ResponseEntity.ok(savedUser);
	}

	// forgot-password
	@PostMapping("/forgot-password")
	public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest forgotPasswordRequest) {

		SecurityQuestion question = authService.getSecurityQuestion(forgotPasswordRequest.getEmail());

		SecurityQuestionResponse response = new SecurityQuestionResponse(
				question.getQuestionId(),
				question.getQuestion());

		System.out.print(question.getQuestion());
		return ResponseEntity.ok(List.of(response));
	}

	@PostMapping("/verify-security-answer")
	public ResponseEntity<?> verifySecurityAnswer(
			@RequestBody VerifyAnswerRequest request) {

		if (request.getQuestionId() == null) {
			return ResponseEntity
					.badRequest()
					.body("Security question not selected");
		}

		authService.verifySecurityAnswer(
				request.getEmail(),
				request.getQuestionId(),
				request.getAnswer());

		return ResponseEntity.ok(
				Map.of("status", "VERIFIED"));

	}

	@PostMapping("/reset-password")
	public ResponseEntity<?> resetPassword(
			@RequestBody ResetPasswordRequest request) {

		authService.resetPassword(
				request.getEmail(),
				request.getNewPassword());

		return ResponseEntity.ok("PASSWORD_RESET_SUCCESS");
	}

	@GetMapping("/security-questions")
	public ResponseEntity<List<SecurityQuestion>> getAllQuestions() {
		return ResponseEntity.ok(securityQuestionRepository.findAll());
	}

	@PostMapping("/logout")
	public ResponseEntity<?> logout(HttpServletRequest request) {
		try {
			System.out.println("DEBUG: Logout endpoint hit");
			String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
			System.out.println("DEBUG: Auth Header: " + (authHeader != null ? "Present" : "Null"));

			if (authHeader != null && authHeader.startsWith("Bearer ")) {
				String token = authHeader.substring(7);
				String email = jwtUtil.extractUsername(token);
				System.out.println("DEBUG: Extracted email: " + email);
				authService.updateUserStatus(email, UserStatus.DEACTIVE);
			} else {
				System.out.println("DEBUG: No valid Bearer token found");
			}
			return ResponseEntity.ok("Logged out successfully");
		} catch (Exception e) {
			System.out.println("ERROR: Logout failed: " + e.getMessage());
			e.printStackTrace();
			// Return error so we can debug
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Logout failed: " + e.getMessage());
		}
	}

}
