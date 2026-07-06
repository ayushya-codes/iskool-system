package com.leanquitous.iskool.repositories.coursework;

import com.leanquitous.iskool.entity.coursework.TimetableSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TimetableSlotRepository extends JpaRepository<TimetableSlot, Long> {
    List<TimetableSlot> findBySchoolIdAndDivisionIdOrderByDayOfWeekAscPeriodNumberAsc(Long schoolId, Long divisionId);
    List<TimetableSlot> findBySchoolIdAndTimetableIdOrderByDayOfWeekAscPeriodNumberAsc(Long schoolId, Long timetableId);
    List<TimetableSlot> findBySchoolIdAndFacultyIdAndDayOfWeekOrderByStartTimeAsc(Long schoolId, Long facultyId, Integer dayOfWeek);
}
