package com.leanquitous.iskool.repositories.customization;

import com.leanquitous.iskool.entity.customization.SchoolAsset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SchoolAssetRepository extends JpaRepository<SchoolAsset, Long> {
    List<SchoolAsset> findBySchoolId(Long schoolId);
    List<SchoolAsset> findBySchoolIdAndAssetType(Long schoolId, SchoolAsset.AssetType assetType);
}
