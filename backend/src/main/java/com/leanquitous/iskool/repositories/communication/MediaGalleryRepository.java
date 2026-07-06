package com.leanquitous.iskool.repositories.communication;

import com.leanquitous.iskool.entity.communication.MediaGallery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MediaGalleryRepository extends JpaRepository<MediaGallery, Long> {
    List<MediaGallery> findBySchoolIdOrderByEventDateDesc(Long schoolId);
    List<MediaGallery> findBySchoolIdAndIsApproved(Long schoolId, Boolean isApproved);
    List<MediaGallery> findBySchoolIdAndIsActiveTrueOrderByEventDateDesc(Long schoolId);
    List<MediaGallery> findBySchoolIdAndIsApprovedAndIsActiveTrue(Long schoolId, Boolean isApproved);
}
