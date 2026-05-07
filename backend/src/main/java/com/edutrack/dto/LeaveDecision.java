package com.edutrack.dto;

import com.edutrack.model.LeaveStatus;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class LeaveDecision {
    private LeaveStatus status;

    public LeaveDecision() {}

    @JsonCreator
    public LeaveDecision(@JsonProperty("status") String status) {
        this.status = LeaveStatus.valueOf(status.toUpperCase());
    }

    public LeaveStatus getStatus() { return status; }
    public void setStatus(LeaveStatus status) { this.status = status; }
}