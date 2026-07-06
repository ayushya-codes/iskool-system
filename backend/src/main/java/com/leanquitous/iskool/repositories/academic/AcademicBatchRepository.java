package com.leanquitous.iskool.repositories.academic;

import com.leanquitous.iskool.entity.academic.AcademicBatch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AcademicBatchRepository extends JpaRepository<AcademicBatch, Long> {

    List<AcademicBatch> findBySchoolIdOrderByStartDateDesc(Long schoolId);

    Optional<AcademicBatch> findBySchoolIdAndIsActiveTrue(Long schoolId);
}
