package com.rentit.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "security_question")
public class SecurityQuestion {

    @Id
    @Column(name = "question_id")
    private int questionId;

    @Column
    private String question;

    public SecurityQuestion() {
        super();
        // TODO Auto-generated constructor stub
    }

    public SecurityQuestion(int questionId, String question) {
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
