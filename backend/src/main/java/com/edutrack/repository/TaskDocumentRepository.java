package com.edutrack.repository;

import com.edutrack.model.TaskDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskDocumentRepository extends JpaRepository<TaskDocument, Long> {
    List<TaskDocument> findByTask_Id(Long taskId);
}
