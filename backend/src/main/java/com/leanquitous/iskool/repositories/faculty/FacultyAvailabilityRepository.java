package com.leanquitous.iskool.repositories.faculty;

import com.leanquitous.iskool.entity.faculty.FacultyAvailability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FacultyAvailabilityRepository extends JpaRepository<FacultyAvailability, Long> {

    List<FacultyAvailability> findBySchoolIdAndFacultyId(Long schoolId, Long facultyId);
}
