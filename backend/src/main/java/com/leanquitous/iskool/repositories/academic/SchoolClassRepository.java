package com.leanquitous.iskool.repositories.academic;

import com.leanquitous.iskool.entity.academic.SchoolClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SchoolClassRepository extends JpaRepository<SchoolClass, Long> {

    List<SchoolClass> findBySchoolIdOrderByLevelAsc(Long schoolId);
}
