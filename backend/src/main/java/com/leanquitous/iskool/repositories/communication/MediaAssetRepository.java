package com.leanquitous.iskool.repositories.communication;

import com.leanquitous.iskool.entity.communication.MediaAsset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MediaAssetRepository extends JpaRepository<MediaAsset, Long> {
    List<MediaAsset> findBySchoolIdAndGalleryId(Long schoolId, Long galleryId);
}
