package com.leanquitous.iskool.repositories.communication;

import com.leanquitous.iskool.entity.communication.Circular;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CircularRepository extends JpaRepository<Circular, Long> {
    List<Circular> findBySchoolIdOrderByPublishedDateDesc(Long schoolId);
}
