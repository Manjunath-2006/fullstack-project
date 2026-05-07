package com.edutrack.dto;

public class CalendarEventCreate {
    private String title;
    private String date;
    private String category;
    private String type;

    public CalendarEventCreate() {}

    public CalendarEventCreate(String title, String date, String category, String type) {
        this.title = title;
        this.date = date;
        this.category = category;
        this.type = type;
    }

    // Getters and Setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
}