package com.edutrack.service;

import com.edutrack.dto.ScoreCreate;
import com.edutrack.dto.ScoreUpdate;
import com.edutrack.model.Score;
import com.edutrack.model.User;
import com.edutrack.repository.ScoreRepository;
import com.edutrack.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ScoreService {

    @Autowired
    private ScoreRepository scoreRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Score> getAllScores(Long studentId, String subject) {
        if (studentId != null && subject != null) {
            return scoreRepository.findByStudent_IdAndSubject(studentId, subject);
        }
        if (studentId != null) {
            return scoreRepository.findByStudent_Id(studentId);
        }
        if (subject != null) {
            return scoreRepository.findBySubject(subject);
        }
        return scoreRepository.findAll();
    }

    public Optional<Score> getScoreById(Long id) {
        return scoreRepository.findById(id);
    }

    public Score createScore(ScoreCreate request) {
        Optional<User> studentOpt = userRepository.findById(request.getStudentId());
        if (studentOpt.isEmpty()) {
            return null;
        }
        User student = studentOpt.get();
        Score score = new Score();
        score.setStudent(student);
        score.setRollNumber(request.getRollNumber());
        score.setSubject(request.getSubject());
        score.setTestName(request.getTestName());
        score.setMarks(request.getMarks());
        score.setMaxMarks(request.getMaxMarks() != null ? request.getMaxMarks() : 100.0);
        score.setTestDate(LocalDate.parse(request.getTestDate()));
        return scoreRepository.save(score);
    }

    public Score updateScore(Long id, ScoreUpdate request) {
        Optional<Score> existing = scoreRepository.findById(id);
        if (existing.isPresent()) {
            Score score = existing.get();
            score.setMarks(request.getMarks());
            score.setMaxMarks(request.getMaxMarks() != null ? request.getMaxMarks() : score.getMaxMarks());
            return scoreRepository.save(score);
        }
        return null;
    }

    public Map<String, Object> getScoreSummary(Long studentId) {
        List<Score> scores = scoreRepository.findByStudent_Id(studentId);
        Map<String, Object> summary = new HashMap<>();
        int totalTests = scores.size();
        double avg = 0.0;
        Map<String, Double> bySubject = new HashMap<>();
        Map<String, Integer> count = new HashMap<>();

        for (Score score : scores) {
            avg += score.getMarks();
            bySubject.merge(score.getSubject(), score.getMarks(), Double::sum);
            count.merge(score.getSubject(), 1, Integer::sum);
        }
        if (totalTests > 0) {
            avg = avg / totalTests;
            bySubject.replaceAll((subject, total) -> Math.round(total / count.get(subject) * 100.0) / 100.0);
        }
        summary.put("avg_marks", Math.round(avg * 100.0) / 100.0);
        summary.put("total_tests", totalTests);
        summary.put("by_subject", bySubject);
        return summary;
    }

    public Map<String, Object> bulkUploadScores(String subject, String testName, String testDate, Double maxMarks, MultipartFile file) throws Exception {
        List<String> lines = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))
                .lines()
                .filter(line -> !line.isBlank())
                .collect(Collectors.toList());

        int uploaded = 0;
        int skipped = 0;
        for (String line : lines) {
            if (line.toLowerCase().startsWith("roll_number")) {
                continue;
            }
            String[] parts = line.split(",");
            if (parts.length < 3) {
                skipped++;
                continue;
            }
            String rollNumber = parts[0].trim();
            String marksText = parts[2].trim();
            Optional<User> studentOpt = userRepository.findByRollNumber(rollNumber);
            if (studentOpt.isEmpty()) {
                skipped++;
                continue;
            }
            double marks;
            try {
                marks = Double.parseDouble(marksText);
            } catch (NumberFormatException ex) {
                skipped++;
                continue;
            }
            Score score = new Score();
            score.setStudent(studentOpt.get());
            score.setRollNumber(rollNumber);
            score.setSubject(subject);
            score.setTestName(testName);
            score.setMarks(marks);
            score.setMaxMarks(maxMarks != null ? maxMarks : 100.0);
            score.setTestDate(LocalDate.parse(testDate));
            scoreRepository.save(score);
            uploaded++;
        }
        Map<String, Object> result = new HashMap<>();
        result.put("uploaded", uploaded);
        result.put("skipped", skipped);
        return result;
    }
}
