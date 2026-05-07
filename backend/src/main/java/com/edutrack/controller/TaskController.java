package com.edutrack.controller;

import com.edutrack.dto.TaskCreate;
import com.edutrack.dto.TaskUpdate;
import com.edutrack.model.Task;
import com.edutrack.model.TaskDocument;
import com.edutrack.service.TaskDocumentService;
import com.edutrack.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @Autowired
    private TaskDocumentService taskDocumentService;

    @GetMapping
    public List<Task> getTasks(@RequestParam(name = "student_id", required = false) Long studentId,
                               @RequestParam(name = "subject", required = false) String subject) {
        return taskService.getAllTasks(studentId, subject);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getTask(@PathVariable Long id) {
        Optional<Task> task = taskService.getTaskById(id);
        return task.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<List<Task>> createTask(@RequestBody TaskCreate request) {
        List<Task> tasks = taskService.createTasks(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(tasks);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @RequestBody TaskUpdate request) {
        Task result = taskService.updateTask(id, request.getStatus());
        return result != null ? ResponseEntity.ok(result) : ResponseEntity.notFound().build();
    }

    @PostMapping("/{taskId}/documents")
    public ResponseEntity<TaskDocument> uploadDocument(@PathVariable Long taskId,
                                                       @RequestParam("student_id") Long studentId,
                                                       @RequestParam("file") MultipartFile file) {
        try {
            TaskDocument document = taskDocumentService.uploadDocument(taskId, studentId, file);
            if (document == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.status(HttpStatus.CREATED).body(document);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/documents/{docId}")
    public ResponseEntity<Map<String, Object>> getDocument(@PathVariable Long docId) {
        Optional<TaskDocument> document = taskDocumentService.getDocument(docId);
        if (document.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Map<String, Object> response = new HashMap<>();
        response.put("id", document.get().getId());
        response.put("task_id", document.get().getTaskId());
        response.put("student_id", document.get().getStudentId());
        response.put("filename", document.get().getFilename());
        response.put("content", document.get().getContent());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/documents/{docId}")
    public ResponseEntity<Map<String, Object>> deleteDocument(@PathVariable Long docId,
                                                              @RequestParam("student_id") Long studentId) {
        boolean deleted = taskDocumentService.deleteDocument(docId, studentId);
        if (!deleted) {
            return ResponseEntity.notFound().build();
        }
        Map<String, Object> response = new HashMap<>();
        response.put("deleted", true);
        return ResponseEntity.ok(response);
    }
}
