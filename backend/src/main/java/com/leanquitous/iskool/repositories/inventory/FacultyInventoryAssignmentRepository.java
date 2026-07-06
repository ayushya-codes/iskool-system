package com.leanquitous.iskool.repositories.inventory;

import com.leanquitous.iskool.entity.inventory.FacultyInventoryAssignment;
import com.leanquitous.iskool.entity.inventory.InventoryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FacultyInventoryAssignmentRepository extends JpaRepository<FacultyInventoryAssignment, Long> {

    List<FacultyInventoryAssignment> findBySchoolIdAndFacultyUserId(Long schoolId, Long facultyUserId);

    boolean existsBySchoolIdAndFacultyUserIdAndCategory(Long schoolId, Long facultyUserId, InventoryItem.Category category);

    void deleteBySchoolIdAndFacultyUserIdAndCategory(Long schoolId, Long facultyUserId, InventoryItem.Category category);
}
