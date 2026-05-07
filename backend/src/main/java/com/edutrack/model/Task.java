package com.edutrack.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "tasks")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    @JsonIgnore
    private User student;

    @Column(nullable = false)
    private String title;

    private String description;

    @Column(nullable = false)
    private String subject;

    @Column(name = "due_date_time", nullable = false)
    private LocalDateTime dueDateTime;

    @Column(name = "assigned_date", nullable = false)
    private LocalDate assignedDate;

    @ManyToOne
    @JoinColumn(name = "assigned_by")
    @JsonIgnore
    private User assignedBy;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TaskStatus status = TaskStatus.PENDING;

    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties({"task"})
    private List<TaskDocument> documents;

    public Task() {}

    public Task(User student, String title, String description, String subject, LocalDateTime dueDateTime, LocalDate assignedDate, User assignedBy) {
        this.student = student;
        this.title = title;
        this.description = description;
        this.subject = subject;
        this.dueDateTime = dueDateTime;
        this.assignedDate = assignedDate;
        this.assignedBy = assignedBy;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getStudent() { return student; }
    public void setStudent(User student) { this.student = student; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public LocalDateTime getDueDateTime() { return dueDateTime; }
    public void setDueDateTime(LocalDateTime dueDateTime) { this.dueDateTime = dueDateTime; }

    @JsonProperty("due_date_time")
    public LocalDateTime getDueDateTimeAlias() { return dueDateTime; }

    @JsonProperty("assigned_date")
    public LocalDate getAssignedDateAlias() { return assignedDate; }

    public LocalDate getAssignedDate() { return assignedDate; }
    public void setAssignedDate(LocalDate assignedDate) { this.assignedDate = assignedDate; }

    public User getAssignedBy() { return assignedBy; }
    public void setAssignedBy(User assignedBy) { this.assignedBy = assignedBy; }

    public TaskStatus getStatus() { return status; }
    public void setStatus(TaskStatus status) { this.status = status; }

    public List<TaskDocument> getDocuments() { return documents; }
    public void setDocuments(List<TaskDocument> documents) { this.documents = documents; }

    @JsonProperty("student_id")
    public Long getStudentId() { return student != null ? student.getId() : null; }

    @JsonProperty("assigned_by")
    public Long getAssignedById() { return assignedBy != null ? assignedBy.getId() : null; }

    @JsonProperty("overdue")
    public boolean isOverdue() {
        return status != TaskStatus.COMPLETED && dueDateTime != null && dueDateTime.isBefore(LocalDateTime.now());
    }
}
