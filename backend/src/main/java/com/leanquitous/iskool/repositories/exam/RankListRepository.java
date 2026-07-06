package com.leanquitous.iskool.repositories.exam;

import com.leanquitous.iskool.entity.exam.RankList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RankListRepository extends JpaRepository<RankList, Long> {
    List<RankList> findBySchoolIdAndExamIdOrderByClassRankAsc(Long schoolId, Long examId);
}
