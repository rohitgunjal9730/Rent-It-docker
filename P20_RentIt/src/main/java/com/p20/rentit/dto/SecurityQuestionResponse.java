package com.p20.rentit.dto;

public class SecurityQuestionResponse {
	private int questionId;
	private String question;

	public SecurityQuestionResponse() {
		super();
		// TODO Auto-generated constructor stub
	}

	public SecurityQuestionResponse(int questionId, String question) {
		super();
		this.questionId = questionId;
		this.question = question;
	}

	public int getQuestionId() {
		return questionId;
	}

	public void setQuestionId(int questionId) {
		this.questionId = questionId;
	}

	public String getQuestion() {
		return question;
	}

	public void setQuestion(String question) {
		this.question = question;
	}

}
