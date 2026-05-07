package com.edutrack.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "scores")
public class Score {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    @JsonIgnore
    private User student;

    @Column(name = "roll_number")
    private String rollNumber;

    @Column(nullable = false)
    private String subject;

    @Column(name = "test_name", nullable = false)
    private String testName;

    @Column(nullable = false)
    private Double marks;

    @Column(name = "max_marks")
    private Double maxMarks = 100.0;

    @Column(name = "test_date", nullable = false)
    private LocalDate testDate;

    public Score() {}

    public Score(User student, String rollNumber, String subject, String testName, Double marks, Double maxMarks, LocalDate testDate) {
        this.student = student;
        this.rollNumber = rollNumber;
        this.subject = subject;
        this.testName = testName;
        this.marks = marks;
        this.maxMarks = maxMarks;
        this.testDate = testDate;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getStudent() { return student; }
    public void setStudent(User student) { this.student = student; }

    public String getRollNumber() { return rollNumber; }
    public void setRollNumber(String rollNumber) { this.rollNumber = rollNumber; }

    @JsonProperty("roll_number")
    public String getRollNumberAlias() { return rollNumber; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    @JsonProperty("test_name")
    public String getTestNameAlias() { return testName; }

    public String getTestName() { return testName; }
    public void setTestName(String testName) { this.testName = testName; }

    public Double getMarks() { return marks; }
    public void setMarks(Double marks) { this.marks = marks; }

    @JsonProperty("max_marks")
    public Double getMaxMarksAlias() { return maxMarks; }

    public Double getMaxMarks() { return maxMarks; }
    public void setMaxMarks(Double maxMarks) { this.maxMarks = maxMarks; }

    @JsonProperty("test_date")
    public LocalDate getTestDateAlias() { return testDate; }

    public LocalDate getTestDate() { return testDate; }
    public void setTestDate(LocalDate testDate) { this.testDate = testDate; }

    @JsonProperty("student_id")
    public Long getStudentId() { return student != null ? student.getId() : null; }

    @JsonProperty("name")
    public String getStudentName() { return student != null ? student.getName() : null; }
}
