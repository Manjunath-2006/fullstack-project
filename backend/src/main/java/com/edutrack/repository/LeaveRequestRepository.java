package com.edutrack.repository;

import com.edutrack.model.LeaveRequest;
import com.edutrack.model.LeaveStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {
    List<LeaveRequest> findByApplicant_Id(Long applicantId);
    long countByStatus(LeaveStatus status);
}
