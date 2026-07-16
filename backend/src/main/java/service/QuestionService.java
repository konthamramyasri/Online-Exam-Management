package com.exam.onlineexamsystem.service;

import com.exam.onlineexamsystem.dto.QuestionRequest;
import com.exam.onlineexamsystem.entity.Exam;
import com.exam.onlineexamsystem.entity.Question;
import com.exam.onlineexamsystem.repository.ExamRepository;
import com.exam.onlineexamsystem.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class QuestionService {

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private ExamRepository examRepository;

    public Question saveQuestion(Question question) {
        return questionRepository.save(question);
    }

    public Question saveQuestion(QuestionRequest request) {
        if (request.getExamId() == null) {
            throw new RuntimeException("examId is required");
        }
        Exam exam = examRepository.findById(request.getExamId())
                .orElseThrow(() -> new RuntimeException("Exam not found"));

        Question question = request.getQuestionId() != null
                ? questionRepository.findById(request.getQuestionId())
                        .orElseThrow(() -> new RuntimeException("Question not found"))
                : new Question();

        question.setExam(exam);
        question.setQuestionText(request.getQuestionText());
        question.setOptionA(request.getOptionA());
        question.setOptionB(request.getOptionB());
        question.setOptionC(request.getOptionC());
        question.setOptionD(request.getOptionD());
        question.setCorrectAnswer(request.getCorrectAnswer());
        question.setMarks(request.getMarks());

        return questionRepository.save(question);
    }

    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    public Optional<Question> getQuestionById(Long id) {
        return questionRepository.findById(id);
    }

    public void deleteQuestion(Long id) {
        questionRepository.deleteById(id);
    }
}