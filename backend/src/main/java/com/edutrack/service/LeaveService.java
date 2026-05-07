package com.edutrack.service;

import com.edutrack.dto.LeaveRequestCreate;
import com.edutrack.model.LeaveRequest;
import com.edutrack.model.LeaveStatus;
import com.edutrack.model.User;
import com.edutrack.repository.LeaveRequestRepository;
import com.edutrack.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class LeaveService {

    @Autowired
    private LeaveRequestRepository leaveRequestRepository;

    @Autowired
    private UserRepository userRepository;

    public List<LeaveRequest> getAllLeaveRequests(Long applicantId) {
        if (applicantId != null) {
            return leaveRequestRepository.findByApplicant_Id(applicantId);
        }
        return leaveRequestRepository.findAll();
    }

    public Optional<LeaveRequest> getLeaveRequestById(Long id) {
        return leaveRequestRepository.findById(id);
    }

    public LeaveRequest createLeaveRequest(LeaveRequestCreate request) {
        LeaveRequest leaveRequest = new LeaveRequest();
        userRepository.findById(request.getApplicantId()).ifPresent(leaveRequest::setApplicant);
        leaveRequest.setApplicantRole(request.getApplicantRole());
        leaveRequest.setFromDate(LocalDate.parse(request.getFromDate()));
        leaveRequest.setToDate(LocalDate.parse(request.getToDate()));
        leaveRequest.setReason(request.getReason());
        return leaveRequestRepository.save(leaveRequest);
    }

    public LeaveRequest updateLeaveStatus(Long id, LeaveStatus status) {
        Optional<LeaveRequest> existing = leaveRequestRepository.findById(id);
        if (existing.isPresent()) {
            LeaveRequest leaveRequest = existing.get();
            leaveRequest.setStatus(status);
            return leaveRequestRepository.save(leaveRequest);
        }
        return null;
    }
}
