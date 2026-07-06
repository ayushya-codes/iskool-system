package com.leanquitous.iskool.repositories.faculty;

import com.leanquitous.iskool.entity.faculty.Faculty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FacultyRepository extends JpaRepository<Faculty, Long> {

    List<Faculty> findBySchoolId(Long schoolId);

    Optional<Faculty> findBySchoolIdAndUserId(Long schoolId, Long userId);
}
