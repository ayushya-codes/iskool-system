package com.leanquitous.iskool.repositories.safety;

import com.leanquitous.iskool.entity.safety.GatePass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface GatePassRepository extends JpaRepository<GatePass, Long> {
    Optional<GatePass> findBySchoolIdAndPassCodeAndValidDate(Long schoolId, String passCode, LocalDate validDate);
    List<GatePass> findBySchoolIdAndStudentId(Long schoolId, Long studentId);
}
