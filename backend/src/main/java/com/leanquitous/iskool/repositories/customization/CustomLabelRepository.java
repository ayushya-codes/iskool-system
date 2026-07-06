package com.leanquitous.iskool.repositories.customization;

import com.leanquitous.iskool.entity.customization.CustomLabel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomLabelRepository extends JpaRepository<CustomLabel, Long> {
    List<CustomLabel> findBySchoolIdAndLanguage(Long schoolId, String language);
    List<CustomLabel> findBySchoolId(Long schoolId);
    Optional<CustomLabel> findBySchoolIdAndLabelKeyAndLanguage(Long schoolId, String labelKey, String language);
}
