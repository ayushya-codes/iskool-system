package com.leanquitous.iskool.entity.communication;

import com.leanquitous.iskool.entity.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "media_assets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class MediaAsset extends BaseEntity {

    @Column(name = "gallery_id", nullable = false)
    private Long galleryId;

    @Column(name = "file_url", nullable = false)
    private String fileUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "asset_type", nullable = false)
    private AssetType assetType;

    @Column(name = "uploaded_by_faculty_id", nullable = false)
    private Long uploadedByFacultyId;

    public enum AssetType {
        PHOTO, VIDEO
    }
}
