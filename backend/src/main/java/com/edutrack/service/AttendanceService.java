package com.edutrack.service;

import com.edutrack.dto.AttendanceRecordCreate;
import com.edutrack.model.AttendanceRecord;
import com.edutrack.model.AttendanceStatus;
import com.edutrack.model.User;
import com.edutrack.repository.AttendanceRecordRepository;
import com.edutrack.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class AttendanceService {

    @Autowired
    private AttendanceRecordRepository attendanceRecordRepository;

    @Autowired
    private UserRepository userRepository;

    public List<AttendanceRecord> getAllAttendanceRecords() {
        return attendanceRecordRepository.findAll();
    }

    public List<AttendanceRecord> getAttendanceRecords(Long studentId) {
        if (studentId != null) {
            return attendanceRecordRepository.findByStudent_Id(studentId);
        }
        return attendanceRecordRepository.findAll();
    }

    public Optional<AttendanceRecord> getAttendanceRecordById(Long id) {
        return attendanceRecordRepository.findById(id);
    }

    public AttendanceRecord createAttendanceRecord(AttendanceRecordCreate request) {
        AttendanceRecord record = new AttendanceRecord();
        userRepository.findById(request.getStudentId()).ifPresent(record::setStudent);
        record.setDate(LocalDate.parse(request.getDate()));
        record.setStatus(AttendanceStatus.valueOf(request.getStatus().toUpperCase()));
        return attendanceRecordRepository.save(record);
    }

    public Map<String, Object> getAttendanceSummary(Long studentId) {
        List<AttendanceRecord> records = getAttendanceRecords(studentId);
        long total = records.size();
        long present = records.stream().filter(r -> r.getStatus() == AttendanceStatus.PRESENT).count();
        long absent = records.stream().filter(r -> r.getStatus() == AttendanceStatus.ABSENT).count();
        double percentage = total == 0 ? 0 : Math.round((present * 100.0 / total) * 100.0) / 100.0;

        Map<String, Object> summary = new HashMap<>();
        summary.put("total_days", total);
        summary.put("present", present);
        summary.put("absent", absent);
        summary.put("percentage", percentage);
        return summary;
    }
}
