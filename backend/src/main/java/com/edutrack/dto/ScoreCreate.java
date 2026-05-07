package com.edutrack.dto;

public class ScoreCreate {
    private Long studentId;
    private String rollNumber;
    private String subject;
    private String testName;
    private Double marks;
    private Double maxMarks;
    private String testDate;

    public ScoreCreate() {}

    public ScoreCreate(Long studentId, String rollNumber, String subject, String testName, Double marks, Double maxMarks, String testDate) {
        this.studentId = studentId;
        this.rollNumber = rollNumber;
        this.subject = subject;
        this.testName = testName;
        this.marks = marks;
        this.maxMarks = maxMarks;
        this.testDate = testDate;
    }

    // Getters and Setters
    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public String getRollNumber() { return rollNumber; }
    public void setRollNumber(String rollNumber) { this.rollNumber = rollNumber; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getTestName() { return testName; }
    public void setTestName(String testName) { this.testName = testName; }

    public Double getMarks() { return marks; }
    public void setMarks(Double marks) { this.marks = marks; }

    public Double getMaxMarks() { return maxMarks; }
    public void setMaxMarks(Double maxMarks) { this.maxMarks = maxMarks; }

    public String getTestDate() { return testDate; }
    public void setTestDate(String testDate) { this.testDate = testDate; }
}