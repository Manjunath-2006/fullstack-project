package com.edutrack.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "leave_requests")
public class LeaveRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "applicant_id", nullable = false)
    @JsonIgnore
    private User applicant;

    @Column(name = "applicant_role", nullable = false)
    private String applicantRole;

    @Column(name = "from_date", nullable = false)
    private LocalDate fromDate;

    @Column(name = "to_date", nullable = false)
    private LocalDate toDate;

    @Column(nullable = false)
    private String reason;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LeaveStatus status = LeaveStatus.PENDING;

    public LeaveRequest() {}

    public LeaveRequest(User applicant, String applicantRole, LocalDate fromDate, LocalDate toDate, String reason) {
        this.applicant = applicant;
        this.applicantRole = applicantRole;
        this.fromDate = fromDate;
        this.toDate = toDate;
        this.reason = reason;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getApplicant() { return applicant; }
    public void setApplicant(User applicant) { this.applicant = applicant; }

    public String getApplicantRole() { return applicantRole; }
    public void setApplicantRole(String applicantRole) { this.applicantRole = applicantRole; }

    @JsonProperty("applicant_role")
    public String getApplicantRoleAlias() { return applicantRole; }

    @JsonProperty("from_date")
    public LocalDate getFromDateAlias() { return fromDate; }

    public LocalDate getFromDate() { return fromDate; }
    public void setFromDate(LocalDate fromDate) { this.fromDate = fromDate; }

    @JsonProperty("to_date")
    public LocalDate getToDateAlias() { return toDate; }

    public LocalDate getToDate() { return toDate; }
    public void setToDate(LocalDate toDate) { this.toDate = toDate; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public LeaveStatus getStatus() { return status; }
    public void setStatus(LeaveStatus status) { this.status = status; }

    @JsonProperty("applicant_id")
    public Long getApplicantId() { return applicant != null ? applicant.getId() : null; }
}
