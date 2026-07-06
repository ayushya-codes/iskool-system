package com.leanquitous.iskool.repositories.customization;

import com.leanquitous.iskool.entity.customization.SchoolCustomization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SchoolCustomizationRepository extends JpaRepository<SchoolCustomization, Long> {
    Optional<SchoolCustomization> findBySchoolId(Long schoolId);
}
