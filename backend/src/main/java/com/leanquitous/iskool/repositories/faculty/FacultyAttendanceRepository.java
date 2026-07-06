package com.leanquitous.iskool.repositories.faculty;

import com.leanquitous.iskool.entity.faculty.FacultyAttendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface FacultyAttendanceRepository extends JpaRepository<FacultyAttendance, Long> {

    Optional<FacultyAttendance> findBySchoolIdAndFacultyIdAndDate(Long schoolId, Long facultyId, LocalDate date);

    List<FacultyAttendance> findBySchoolIdAndFacultyIdAndDateBetween(Long schoolId, Long facultyId, LocalDate from, LocalDate to);
}
