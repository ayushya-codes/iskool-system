package com.leanquitous.iskool.repositories.coursework;

import com.leanquitous.iskool.entity.coursework.SyllabusLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SyllabusLogRepository extends JpaRepository<SyllabusLog, Long> {
    List<SyllabusLog> findBySchoolIdAndDivisionIdAndSubjectIdOrderByDateDesc(Long schoolId, Long divisionId, Long subjectId);
    List<SyllabusLog> findBySchoolIdAndDivisionIdInOrderByDateDesc(Long schoolId, List<Long> divisionIds);
}
