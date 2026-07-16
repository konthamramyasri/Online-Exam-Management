package com.exam.onlineexamsystem.repository;

import com.exam.onlineexamsystem.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    Optional<Student> findByEmail(String email);

    boolean existsByEmail(String email);

    Optional<Student> findByEmailAndPassword(String email, String password);
}