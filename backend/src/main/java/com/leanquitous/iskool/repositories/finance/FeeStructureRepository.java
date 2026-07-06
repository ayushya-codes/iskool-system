package com.leanquitous.iskool.repositories.finance;

import com.leanquitous.iskool.entity.finance.FeeStructure;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeeStructureRepository extends JpaRepository<FeeStructure, Long> {
    List<FeeStructure> findBySchoolIdAndBatchId(Long schoolId, Long batchId);
    List<FeeStructure> findBySchoolIdAndClassIdAndBatchId(Long schoolId, Long classId, Long batchId);
    List<FeeStructure> findBySchoolIdAndBatchIdAndIsActiveTrue(Long schoolId, Long batchId);
    List<FeeStructure> findBySchoolIdAndClassIdAndBatchIdAndIsActiveTrue(Long schoolId, Long classId, Long batchId);
}
