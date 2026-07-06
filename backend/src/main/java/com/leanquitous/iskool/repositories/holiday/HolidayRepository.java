package com.leanquitous.iskool.repositories.holiday;

import com.leanquitous.iskool.entity.holiday.Holiday;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface HolidayRepository extends JpaRepository<Holiday, Long> {

    List<Holiday> findBySchoolIdOrderByHolidayDateAsc(Long schoolId);

    List<Holiday> findBySchoolIdAndHolidayDateBetween(Long schoolId, LocalDate start, LocalDate end);
}
