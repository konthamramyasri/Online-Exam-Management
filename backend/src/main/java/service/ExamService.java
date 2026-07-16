package com.exam.onlineexamsystem.service;

import com.exam.onlineexamsystem.entity.Exam;
import com.exam.onlineexamsystem.repository.ExamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ExamService {

    @Autowired
    private ExamRepository examRepository;

    public Exam saveExam(Exam exam) {
        return examRepository.save(exam);
    }

    public List<Exam> getAllExams() {
        return examRepository.findAll();
    }

    public Optional<Exam> getExamById(Long id) {
        return examRepository.findById(id);
    }

    public Exam updateExam(Long id, Exam exam) {
        exam.setExamId(id);
        return examRepository.save(exam);
    }

    public void deleteExam(Long id) {
        examRepository.deleteById(id);
    }
}