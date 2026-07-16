package com.exam.onlineexamsystem.controller;

import com.exam.onlineexamsystem.entity.Exam;
import com.exam.onlineexamsystem.entity.Question;
import com.exam.onlineexamsystem.service.ExamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/exams")
public class ExamController {

    @Autowired
    private ExamService examService;

    @PostMapping
    public Exam saveExam(@RequestBody Exam exam) {
        return examService.saveExam(exam);
    }

    @GetMapping
    public List<Exam> getAllExams() {
        return examService.getAllExams();
    }

    @GetMapping("/{id}")
    public Optional<Exam> getExamById(@PathVariable Long id) {
        return examService.getExamById(id);
    }

    @GetMapping("/{id}/questions")
    public List<Question> getQuestionsForExam(@PathVariable Long id) {
        Exam exam = examService.getExamById(id)
                .orElseThrow(() -> new RuntimeException("Exam not found"));
        return exam.getQuestions();
    }

    @DeleteMapping("/{id}")
    public String deleteExam(@PathVariable Long id) {
        examService.deleteExam(id);
        return "Exam deleted successfully";
    }
}