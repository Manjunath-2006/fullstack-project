package com.edutrack.dto;

import java.util.List;

public class TaskCreate {
    private List<Long> studentIds;
    private String title;
    private String description;
    private String subject;
    private String dueDateTime;
    private Long assignedBy;

    public TaskCreate() {}

    public TaskCreate(List<Long> studentIds, String title, String description, String subject, String dueDateTime, Long assignedBy) {
        this.studentIds = studentIds;
        this.title = title;
        this.description = description;
        this.subject = subject;
        this.dueDateTime = dueDateTime;
        this.assignedBy = assignedBy;
    }

    // Getters and Setters
    public List<Long> getStudentIds() { return studentIds; }
    public void setStudentIds(List<Long> studentIds) { this.studentIds = studentIds; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getDueDateTime() { return dueDateTime; }
    public void setDueDateTime(String dueDateTime) { this.dueDateTime = dueDateTime; }

    public Long getAssignedBy() { return assignedBy; }
    public void setAssignedBy(Long assignedBy) { this.assignedBy = assignedBy; }
}