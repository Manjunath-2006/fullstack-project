package com.edutrack.repository;

import com.edutrack.model.Score;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScoreRepository extends JpaRepository<Score, Long> {
    List<Score> findByStudent_Id(Long studentId);
    List<Score> findBySubject(String subject);
    List<Score> findByStudent_IdAndSubject(Long studentId, String subject);
}
