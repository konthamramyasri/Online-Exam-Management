package com.exam.onlineexamsystem.controller;

import com.exam.onlineexamsystem.dto.QuestionRequest;
import com.exam.onlineexamsystem.entity.Question;
import com.exam.onlineexamsystem.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/questions")
public class QuestionController {

    @Autowired
    private QuestionService questionService;

    @PostMapping
    public Question saveQuestion(@RequestBody QuestionRequest request) {
        return questionService.saveQuestion(request);
    }

    @GetMapping
    public List<Question> getAllQuestions() {
        return questionService.getAllQuestions();
    }

    @GetMapping("/{id}")
    public Optional<Question> getQuestionById(@PathVariable Long id) {
        return questionService.getQuestionById(id);
    }

    @DeleteMapping("/{id}")
    public String deleteQuestion(@PathVariable Long id) {
        questionService.deleteQuestion(id);
        return "Question deleted successfully";
    }
}