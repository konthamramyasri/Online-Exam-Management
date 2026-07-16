package com.exam.onlineexamsystem.service;

import com.exam.onlineexamsystem.entity.Student;
import com.exam.onlineexamsystem.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    // Register Student
    public Student registerStudent(Student student) {

        if (studentRepository.existsByEmail(student.getEmail())) {
            throw new RuntimeException("Email already exists!");
        }

        return studentRepository.save(student);
    }

    public Student loginStudent(String email, String password) {

        Optional<Student> student =
                studentRepository.findByEmailAndPassword(email, password);

        if (student.isPresent()) {
            return student.get();
        } else {
            throw new RuntimeException("Invalid Email or Password");
        }
    }

    // Save Student
    public Student saveStudent(Student student) {
        return studentRepository.save(student);
    }

    // Get All Students
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    // Get Student By ID
    public Optional<Student> getStudentById(Long id) {
        return studentRepository.findById(id);
    }

    // Delete Student
    public void deleteStudent(Long id) {
        studentRepository.deleteById(id);
    }
}