package com.edutrack.service;

import com.edutrack.dto.CalendarEventCreate;
import com.edutrack.model.CalendarEvent;
import com.edutrack.repository.CalendarEventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class CalendarService {

    @Autowired
    private CalendarEventRepository calendarEventRepository;

    public List<CalendarEvent> getAllCalendarEvents() {
        return calendarEventRepository.findAll();
    }

    public Optional<CalendarEvent> getCalendarEventById(Long id) {
        return calendarEventRepository.findById(id);
    }

    public CalendarEvent createCalendarEvent(CalendarEventCreate request) {
        CalendarEvent event = new CalendarEvent();
        event.setTitle(request.getTitle());
        event.setDate(LocalDate.parse(request.getDate()));
        event.setCategory(request.getCategory());
        event.setType(request.getType());
        return calendarEventRepository.save(event);
    }
}