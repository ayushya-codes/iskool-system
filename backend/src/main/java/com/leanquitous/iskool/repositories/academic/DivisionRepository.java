package com.leanquitous.iskool.repositories.academic;

import com.leanquitous.iskool.entity.academic.Division;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DivisionRepository extends JpaRepository<Division, Long> {

    List<Division> findBySchoolIdAndClassIdOrderByNameAsc(Long schoolId, Long classId);
}
