package com.exam.onlineexamsystem.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import com.fasterxml.jackson.annotation.JsonIgnore;
@Entity
@Table(name = "student_answers")
public class StudentArray {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long answerId;

    @NotBlank(message = "Selected answer is required")
    private String selectedAnswer;

    @ManyToOne
    @JoinColumn(name = "student_id")
    @JsonIgnore
    private Student student;

    @ManyToOne
    @JoinColumn(name = "question_id")
    @JsonIgnore
    private Question question;

    public Question getQuestion() {
        return question;
    }
    public void setQuestion(Question question) {
        this.question = question;
    }
    public Student getStudent() {
        return student;
    }
    public void setStudent(Student student) {
        this.student = student;
    }

    public StudentArray() {
    }

    public StudentArray(Long answerId, String selectedAnswer) {
        this.answerId = answerId;
        this.selectedAnswer = selectedAnswer;
    }

    public Long getAnswerId() {
        return answerId;
    }

    public void setAnswerId(Long answerId) {
        this.answerId = answerId;
    }

    public String getSelectedAnswer() {
        return selectedAnswer;
    }

    public void setSelectedAnswer(String selectedAnswer) {
        this.selectedAnswer = selectedAnswer;
    }

    @com.fasterxml.jackson.annotation.JsonProperty("studentId")
    public Long getStudentId() {
        return student != null ? student.getId() : null;
    }

    @com.fasterxml.jackson.annotation.JsonProperty("questionId")
    public Long getQuestionId() {
        return question != null ? question.getQuestionId() : null;
    }
}