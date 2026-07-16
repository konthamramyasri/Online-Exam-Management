package com.exam.onlineexamsystem.repository;

import com.exam.onlineexamsystem.entity.Result;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ResultRepository extends JpaRepository<Result, Long> {

    Optional<Result> findByStudent_IdAndExam_ExamId(Long studentId, Long examId);
}