package com.exam.onlineexamsystem.controller;

import com.exam.onlineexamsystem.dto.StudentAnswerRequest;
import com.exam.onlineexamsystem.entity.StudentArray;
import com.exam.onlineexamsystem.service.StudentArrayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/studentanswers")
public class StudentArrayController {

    @Autowired
    private StudentArrayService studentArrayService;

    @PostMapping
    public StudentArray saveStudentAnswer(@RequestBody StudentAnswerRequest request) {

        if (request.getStudentId() == null || request.getQuestionId() == null) {
            throw new RuntimeException("Student ID and Question ID are required.");
        }

        return studentArrayService.saveStudentAnswer(
                request.getStudentId(),
                request.getQuestionId(),
                request.getSelectedAnswer()
        );
    }

    @GetMapping
    public List<StudentArray> getAllStudentAnswers() {
        return studentArrayService.getAllStudentAnswers();
    }

    @GetMapping("/{id}")
    public StudentArray getStudentAnswerById(@PathVariable Long id) {
        return studentArrayService.getStudentAnswerById(id)
                .orElseThrow(() -> new RuntimeException("Student Answer not found"));
    }

    @DeleteMapping("/{id}")
    public String deleteStudentAnswer(@PathVariable Long id) {
        studentArrayService.deleteStudentAnswer(id);
        return "Student Answer deleted successfully.";
    }
}