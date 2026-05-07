package com.edutrack.service;

import com.edutrack.model.AttendanceRecord;
import com.edutrack.model.AttendanceStatus;
import com.edutrack.model.LeaveStatus;
import com.edutrack.model.Role;
import com.edutrack.model.Score;
import com.edutrack.model.Task;
import com.edutrack.model.TaskStatus;
import com.edutrack.model.User;
import com.edutrack.repository.AttendanceRecordRepository;
import com.edutrack.repository.LeaveRequestRepository;
import com.edutrack.repository.ScoreRepository;
import com.edutrack.repository.TaskRepository;
import com.edutrack.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class PerformanceService {

    @Autowired private UserRepository userRepository;
    @Autowired private ScoreRepository scoreRepository;
    @Autowired private TaskRepository taskRepository;
    @Autowired private AttendanceRecordRepository attendanceRecordRepository;
    @Autowired private LeaveRequestRepository leaveRequestRepository;

    public Map<String, Object> getAdminDashboard() {
        List<User> students = userRepository.findByRole(Role.STUDENT);
        List<User> teachers = userRepository.findByRole(Role.TEACHER);
        List<Score> scores = scoreRepository.findAll();
        List<Task> tasks = taskRepository.findAll();
        LocalDate today = LocalDate.now();

        long presentToday = attendanceRecordRepository.findByDate(today).stream()
                .filter(r -> r.getStatus() == AttendanceStatus.PRESENT).count();

        long pendingLeaves = leaveRequestRepository.countByStatus(LeaveStatus.PENDING);
        long completedTasks = tasks.stream().filter(t -> t.getStatus() == TaskStatus.COMPLETED).count();
        long overdueTasks = tasks.stream().filter(t -> t.getStatus() == TaskStatus.PENDING
                && t.getDueDateTime().isBefore(LocalDateTime.now())).count();

        double avgScore = scores.isEmpty() ? 0.0
                : scores.stream().mapToDouble(s -> s.getMarks() / s.getMaxMarks() * 100).average().orElse(0.0);

        double taskCompletionRate = tasks.isEmpty() ? 0.0
                : Math.round((completedTasks * 100.0 / tasks.size()) * 100.0) / 100.0;

        Map<String, Integer> taskStats = new HashMap<>();
        taskStats.put("completed", (int) completedTasks);
        taskStats.put("pending", (int) tasks.stream().filter(t -> t.getStatus() == TaskStatus.PENDING).count());
        taskStats.put("overdue", (int) overdueTasks);

        // Build subject averages
        Map<String, Double> subjectTotals = new HashMap<>();
        Map<String, Integer> subjectCounts = new HashMap<>();
        for (Score score : scores) {
            subjectTotals.merge(score.getSubject(), score.getMarks(), Double::sum);
            subjectCounts.merge(score.getSubject(), 1, Integer::sum);
        }

        // Fix: use explicit HashMap<String, Object> instead of Map.of() to avoid type inference issues
        List<Map<String, Object>> subjectAverages = new ArrayList<>();
        for (String subject : subjectTotals.keySet()) {
            double avg = Math.round((subjectTotals.get(subject) / subjectCounts.get(subject)) * 100.0) / 100.0;
            Map<String, Object> entry = new HashMap<>();
            entry.put("subject", subject);
            entry.put("avg", avg);
            subjectAverages.add(entry);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("total_students", students.size());
        response.put("total_teachers", teachers.size());
        response.put("present_today", presentToday);
        response.put("pending_leaves", pendingLeaves);
        response.put("avg_score", Math.round(avgScore * 100.0) / 100.0);
        response.put("completed_tasks", completedTasks);
        response.put("overdue_tasks", overdueTasks);
        response.put("task_completion_rate", taskCompletionRate);
        response.put("task_stats", taskStats);
        response.put("subject_averages", subjectAverages);
        return response;
    }

    public Map<String, Object> getStudentDashboard(Long studentId) {
        List<Task> tasks = taskRepository.findByStudent_Id(studentId);
        List<Score> scores = scoreRepository.findByStudent_Id(studentId);
        List<AttendanceRecord> attendance = attendanceRecordRepository.findByStudent_Id(studentId);

        long totalTasks = tasks.size();
        long completedTasks = tasks.stream().filter(t -> t.getStatus() == TaskStatus.COMPLETED).count();
        long overdueTasks = tasks.stream().filter(t -> t.getStatus() == TaskStatus.PENDING
                && t.getDueDateTime().isBefore(LocalDateTime.now())).count();

        long present = attendance.stream().filter(r -> r.getStatus() == AttendanceStatus.PRESENT).count();
        long totalDays = attendance.size();
        double attendancePct = totalDays == 0 ? 0.0
                : Math.round((present * 100.0 / totalDays) * 100.0) / 100.0;

        double avgScore = scores.isEmpty() ? 0.0
                : scores.stream().mapToDouble(s -> s.getMarks() / s.getMaxMarks() * 100).average().orElse(0.0);

        // Fix: use explicit HashMap instead of Map.of() for mixed Long/String types
        List<Map<String, Object>> upcoming = tasks.stream()
                .filter(t -> t.getStatus() == TaskStatus.PENDING && t.getDueDateTime().isAfter(LocalDateTime.now()))
                .sorted((a, b) -> a.getDueDateTime().compareTo(b.getDueDateTime()))
                .limit(5)
                .map(t -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("id", t.getId());
                    m.put("title", t.getTitle());
                    m.put("due_date_time", t.getDueDateTime().toString());
                    return m;
                })
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("attendance_pct", attendancePct);
        response.put("completed_tasks", completedTasks);
        response.put("total_tasks", totalTasks);
        response.put("avg_score", Math.round(avgScore * 100.0) / 100.0);
        response.put("overdue_tasks", overdueTasks);
        response.put("upcoming_deadlines", upcoming);
        return response;
    }

    public List<AttendanceRecord> getAttendanceRecords(Long studentId) {
        if (studentId != null) return attendanceRecordRepository.findByStudent_Id(studentId);
        return attendanceRecordRepository.findAll();
    }

    public Map<String, Object> getAttendanceSummary(Long studentId) {
        List<AttendanceRecord> records = attendanceRecordRepository.findByStudent_Id(studentId);
        long totalDays = records.size();
        long present = records.stream().filter(r -> r.getStatus() == AttendanceStatus.PRESENT).count();
        long absent = records.stream().filter(r -> r.getStatus() == AttendanceStatus.ABSENT).count();
        double percentage = totalDays == 0 ? 0.0
                : Math.round((present * 100.0 / totalDays) * 100.0) / 100.0;

        Map<String, Object> summary = new HashMap<>();
        summary.put("total_days", totalDays);
        summary.put("present", present);
        summary.put("absent", absent);
        summary.put("percentage", percentage);
        return summary;
    }
}
