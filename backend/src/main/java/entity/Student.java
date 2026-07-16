package com.exam.onlineexamsystem.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.util.List;
import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Student name is required")
    private String name;

    @Email(message = "Enter a valid email")
    @NotBlank(message = "Email is required")
    @Column(unique = true)
    private String email;

    @Size(min = 6, max = 20, message = "Password must be between 6 and 20 characters")
    @NotBlank(message = "Password is required")
    private String password;

    @Past(message = "Date of Birth must be in the past")
    private LocalDate dateOfBirth;

    @JsonIgnore
    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
    private List<Result> results;
    @JsonIgnore
    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
    private List<StudentArray> studentAnswers;

    public List<StudentArray> getStudentAnswers() {
        return studentAnswers;
    }

    public void setStudentAnswers(List<StudentArray> studentAnswers) {
        this.studentAnswers = studentAnswers;
    }

    public List<Result> getResults() {
        return results;
    }

    public void setResults(List<Result> results) {
        this.results = results;
    }

    public Student() {
    }

    public Student(Long id, String name, String email, String password, LocalDate dateOfBirth) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.dateOfBirth = dateOfBirth;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }
}