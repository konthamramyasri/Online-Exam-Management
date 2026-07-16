package com.exam.onlineexamsystem.controller;

import com.exam.onlineexamsystem.dto.ResultRequest;
import com.exam.onlineexamsystem.entity.Result;
import com.exam.onlineexamsystem.service.ResultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/results")
public class ResultController {

    @Autowired
    private ResultService resultService;

    @PostMapping
    public Result generateResult(@RequestBody ResultRequest request) {

        return resultService.generateResult(
                request.getStudentId(),
                request.getExamId()
        );
    }

    @GetMapping
    public List<Result> getAllResults() {
        return resultService.getAllResults();
    }

    @GetMapping("/{id}")
    public Optional<Result> getResultById(@PathVariable Long id) {
        return resultService.getResultById(id);
    }

    @DeleteMapping("/{id}")
    public String deleteResult(@PathVariable Long id) {
        resultService.deleteResult(id);
        return "Result deleted successfully";
    }
}