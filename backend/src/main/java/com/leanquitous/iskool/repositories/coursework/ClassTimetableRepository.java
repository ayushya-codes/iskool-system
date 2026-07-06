package com.leanquitous.iskool.repositories.coursework;

import com.leanquitous.iskool.entity.coursework.ClassTimetable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClassTimetableRepository extends JpaRepository<ClassTimetable, Long> {
    List<ClassTimetable> findBySchoolIdAndBatchId(Long schoolId, Long batchId);
}
