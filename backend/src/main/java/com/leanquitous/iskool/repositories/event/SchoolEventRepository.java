package com.leanquitous.iskool.repositories.event;

import com.leanquitous.iskool.entity.event.SchoolEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface SchoolEventRepository extends JpaRepository<SchoolEvent, Long> {

    List<SchoolEvent> findBySchoolIdOrderByEventDateDesc(Long schoolId);

    List<SchoolEvent> findBySchoolIdAndEventDateGreaterThanEqualOrderByEventDateAsc(Long schoolId, LocalDate date);

    List<SchoolEvent> findBySchoolIdAndEventTypeOrderByEventDateDesc(Long schoolId, SchoolEvent.EventType eventType);

    List<SchoolEvent> findBySchoolIdAndEventDateBetweenOrderByEventDateAsc(Long schoolId, LocalDate start, LocalDate end);
}
