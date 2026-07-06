package com.leanquitous.iskool.repositories.inventory;

import com.leanquitous.iskool.entity.inventory.InventoryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface InventoryItemRepository extends JpaRepository<InventoryItem, Long> {
    List<InventoryItem> findBySchoolId(Long schoolId);
    List<InventoryItem> findBySchoolIdAndIsActiveTrue(Long schoolId);

    List<InventoryItem> findBySchoolIdAndCategoryIn(Long schoolId, Collection<InventoryItem.Category> categories);
    List<InventoryItem> findBySchoolIdAndCategoryInAndIsActiveTrue(Long schoolId, Collection<InventoryItem.Category> categories);

    List<InventoryItem> findBySchoolIdAndCategory(Long schoolId, InventoryItem.Category category);
    List<InventoryItem> findBySchoolIdAndCategoryAndIsActiveTrue(Long schoolId, InventoryItem.Category category);
}
