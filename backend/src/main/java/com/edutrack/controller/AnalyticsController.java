package com.edutrack.controller;

import com.edutrack.model.AttendanceRecord;
import com.edutrack.model.AttendanceStatus;
import com.edutrack.model.Score;
import com.edutrack.model.Task;
import com.edutrack.model.TaskStatus;
import com.edutrack.repository.AttendanceRecordRepository;
import com.edutrack.repository.ScoreRepository;
import com.edutrack.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/analytics")
public class AnalyticsController {

    @Autowired private ScoreRepository scoreRepo;
    @Autowired private TaskRepository taskRepo;
    @Autowired private AttendanceRecordRepository attendanceRepo;

    @GetMapping("/recommendations/{studentId}")
    public ResponseEntity<Map<String, Object>> getRecommendations(@PathVariable Long studentId) {
        List<Score> scores = scoreRepo.findByStudent_Id(studentId);
        List<Task> tasks = taskRepo.findByStudent_Id(studentId);
        List<AttendanceRecord> attendance = attendanceRepo.findByStudent_Id(studentId);

        List<Map<String, String>> recommendations = new ArrayList<>();
        Map<String, String> summary = new HashMap<>();

        // Attendance analysis
        long totalDays = attendance.size();
        long presentDays = attendance.stream().filter(r -> r.getStatus() == AttendanceStatus.PRESENT).count();
        double attendancePct = totalDays == 0 ? 100.0 : (presentDays * 100.0 / totalDays);

        if (attendancePct < 75) {
            recommendations.add(Map.of(
                "type", "warning",
                "category", "Attendance",
                "message", String.format("Your attendance is critically low at %.0f%%. You risk academic penalties. Aim for at least 75%%.", attendancePct)
            ));
        } else if (attendancePct < 85) {
            recommendations.add(Map.of(
                "type", "caution",
                "category", "Attendance",
                "message", String.format("Attendance is %.0f%%. Try to improve — consistent attendance strongly correlates with better grades.", attendancePct)
            ));
        } else {
            recommendations.add(Map.of(
                "type", "success",
                "category", "Attendance",
                "message", String.format("Great attendance at %.0f%%! Keep it up.", attendancePct)
            ));
        }

        // Subject-wise score analysis
        if (!scores.isEmpty()) {
            Map<String, List<Double>> bySubject = new HashMap<>();
            for (Score s : scores) {
                bySubject.computeIfAbsent(s.getSubject(), k -> new ArrayList<>())
                         .add(s.getMarks() / s.getMaxMarks() * 100);
            }

            String weakestSubject = null;
            double lowestAvg = Double.MAX_VALUE;
            String strongestSubject = null;
            double highestAvg = Double.MIN_VALUE;

            for (Map.Entry<String, List<Double>> entry : bySubject.entrySet()) {
                double avg = entry.getValue().stream().mapToDouble(Double::doubleValue).average().orElse(0);
                if (avg < lowestAvg) { lowestAvg = avg; weakestSubject = entry.getKey(); }
                if (avg > highestAvg) { highestAvg = avg; strongestSubject = entry.getKey(); }
            }

            if (lowestAvg < 60) {
                recommendations.add(Map.of(
                    "type", "warning",
                    "category", "Academics",
                    "message", String.format("You're struggling in %s (avg %.0f%%). Consider extra practice or asking your teacher for help.", weakestSubject, lowestAvg)
                ));
            } else if (lowestAvg < 75) {
                recommendations.add(Map.of(
                    "type", "caution",
                    "category", "Academics",
                    "message", String.format("%s needs improvement (avg %.0f%%). Review past tests and focus on weak topics.", weakestSubject, lowestAvg)
                ));
            }

            if (highestAvg >= 85 && !strongestSubject.equals(weakestSubject)) {
                recommendations.add(Map.of(
                    "type", "success",
                    "category", "Academics",
                    "message", String.format("You're excelling in %s (avg %.0f%%). Consider helping peers or exploring advanced topics.", strongestSubject, highestAvg)
                ));
            }

            // Score trend (last 3 scores in any subject)
            List<Score> sorted = scores.stream()
                .sorted(Comparator.comparing(Score::getTestDate))
                .collect(Collectors.toList());
            if (sorted.size() >= 3) {
                int n = sorted.size();
                double recent = sorted.get(n - 1).getMarks() / sorted.get(n - 1).getMaxMarks() * 100;
                double older  = sorted.get(n - 3).getMarks() / sorted.get(n - 3).getMaxMarks() * 100;
                if (recent - older > 10) {
                    recommendations.add(Map.of("type", "success", "category", "Trend", "message", "Your scores are trending upward! Great improvement recently."));
                } else if (older - recent > 10) {
                    recommendations.add(Map.of("type", "warning", "category", "Trend", "message", "Your recent scores have dropped. Review your study habits and reach out to your teacher."));
                }
            }
        } else {
            recommendations.add(Map.of("type", "info", "category", "Academics", "message", "No scores recorded yet. Stay on top of your tests!"));
        }

        // Task analysis
        long overdue = tasks.stream().filter(t -> t.getStatus() == TaskStatus.PENDING && t.getDueDateTime().isBefore(LocalDateTime.now())).count();
        long pending = tasks.stream().filter(t -> t.getStatus() == TaskStatus.PENDING && t.getDueDateTime().isAfter(LocalDateTime.now())).count();
        long completed = tasks.stream().filter(t -> t.getStatus() == TaskStatus.COMPLETED).count();

        if (overdue > 0) {
            recommendations.add(Map.of("type", "warning", "category", "Tasks", "message", String.format("You have %d overdue task(s). Submit them as soon as possible to avoid penalties.", overdue)));
        }
        if (pending >= 3) {
            recommendations.add(Map.of("type", "caution", "category", "Tasks", "message", String.format("%d tasks are due soon. Plan your time to avoid last-minute stress.", pending)));
        }
        if (tasks.size() > 0 && completed * 100 / tasks.size() >= 80) {
            recommendations.add(Map.of("type", "success", "category", "Tasks", "message", "Excellent task completion rate! You're staying on top of your work."));
        }

        // Overall summary
        double overallAvg = scores.isEmpty() ? 0 :
            scores.stream().mapToDouble(s -> s.getMarks() / s.getMaxMarks() * 100).average().orElse(0);

        String risk;
        if (attendancePct < 75 || overallAvg < 50 || overdue > 2) risk = "HIGH";
        else if (attendancePct < 85 || overallAvg < 65) risk = "MEDIUM";
        else risk = "LOW";

        summary.put("risk_level", risk);
        summary.put("overall_avg", String.format("%.1f", overallAvg));
        summary.put("attendance_pct", String.format("%.1f", attendancePct));
        summary.put("overdue_tasks", String.valueOf(overdue));

        Map<String, Object> response = new HashMap<>();
        response.put("recommendations", recommendations);
        response.put("summary", summary);
        return ResponseEntity.ok(response);
    }
}
