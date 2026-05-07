package com.edutrack.dto;

public class ScoreUpdate {
    private Double marks;
    private Double maxMarks;

    public ScoreUpdate() {}

    public ScoreUpdate(Double marks, Double maxMarks) {
        this.marks = marks;
        this.maxMarks = maxMarks;
    }

    public Double getMarks() { return marks; }
    public void setMarks(Double marks) { this.marks = marks; }

    public Double getMaxMarks() { return maxMarks; }
    public void setMaxMarks(Double maxMarks) { this.maxMarks = maxMarks; }
}