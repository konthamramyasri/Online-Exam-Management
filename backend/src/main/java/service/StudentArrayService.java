package com.exam.onlineexamsystem.service;

import com.exam.onlineexamsystem.entity.Question;
import com.exam.onlineexamsystem.entity.Student;
import com.exam.onlineexamsystem.entity.StudentArray;
import com.exam.onlineexamsystem.repository.QuestionRepository;
import com.exam.onlineexamsystem.repository.StudentArrayRepository;
import com.exam.onlineexamsystem.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StudentArrayService {

    @Autowired
    private StudentArrayRepository studentArrayRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private QuestionRepository questionRepository;

    public StudentArray saveStudentAnswer(Long studentId, Long questionId, String selectedAnswer) {

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        StudentArray answer = studentArrayRepository
                .findByStudent_IdAndQuestion_QuestionId(studentId, questionId)
                .orElseGet(StudentArray::new);

        answer.setStudent(student);
        answer.setQuestion(question);
        answer.setSelectedAnswer(selectedAnswer);

        return studentArrayRepository.save(answer);
    }

    public List<StudentArray> getAllStudentAnswers() {
        return studentArrayRepository.findAll();
    }

    public Optional<StudentArray> getStudentAnswerById(Long id) {
        return studentArrayRepository.findById(id);
    }

    public void deleteStudentAnswer(Long id) {
        studentArrayRepository.deleteById(id);
    }
}