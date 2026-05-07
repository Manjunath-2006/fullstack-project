package com.edutrack.service;

import com.edutrack.dto.TaskCreate;
import com.edutrack.model.Task;
import com.edutrack.model.TaskStatus;
import com.edutrack.model.User;
import com.edutrack.repository.TaskRepository;
import com.edutrack.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Task> getAllTasks(Long studentId, String subject) {
        if (studentId != null && subject != null) {
            return taskRepository.findByStudent_IdAndSubject(studentId, subject);
        }
        if (studentId != null) {
            return taskRepository.findByStudent_Id(studentId);
        }
        if (subject != null) {
            return taskRepository.findBySubject(subject);
        }
        return taskRepository.findAll();
    }

    public Optional<Task> getTaskById(Long id) {
        return taskRepository.findById(id);
    }

    public List<Task> createTasks(TaskCreate request) {
        LocalDateTime dueDateTime = LocalDateTime.parse(request.getDueDateTime(), DateTimeFormatter.ISO_DATE_TIME);
        // Capture as final for lambda use
        final User assignedBy = request.getAssignedBy() != null
                ? userRepository.findById(request.getAssignedBy()).orElse(null)
                : null;

        return request.getStudentIds().stream()
                .map(studentId -> userRepository.findById(studentId).orElse(null))
                .filter(student -> student != null)
                .map(student -> {
                    Task task = new Task();
                    task.setStudent(student);
                    task.setTitle(request.getTitle());
                    task.setDescription(request.getDescription());
                    task.setSubject(request.getSubject());
                    task.setDueDateTime(dueDateTime);
                    task.setAssignedDate(LocalDate.now());
                    task.setAssignedBy(assignedBy);
                    task.setStatus(TaskStatus.PENDING);
                    return taskRepository.save(task);
                })
                .collect(Collectors.toList());
    }

    public Task updateTask(Long id, TaskStatus status) {
        Optional<Task> existing = taskRepository.findById(id);
        if (existing.isPresent()) {
            Task task = existing.get();
            task.setStatus(status);
            return taskRepository.save(task);
        }
        return null;
    }
}
