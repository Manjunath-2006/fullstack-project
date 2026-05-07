package com.edutrack.controller;

import com.edutrack.dto.ScoreCreate;
import com.edutrack.dto.ScoreUpdate;
import com.edutrack.model.Score;
import com.edutrack.service.ScoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/scores")
public class ScoresController {

    @Autowired
    private ScoreService scoreService;

    @GetMapping
    public List<Score> getScores(@RequestParam(name = "student_id", required = false) Long studentId,
                                 @RequestParam(name = "subject", required = false) String subject) {
        return scoreService.getAllScores(studentId, subject);
    }

    @GetMapping("/summary/{id}")
    public ResponseEntity<Map<String, Object>> getScoreSummary(@PathVariable Long id) {
        return ResponseEntity.ok(scoreService.getScoreSummary(id));
    }

    @PostMapping
    public ResponseEntity<Score> createScore(@RequestBody ScoreCreate request) {
        Score score = scoreService.createScore(request);
        return score != null ? ResponseEntity.status(HttpStatus.CREATED).body(score) : ResponseEntity.badRequest().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Score> updateScore(@PathVariable Long id, @RequestBody ScoreUpdate request) {
        Score result = scoreService.updateScore(id, request);
        return result != null ? ResponseEntity.ok(result) : ResponseEntity.notFound().build();
    }

    @PostMapping("/bulk-upload")
    public ResponseEntity<Map<String, Object>> bulkUpload(@RequestParam(name = "subject") String subject,
                                                          @RequestParam(name = "test_name") String testName,
                                                          @RequestParam(name = "test_date") String testDate,
                                                          @RequestParam(name = "max_marks", required = false) Double maxMarks,
                                                          @RequestParam("file") MultipartFile file) {
        try {
            return ResponseEntity.ok(scoreService.bulkUploadScores(subject, testName, testDate, maxMarks, file));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
