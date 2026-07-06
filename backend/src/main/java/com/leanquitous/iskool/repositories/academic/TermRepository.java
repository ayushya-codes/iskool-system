package com.leanquitous.iskool.repositories.academic;

import com.leanquitous.iskool.entity.academic.Term;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TermRepository extends JpaRepository<Term, Long> {

    List<Term> findBySchoolIdAndBatchIdOrderByStartDateAsc(Long schoolId, Long batchId);
}
