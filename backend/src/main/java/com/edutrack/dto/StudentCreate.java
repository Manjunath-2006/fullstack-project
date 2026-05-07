package com.edutrack.dto;

public class StudentCreate {
    private String rollNumber;
    private String name;
    private String email;
    private String grade;
    private String phone;
    private String password;

    public StudentCreate() {}

    public StudentCreate(String rollNumber, String name, String email, String grade, String phone, String password) {
        this.rollNumber = rollNumber;
        this.name = name;
        this.email = email;
        this.grade = grade;
        this.phone = phone;
        this.password = password;
    }

    // Getters and Setters
    public String getRollNumber() { return rollNumber; }
    public void setRollNumber(String rollNumber) { this.rollNumber = rollNumber; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getGrade() { return grade; }
    public void setGrade(String grade) { this.grade = grade; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}