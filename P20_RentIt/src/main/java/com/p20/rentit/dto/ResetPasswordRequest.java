package com.p20.rentit.dto;

public class ResetPasswordRequest {
	private String email;
	private String newPassword;

	public ResetPasswordRequest() {
		super();
		// TODO Auto-generated constructor stub
	}

	public ResetPasswordRequest(String email, String newPassword) {
		super();
		this.email = email;
		this.newPassword = newPassword;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getNewPassword() {
		return newPassword;
	}

	public void setNewPassword(String newPassword) {
		this.newPassword = newPassword;
	}

}
