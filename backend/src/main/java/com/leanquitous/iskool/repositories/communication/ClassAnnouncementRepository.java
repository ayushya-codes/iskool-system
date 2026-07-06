package com.leanquitous.iskool.repositories.communication;

import com.leanquitous.iskool.entity.communication.ClassAnnouncement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClassAnnouncementRepository extends JpaRepository<ClassAnnouncement, Long> {
    List<ClassAnnouncement> findBySchoolIdAndDivisionIdOrderByCreatedAtDesc(Long schoolId, Long divisionId);
}
