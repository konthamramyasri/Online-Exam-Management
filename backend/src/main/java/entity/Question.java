package com.exam.onlineexamsystem.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

import java.util.List;

@Entity
@Table(name = "questions")
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long questionId;

    @NotBlank(message = "Question text is required")
    private String questionText;

    @NotBlank(message = "Option A is required")
    private String optionA;

    @NotBlank(message = "Option B is required")
    private String optionB;

    @NotBlank(message = "Option C is required")
    private String optionC;

    @NotBlank(message = "Option D is required")
    private String optionD;

    @NotBlank(message = "Correct answer is required")
    private String correctAnswer;

    @Positive(message = "Marks must be greater than 0")
    private Integer marks;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "exam_id")
    private Exam exam;

    @JsonIgnore
    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL)
    private List<StudentArray> studentAnswers;

    public Question() {
    }

    public Question(Long questionId, String questionText, String optionA,
                    String optionB, String optionC, String optionD,
                    String correctAnswer, Integer marks) {
        this.questionId = questionId;
        this.questionText = questionText;
        this.optionA = optionA;
        this.optionB = optionB;
        this.optionC = optionC;
        this.optionD = optionD;
        this.correctAnswer = correctAnswer;
        this.marks = marks;
    }

    public Long getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }

    public String getQuestionText() {
        return questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public String getOptionA() {
        return optionA;
    }

    public void setOptionA(String optionA) {
        this.optionA = optionA;
    }

    public String getOptionB() {
        return optionB;
    }

    public void setOptionB(String optionB) {
        this.optionB = optionB;
    }

    public String getOptionC() {
        return optionC;
    }

    public void setOptionC(String optionC) {
        this.optionC = optionC;
    }

    public String getOptionD() {
        return optionD;
    }

    public void setOptionD(String optionD) {
        this.optionD = optionD;
    }

    public String getCorrectAnswer() {
        return correctAnswer;
    }

    public void setCorrectAnswer(String correctAnswer) {
        this.correctAnswer = correctAnswer;
    }

    public Integer getMarks() {
        return marks;
    }

    public void setMarks(Integer marks) {
        this.marks = marks;
    }

    public Exam getExam() {
        return exam;
    }

    public void setExam(Exam exam) {
        this.exam = exam;
    }

    @com.fasterxml.jackson.annotation.JsonProperty("examId")
    public Long getExamId() {
        return exam != null ? exam.getExamId() : null;
    }

    public List<StudentArray> getStudentAnswers() {
        return studentAnswers;
    }

    public void setStudentAnswers(List<StudentArray> studentAnswers) {
        this.studentAnswers = studentAnswers;
    }
}