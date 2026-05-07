package com.edutrack.controller;

import com.edutrack.model.AttendanceRecord;
import com.edutrack.service.PerformanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/performance")
public class PerformanceController {

    @Autowired
    private PerformanceService performanceService;

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getAdminDashboard() {
        return ResponseEntity.ok(performanceService.getAdminDashboard());
    }

    @GetMapping("/student-dashboard/{id}")
    public ResponseEntity<Map<String, Object>> getStudentDashboard(@PathVariable Long id) {
        return ResponseEntity.ok(performanceService.getStudentDashboard(id));
    }

    @GetMapping("/attendance")
    public ResponseEntity<List<AttendanceRecord>> getAttendanceRecords(@RequestParam(name = "student_id", required = false) Long studentId) {
        return ResponseEntity.ok(performanceService.getAttendanceRecords(studentId));
    }

    @GetMapping("/attendance/{id}/summary")
    public ResponseEntity<Map<String, Object>> getAttendanceSummary(@PathVariable Long id) {
        return ResponseEntity.ok(performanceService.getAttendanceSummary(id));
    }
}
