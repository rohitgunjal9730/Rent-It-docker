package com.p20.rentit.dto;

public class VerifyAnswerRequest {
	private String email;
	private Integer questionId;
	private String answer;

	public VerifyAnswerRequest(String email, Integer questionId, String answer) {
		super();
		this.email = email;
		this.questionId = questionId;
		this.answer = answer;
	}

	public VerifyAnswerRequest() {
		super();
		// TODO Auto-generated constructor stub
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public Integer getQuestionId() {
		return questionId;
	}

	public void setQuestionId(Integer questionId) {
		this.questionId = questionId;
	}

	public String getAnswer() {
		return answer;
	}

	public void setAnswer(String answer) {
		this.answer = answer;
	}

}
