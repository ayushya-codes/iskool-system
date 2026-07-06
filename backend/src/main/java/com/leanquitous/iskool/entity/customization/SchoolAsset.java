package com.leanquitous.iskool.entity.customization;

import com.leanquitous.iskool.entity.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "school_assets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class SchoolAsset extends BaseEntity {

    @Column(name = "asset_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private AssetType assetType;

    @Column(name = "file_url", nullable = false)
    private String fileUrl;

    @Column(name = "s3_key", nullable = false)
    private String s3Key;

    @Column(name = "original_filename")
    private String originalFilename;

    @Column(name = "content_type")
    private String contentType;

    @Column(name = "file_size_bytes")
    private Long fileSizeBytes;

    @Column(name = "uploaded_by_user_id")
    private Long uploadedByUserId;

    public enum AssetType {
        LOGO, FAVICON, BANNER, REPORT_CARD_LOGO, CSS, MISC
    }
}
