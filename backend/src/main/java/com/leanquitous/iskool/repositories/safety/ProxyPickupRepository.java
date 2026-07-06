package com.leanquitous.iskool.repositories.safety;

import com.leanquitous.iskool.entity.safety.ProxyPickup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ProxyPickupRepository extends JpaRepository<ProxyPickup, Long> {
    List<ProxyPickup> findBySchoolIdAndStudentId(Long schoolId, Long studentId);
    List<ProxyPickup> findBySchoolIdAndValidDate(Long schoolId, LocalDate validDate);
}
