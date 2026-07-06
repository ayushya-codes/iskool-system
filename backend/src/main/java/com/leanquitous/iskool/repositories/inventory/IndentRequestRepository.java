package com.leanquitous.iskool.repositories.inventory;

import com.leanquitous.iskool.entity.inventory.IndentRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IndentRequestRepository extends JpaRepository<IndentRequest, Long> {
    List<IndentRequest> findBySchoolIdAndFacultyId(Long schoolId, Long facultyId);
    List<IndentRequest> findBySchoolIdAndStatus(Long schoolId, IndentRequest.Status status);
}
