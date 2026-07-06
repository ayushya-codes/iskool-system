package com.leanquitous.iskool.repositories.coursework;

import com.leanquitous.iskool.entity.coursework.SubjectPeriodRequirement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubjectPeriodRequirementRepository extends JpaRepository<SubjectPeriodRequirement, Long> {
    List<SubjectPeriodRequirement> findBySchoolIdAndBatchIdAndDivisionId(Long schoolId, Long batchId, Long divisionId);
}
