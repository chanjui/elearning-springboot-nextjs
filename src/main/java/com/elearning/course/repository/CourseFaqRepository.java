package com.elearning.course.repository;

import com.elearning.course.entity.CourseFaq;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

public interface CourseFaqRepository extends JpaRepository<CourseFaq, Long> {

    List<CourseFaq> findByCourseId(Long courseId);

    @Transactional
    default void deleteByCourseId(Long courseId) {
        List<CourseFaq> faqs = findByCourseId(courseId);
        deleteAll(faqs);
    }
}