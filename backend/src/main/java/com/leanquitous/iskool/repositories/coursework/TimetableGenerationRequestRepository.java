package com.leanquitous.iskool.repositories.coursework;

import com.leanquitous.iskool.entity.coursework.TimetableGenerationRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TimetableGenerationRequestRepository extends JpaRepository<TimetableGenerationRequest, Long> {
    List<TimetableGenerationRequest> findBySchoolIdAndBatchIdOrderByCreatedAtDesc(Long schoolId, Long batchId);
}
