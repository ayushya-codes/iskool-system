package com.leanquitous.iskool.repositories.almanac;

import com.leanquitous.iskool.entity.almanac.Prayer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrayerRepository extends JpaRepository<Prayer, Long> {
    List<Prayer> findBySchoolId(Long schoolId);
}
