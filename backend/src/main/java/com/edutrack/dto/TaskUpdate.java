package com.edutrack.dto;

import com.edutrack.model.TaskStatus;
import com.fasterxml.jackson.annotation.JsonCreator;

public class TaskUpdate {
    private TaskStatus status;

    public TaskUpdate() {}

    @JsonCreator
    public static TaskUpdate fromString(String status) {
        TaskUpdate u = new TaskUpdate();
        u.setStatus(TaskStatus.valueOf(status.toUpperCase()));
        return u;
    }

    public TaskStatus getStatus() { return status; }
    public void setStatus(TaskStatus status) { this.status = status; }
}