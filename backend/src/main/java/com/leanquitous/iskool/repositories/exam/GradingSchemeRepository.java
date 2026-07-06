package com.leanquitous.iskool.repositories.exam;

import com.leanquitous.iskool.entity.exam.GradingScheme;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GradingSchemeRepository extends JpaRepository<GradingScheme, Long> {
    List<GradingScheme> findBySchoolIdOrderByMinPercentageDesc(Long schoolId);
    List<GradingScheme> findBySchoolIdAndIsActiveTrueOrderByMinPercentageDesc(Long schoolId);
}
