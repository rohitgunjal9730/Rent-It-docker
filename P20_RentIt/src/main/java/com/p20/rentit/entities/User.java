package com.p20.rentit.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(
    name = "user",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = "email"),
        @UniqueConstraint(columnNames = "phone"),
        @UniqueConstraint(columnNames = "driving_licence_no"),
        @UniqueConstraint(columnNames = "pan_no")
    }
)
public class User {

    // ---------- PRIMARY KEY ----------
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private int userId;

    // ---------- ROLE ----------
    @JsonIgnoreProperties("users")
    @ManyToOne
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    // ---------- BASIC DETAILS ----------
    @Column(name = "fname")
    private String fname;

    @Column(name = "mname")
    private String mname;

    @Column(name = "lname")
    private String lname;

    @Column(name = "phone")
    private String phone;

    @Column(name = "email")
    private String email;

    // ---------- DOCUMENT DETAILS ----------
    @Column(name = "driving_licence_no")
    private String drivingLicenceNo;

    @Column(name = "adhar_no")
    private String adharNo;

    @Column(name = "pan_no")
    private String panNo;

    // ---------- AUTH ----------
    @Column(name = "password")
    private String password;

    // ---------- ADDRESS ----------
    @Column(name = "address")
    private String address;

    @JsonIgnoreProperties("users")
    @ManyToOne
    @JoinColumn(name = "area_id", nullable = false)
    private Area area;

    // ---------- SECURITY QUESTION ----------
    @ManyToOne
    @JoinColumn(name = "question_id")
    private SecurityQuestion securityQuestion;

    @Column(name = "answer")
    private String answer;

    // ---------- STATUS ----------
    @Enumerated(EnumType.STRING)
    @Column(name = "is_active")
    private UserStatus isActive;

    @Enumerated(EnumType.STRING)
    @Column(name = "approval_status")
    private ApprovalStatus approvalStatus;

    // ---------- CONSTRUCTORS ----------
    public User() {
    }

    // ---------- GETTERS & SETTERS ----------
    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public String getFname() {
        return fname;
    }

    public void setFname(String fname) {
        this.fname = fname;
    }

    public String getMname() {
        return mname;
    }

    public void setMname(String mname) {
        this.mname = mname;
    }

    public String getLname() {
        return lname;
    }

    public void setLname(String lname) {
        this.lname = lname;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDrivingLicenceNo() {
        return drivingLicenceNo;
    }

    public void setDrivingLicenceNo(String drivingLicenceNo) {
        this.drivingLicenceNo = drivingLicenceNo;
    }

    public String getAdharNo() {
        return adharNo;
    }

    public void setAdharNo(String adharNo) {
        this.adharNo = adharNo;
    }

    public String getPanNo() {
        return panNo;
    }

    public void setPanNo(String panNo) {
        this.panNo = panNo;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Area getArea() {
        return area;
    }

    public void setArea(Area area) {
        this.area = area;
    }

    public SecurityQuestion getSecurityQuestion() {
        return securityQuestion;
    }

    public void setSecurityQuestion(SecurityQuestion securityQuestion) {
        this.securityQuestion = securityQuestion;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public UserStatus getIsActive() {
        return isActive;
    }

    public void setIsActive(UserStatus isActive) {
        this.isActive = isActive;
    }

    public ApprovalStatus getApprovalStatus() {
        return approvalStatus;
    }

    public void setApprovalStatus(ApprovalStatus approvalStatus) {
        this.approvalStatus = approvalStatus;
    }
}
