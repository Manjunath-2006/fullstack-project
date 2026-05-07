package com.edutrack.dto;

public class LeaveRequestCreate {
    private Long applicantId;
    private String applicantRole;
    private String fromDate;
    private String toDate;
    private String reason;

    public LeaveRequestCreate() {}

    public LeaveRequestCreate(Long applicantId, String applicantRole, String fromDate, String toDate, String reason) {
        this.applicantId = applicantId;
        this.applicantRole = applicantRole;
        this.fromDate = fromDate;
        this.toDate = toDate;
        this.reason = reason;
    }

    // Getters and Setters
    public Long getApplicantId() { return applicantId; }
    public void setApplicantId(Long applicantId) { this.applicantId = applicantId; }

    public String getApplicantRole() { return applicantRole; }
    public void setApplicantRole(String applicantRole) { this.applicantRole = applicantRole; }

    public String getFromDate() { return fromDate; }
    public void setFromDate(String fromDate) { this.fromDate = fromDate; }

    public String getToDate() { return toDate; }
    public void setToDate(String toDate) { this.toDate = toDate; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}