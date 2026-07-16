package com.exam.onlineexamsystem.dto;

public class StudentAnswerRequest {

    private Long studentId;
    private Long questionId;
    private String selectedAnswer;

    public StudentAnswerRequest() {
    }

    public StudentAnswerRequest(Long studentId, Long questionId, String selectedAnswer) {
        this.studentId = studentId;
        this.questionId = questionId;
        this.selectedAnswer = selectedAnswer;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public Long getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }

    public String getSelectedAnswer() {
        return selectedAnswer;
    }

    public void setSelectedAnswer(String selectedAnswer) {
        this.selectedAnswer = selectedAnswer;
    }
}