package com.exam.onlineexamsystem.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "exams")
public class Exam {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long examId;

    @NotBlank(message = "Exam title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @Positive(message = "Duration must be greater than 0")
    private Integer durationMinutes;

    @Positive(message = "Total marks must be greater than 0")
    private Integer totalMarks;

    @Positive(message = "Pass marks must be greater than 0")
    private Integer passMarks;

    @FutureOrPresent(message = "Start date must be today or in the future")
    private LocalDate startDate;

    @Future(message = "End date must be in the future")
    private LocalDate endDate;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "admin_id")
    private Admin admin;

    @JsonIgnore
    @OneToMany(mappedBy = "exam", cascade = CascadeType.ALL)
    private List<Question> questions;

    public Exam() {
    }

    public Exam(Long examId, String title, String description,
                Integer durationMinutes, Integer totalMarks,
                Integer passMarks, LocalDate startDate,
                LocalDate endDate) {
        this.examId = examId;
        this.title = title;
        this.description = description;
        this.durationMinutes = durationMinutes;
        this.totalMarks = totalMarks;
        this.passMarks = passMarks;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    public Long getExamId() {
        return examId;
    }

    public void setExamId(Long examId) {
        this.examId = examId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public Integer getTotalMarks() {
        return totalMarks;
    }

    public void setTotalMarks(Integer totalMarks) {
        this.totalMarks = totalMarks;
    }

    public Integer getPassMarks() {
        return passMarks;
    }

    public void setPassMarks(Integer passMarks) {
        this.passMarks = passMarks;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public Admin getAdmin() {
        return admin;
    }

    public void setAdmin(Admin admin) {
        this.admin = admin;
    }

    public List<Question> getQuestions() {
        return questions;
    }

    public void setQuestions(List<Question> questions) {
        this.questions = questions;
    }
}