package com.exam.onlineexamsystem.repository;

import com.exam.onlineexamsystem.entity.StudentArray;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentArrayRepository extends JpaRepository<StudentArray, Long> {

    Optional<StudentArray> findByStudent_IdAndQuestion_QuestionId(Long studentId, Long questionId);

}