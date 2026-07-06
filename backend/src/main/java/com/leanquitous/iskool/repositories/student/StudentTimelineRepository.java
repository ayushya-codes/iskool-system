package com.leanquitous.iskool.repositories.student;

import com.leanquitous.iskool.entity.student.StudentTimeline;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentTimelineRepository extends JpaRepository<StudentTimeline, Long> {

    List<StudentTimeline> findBySchoolIdAndStudentIdOrderByEventDateDesc(Long schoolId, Long studentId);
}
