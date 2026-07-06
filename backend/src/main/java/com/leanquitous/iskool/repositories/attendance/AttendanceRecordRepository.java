package com.leanquitous.iskool.repositories.attendance;

import com.leanquitous.iskool.entity.attendance.AttendanceRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRecordRepository extends JpaRepository<AttendanceRecord, Long> {

    Optional<AttendanceRecord> findBySchoolIdAndStudentIdAndDate(Long schoolId, Long studentId, LocalDate date);

    List<AttendanceRecord> findBySchoolIdAndDivisionIdAndDate(Long schoolId, Long divisionId, LocalDate date);

    List<AttendanceRecord> findBySchoolIdAndStudentIdAndDateBetween(Long schoolId, Long studentId, LocalDate from, LocalDate to);

    List<AttendanceRecord> findBySchoolIdAndDivisionIdAndDateBetween(Long schoolId, Long divisionId, LocalDate from, LocalDate to);
}
