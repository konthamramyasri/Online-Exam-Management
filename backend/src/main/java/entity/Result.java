package com.exam.onlineexamsystem.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.PositiveOrZero;

import java.time.LocalDate;

@Entity
@Table(name = "results")
public class Result {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long resultId;

    @PositiveOrZero(message = "Marks cannot be negative")
    private Integer marksObtained;

    @Max(value = 100, message = "Percentage cannot exceed 100")
    private Integer percentage;

    @PastOrPresent(message = "Submission date cannot be in the future")
    private LocalDate submissionDate;

    private Boolean passed;

    @ManyToOne
    @JoinColumn(name = "student_id")
    @JsonIgnore
    private Student student;

    @ManyToOne
    @JoinColumn(name = "exam_id")
    @JsonIgnore
    private Exam exam;

    public Result() {
    }

    public Result(Long resultId, Integer marksObtained, Integer percentage,
                  LocalDate submissionDate, Boolean passed,
                  Student student, Exam exam) {
        this.resultId = resultId;
        this.marksObtained = marksObtained;
        this.percentage = percentage;
        this.submissionDate = submissionDate;
        this.passed = passed;
        this.student = student;
        this.exam = exam;
    }

    public Long getResultId() {
        return resultId;
    }

    public void setResultId(Long resultId) {
        this.resultId = resultId;
    }

    public Integer getMarksObtained() {
        return marksObtained;
    }

    public void setMarksObtained(Integer marksObtained) {
        this.marksObtained = marksObtained;
    }

    public Integer getPercentage() {
        return percentage;
    }

    public void setPercentage(Integer percentage) {
        this.percentage = percentage;
    }

    public LocalDate getSubmissionDate() {
        return submissionDate;
    }

    public void setSubmissionDate(LocalDate submissionDate) {
        this.submissionDate = submissionDate;
    }

    public Boolean getPassed() {
        return passed;
    }

    public void setPassed(Boolean passed) {
        this.passed = passed;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public Exam getExam() {
        return exam;
    }

    public void setExam(Exam exam) {
        this.exam = exam;
    }

    @com.fasterxml.jackson.annotation.JsonProperty("studentId")
    public Long getStudentId() {
        return student != null ? student.getId() : null;
    }

    @com.fasterxml.jackson.annotation.JsonProperty("studentName")
    public String getStudentName() {
        return student != null ? student.getName() : null;
    }

    @com.fasterxml.jackson.annotation.JsonProperty("examId")
    public Long getExamId() {
        return exam != null ? exam.getExamId() : null;
    }

    @com.fasterxml.jackson.annotation.JsonProperty("examTitle")
    public String getExamTitle() {
        return exam != null ? exam.getTitle() : null;
    }
}