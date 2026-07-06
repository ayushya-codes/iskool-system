package com.leanquitous.iskool.repositories.academic;

import com.leanquitous.iskool.entity.academic.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {

    List<Subject> findBySchoolIdOrderByNameAsc(Long schoolId);
}
