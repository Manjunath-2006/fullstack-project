package com.edutrack.controller;

import com.edutrack.dto.CalendarEventCreate;
import com.edutrack.model.CalendarEvent;
import com.edutrack.service.CalendarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/calendar")
public class CalendarController {

    @Autowired
    private CalendarService calendarService;

    @GetMapping
    public List<CalendarEvent> getCalendarEvents() {
        return calendarService.getAllCalendarEvents();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CalendarEvent> getCalendarEvent(@PathVariable Long id) {
        Optional<CalendarEvent> event = calendarService.getCalendarEventById(id);
        return event.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<CalendarEvent> createCalendarEvent(@RequestBody CalendarEventCreate request) {
        CalendarEvent event = calendarService.createCalendarEvent(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(event);
    }
}