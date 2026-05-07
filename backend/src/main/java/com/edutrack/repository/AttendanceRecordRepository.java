package com.edutrack.repository;

import com.edutrack.model.AttendanceRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AttendanceRecordRepository extends JpaRepository<AttendanceRecord, Long> {
    List<AttendanceRecord> findByStudent_Id(Long studentId);
    List<AttendanceRecord> findByDate(LocalDate date);
}
