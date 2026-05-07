package com.edutrack.dto;

public class TeacherCreate {
    private String name;
    private String email;
    private String subject;
    private String phone;
    private String password;

    public TeacherCreate() {}

    public TeacherCreate(String name, String email, String subject, String phone, String password) {
        this.name = name;
        this.email = email;
        this.subject = subject;
        this.phone = phone;
        this.password = password;
    }

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}