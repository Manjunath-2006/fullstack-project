package com.edutrack.dto;

public class AttendanceRecordCreate {
    private Long studentId;
    private String date;
    private String status;

    public AttendanceRecordCreate() {}

    public AttendanceRecordCreate(Long studentId, String date, String status) {
        this.studentId = studentId;
        this.date = date;
        this.status = status;
    }

    // Getters and Setters
    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}