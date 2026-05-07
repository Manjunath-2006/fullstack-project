package com.edutrack.service;

import com.edutrack.model.TaskDocument;
import com.edutrack.model.Task;
import com.edutrack.model.User;
import com.edutrack.repository.TaskDocumentRepository;
import com.edutrack.repository.TaskRepository;
import com.edutrack.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Optional;

@Service
public class TaskDocumentService {

    @Autowired
    private TaskDocumentRepository taskDocumentRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    public TaskDocument uploadDocument(Long taskId, Long studentId, MultipartFile file) throws Exception {
        Optional<Task> taskOpt = taskRepository.findById(taskId);
        Optional<User> studentOpt = userRepository.findById(studentId);
        if (taskOpt.isEmpty() || studentOpt.isEmpty()) {
            return null;
        }

        TaskDocument document = new TaskDocument();
        document.setTask(taskOpt.get());
        document.setStudent(studentOpt.get());
        document.setFilename(file.getOriginalFilename());
        document.setContent(Base64.getEncoder().encodeToString(file.getBytes()));
        document.setUploadedAt(LocalDateTime.now());

        return taskDocumentRepository.save(document);
    }

    public Optional<TaskDocument> getDocument(Long documentId) {
        return taskDocumentRepository.findById(documentId);
    }

    public boolean deleteDocument(Long documentId, Long studentId) {
        Optional<TaskDocument> document = taskDocumentRepository.findById(documentId);
        if (document.isPresent() && document.get().getStudentId().equals(studentId)) {
            taskDocumentRepository.delete(document.get());
            return true;
        }
        return false;
    }
}
