package com.edutrack.repository;

import com.edutrack.model.Task;
import com.edutrack.model.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByStudent_Id(Long studentId);
    List<Task> findBySubject(String subject);
    List<Task> findByStudent_IdAndSubject(Long studentId, String subject);
    List<Task> findByStatus(TaskStatus status);
}
