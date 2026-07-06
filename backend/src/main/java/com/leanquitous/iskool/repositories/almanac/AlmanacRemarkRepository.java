package com.leanquitous.iskool.repositories.almanac;

import com.leanquitous.iskool.entity.almanac.AlmanacRemark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlmanacRemarkRepository extends JpaRepository<AlmanacRemark, Long> {
    List<AlmanacRemark> findBySchoolIdAndStudentIdOrderByRemarkDateDesc(Long schoolId, Long studentId);
}
