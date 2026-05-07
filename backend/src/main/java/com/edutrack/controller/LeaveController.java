package com.edutrack.controller;

import com.edutrack.dto.LeaveDecision;
import com.edutrack.dto.LeaveRequestCreate;
import com.edutrack.model.LeaveRequest;
import com.edutrack.service.LeaveService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/leaves")
public class LeaveController {

    @Autowired
    private LeaveService leaveService;

    @GetMapping
    public List<LeaveRequest> getLeaveRequests(@RequestParam(name = "applicant_id", required = false) Long applicantId) {
        return leaveService.getAllLeaveRequests(applicantId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LeaveRequest> getLeaveRequest(@PathVariable Long id) {
        Optional<LeaveRequest> leaveRequest = leaveService.getLeaveRequestById(id);
        return leaveRequest.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<LeaveRequest> createLeaveRequest(@RequestBody LeaveRequestCreate request) {
        LeaveRequest leaveRequest = leaveService.createLeaveRequest(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(leaveRequest);
    }

    @PutMapping("/{id}/decision")
    public ResponseEntity<LeaveRequest> updateLeaveDecision(@PathVariable Long id, @RequestBody LeaveDecision decision) {
        LeaveRequest result = leaveService.updateLeaveStatus(id, decision.getStatus());
        return result != null ? ResponseEntity.ok(result) : ResponseEntity.notFound().build();
    }
}
