package com.p20.rentit.dto;

public class ForgotPasswordRequest {
	private String email;

	public ForgotPasswordRequest() {
		super();
	}

	public ForgotPasswordRequest(String email) {
		super();
		this.email = email;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

}
