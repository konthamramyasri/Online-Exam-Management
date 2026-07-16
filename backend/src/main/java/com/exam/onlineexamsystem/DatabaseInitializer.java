package com.exam.onlineexamsystem;

import com.exam.onlineexamsystem.entity.Admin;
import com.exam.onlineexamsystem.entity.Student;
import com.exam.onlineexamsystem.entity.Exam;
import com.exam.onlineexamsystem.entity.Question;
import com.exam.onlineexamsystem.repository.AdminRepository;
import com.exam.onlineexamsystem.repository.StudentRepository;
import com.exam.onlineexamsystem.repository.ExamRepository;
import com.exam.onlineexamsystem.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.ArrayList;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Override
    public void run(String... args) throws Exception {
        if (adminRepository.count() > 0) {
            System.out.println("Database already seeded. Skipping initialization.");
            return;
        }

        System.out.println("Seeding database with sample exams, questions, admin, and student...");

        // 1. Create Admin
        Admin admin = new Admin();
        admin.setName("System Administrator");
        admin.setEmail("admin@exam.com");
        admin.setPassword("admin123");
        admin = adminRepository.save(admin);

        // 2. Create Student
        Student student = new Student();
        student.setName("John Doe");
        student.setEmail("john@student.com");
        student.setPassword("student123");
        student.setDateOfBirth(LocalDate.of(2000, 1, 1));
        studentRepository.save(student);

        // 3. Create Exam 1: Java Core & OOP
        Exam javaExam = new Exam();
        javaExam.setTitle("Java Core & OOP Concepts");
        javaExam.setDescription("Test your knowledge of core Java syntax, classes, interfaces, inheritance, polymorphism, and exception handling.");
        javaExam.setDurationMinutes(15);
        javaExam.setTotalMarks(25);
        javaExam.setPassMarks(15);
        javaExam.setStartDate(LocalDate.now());
        javaExam.setEndDate(LocalDate.now().plusYears(1));
        javaExam.setAdmin(admin);
        javaExam = examRepository.save(javaExam);

        // Questions for Java Exam
        createQuestion(javaExam, "Which of the following is NOT a Java access modifier?", 
                "A) public", "B) protected", "C) friendly", "D) private", "C", 5);
        createQuestion(javaExam, "What is the default value of an instance variable of type float in Java?", 
                "A) 0.0f", "B) 0.0d", "C) null", "D) Not defined", "A", 5);
        createQuestion(javaExam, "Which keyword is used to inherit a class in Java?", 
                "A) implements", "B) extends", "C) inherits", "D) imports", "B", 5);
        createQuestion(javaExam, "Which of these classes is a subclass of the Exception class?", 
                "A) RuntimeException", "B) Error", "C) Throwable", "D) System", "A", 5);
        createQuestion(javaExam, "Which of the following is true about abstract classes?", 
                "A) They can be instantiated directly", "B) They cannot have concrete methods", 
                "C) They can have abstract methods as well as concrete methods", "D) They must contain only abstract methods", "C", 5);

        // 4. Create Exam 2: Web Architecture & REST
        Exam webExam = new Exam();
        webExam.setTitle("Web Architecture & REST APIs");
        webExam.setDescription("Covers HTTP protocol rules, REST architectural constraints, JSON headers, and HTTP status codes.");
        webExam.setDurationMinutes(10);
        webExam.setTotalMarks(20);
        webExam.setPassMarks(12);
        webExam.setStartDate(LocalDate.now());
        webExam.setEndDate(LocalDate.now().plusYears(1));
        webExam.setAdmin(admin);
        webExam = examRepository.save(webExam);

        // Questions for Web Exam
        createQuestion(webExam, "Which HTTP status code represents '201 Created'?", 
                "A) 200 OK", "B) 201 Created", "C) 202 Accepted", "D) 204 No Content", "B", 5);
        createQuestion(webExam, "What does REST stand for?", 
                "A) Representational State Transfer", "B) Remote Exception System Transfer", 
                "C) Resident State Terminal", "D) Relational Standard Transfer", "A", 5);
        createQuestion(webExam, "Which HTTP method is typically used to update an existing resource fully?", 
                "A) GET", "B) POST", "C) PUT", "D) DELETE", "C", 5);
        createQuestion(webExam, "Which header field specifies the media type of the resource being sent in the body?", 
                "A) Accept", "B) Content-Type", "C) Authorization", "D) Cache-Control", "B", 5);

        // 5. Create Exam 3: Data Structures & Algorithms
        Exam dsaExam = new Exam();
        dsaExam.setTitle("Data Structures & Algorithms");
        dsaExam.setDescription("Evaluates basic understanding of Arrays, Linked Lists, Stacks, Trees, and Big O notation.");
        dsaExam.setDurationMinutes(20);
        dsaExam.setTotalMarks(15);
        dsaExam.setPassMarks(10);
        dsaExam.setStartDate(LocalDate.now());
        dsaExam.setEndDate(LocalDate.now().plusYears(1));
        dsaExam.setAdmin(admin);
        dsaExam = examRepository.save(dsaExam);

        // Questions for DSA Exam
        createQuestion(dsaExam, "What is the worst-case time complexity of sorting an array using Merge Sort?", 
                "A) O(n)", "B) O(n log n)", "C) O(n^2)", "D) O(1)", "B", 5);
        createQuestion(dsaExam, "Which data structure operates on a Last-In-First-Out (LIFO) basis?", 
                "A) Queue", "B) Stack", "C) Tree", "D) Graph", "B", 5);
        createQuestion(dsaExam, "What is the worst-case time complexity of searching in a balanced Binary Search Tree (BST)?", 
                "A) O(1)", "B) O(log n)", "C) O(n)", "D) O(n log n)", "B", 5);

        System.out.println("Seeding completed successfully!");
    }

    private void createQuestion(Exam exam, String text, String optA, String optB, String optC, String optD, String correct, int marks) {
        Question q = new Question();
        q.setExam(exam);
        q.setQuestionText(text);
        q.setOptionA(optA);
        q.setOptionB(optB);
        q.setOptionC(optC);
        q.setOptionD(optD);
        q.setCorrectAnswer(correct);
        q.setMarks(marks);
        questionRepository.save(q);
    }
}
