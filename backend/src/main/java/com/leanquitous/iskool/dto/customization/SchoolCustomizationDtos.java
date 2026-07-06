package com.leanquitous.iskool.dto.customization;

import com.leanquitous.iskool.entity.customization.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.List;

public class SchoolCustomizationDtos {

    // ── Customization (Theme) ──
    @Data @Builder @AllArgsConstructor
    public static class CustomizationResponse {
        private Long id; private Long schoolId;
        private String faviconUrl; private String bannerUrl; private String reportCardLogoUrl;
        private String fontFamily; private String headingFontFamily;
        private String accentColor; private String backgroundColor; private String sidebarColor;
        private String cssOverrides; private String dateFormat; private String timeFormat; private String locale;
        private Boolean enableFinance; private Boolean enableHelpdesk; private Boolean enableInventory;
        private Boolean enableAlmanac; private Boolean enableCommunication; private Boolean enableSafety;
        public static CustomizationResponse from(SchoolCustomization c) {
            return CustomizationResponse.builder()
                    .id(c.getId()).schoolId(c.getSchoolId())
                    .faviconUrl(c.getFaviconUrl()).bannerUrl(c.getBannerUrl()).reportCardLogoUrl(c.getReportCardLogoUrl())
                    .fontFamily(c.getFontFamily()).headingFontFamily(c.getHeadingFontFamily())
                    .accentColor(c.getAccentColor()).backgroundColor(c.getBackgroundColor()).sidebarColor(c.getSidebarColor())
                    .cssOverrides(c.getCssOverrides()).dateFormat(c.getDateFormat()).timeFormat(c.getTimeFormat()).locale(c.getLocale())
                    .enableFinance(c.getEnableFinance()).enableHelpdesk(c.getEnableHelpdesk()).enableInventory(c.getEnableInventory())
                    .enableAlmanac(c.getEnableAlmanac()).enableCommunication(c.getEnableCommunication()).enableSafety(c.getEnableSafety())
                    .build();
        }
    }
    @Data
    public static class CustomizationRequest {
        private String faviconUrl; private String bannerUrl; private String reportCardLogoUrl;
        private String fontFamily; private String headingFontFamily;
        private String accentColor; private String backgroundColor; private String sidebarColor;
        private String cssOverrides; private String dateFormat; private String timeFormat; private String locale;
        private Boolean enableFinance; private Boolean enableHelpdesk; private Boolean enableInventory;
        private Boolean enableAlmanac; private Boolean enableCommunication; private Boolean enableSafety;
    }

    // ── Custom Label ──
    @Data @Builder @AllArgsConstructor
    public static class LabelResponse {
        private Long id; private Long schoolId; private String labelKey; private String labelValue; private String language;
        public static LabelResponse from(CustomLabel l) {
            return LabelResponse.builder().id(l.getId()).schoolId(l.getSchoolId())
                    .labelKey(l.getLabelKey()).labelValue(l.getLabelValue()).language(l.getLanguage()).build();
        }
    }
    @Data
    public static class LabelRequest {
        private String labelKey; private String labelValue; private String language;
    }

    // ── School Asset ──
    @Data @Builder @AllArgsConstructor
    public static class AssetResponse {
        private Long id; private Long schoolId; private SchoolAsset.AssetType assetType;
        private String fileUrl; private String s3Key; private String originalFilename;
        private String contentType; private Long fileSizeBytes; private Long uploadedByUserId;
        public static AssetResponse from(SchoolAsset a) {
            return AssetResponse.builder().id(a.getId()).schoolId(a.getSchoolId()).assetType(a.getAssetType())
                    .fileUrl(a.getFileUrl()).s3Key(a.getS3Key()).originalFilename(a.getOriginalFilename())
                    .contentType(a.getContentType()).fileSizeBytes(a.getFileSizeBytes()).uploadedByUserId(a.getUploadedByUserId()).build();
        }
    }

    // ── Public Theme (no auth required) ──
    @Data @Builder @AllArgsConstructor
    public static class PublicThemeResponse {
        private String schoolName; private String subdomain;
        private String logoUrl; private String faviconUrl; private String bannerUrl;
        private String primaryColor; private String secondaryColor; private String accentColor;
        private String backgroundColor; private String sidebarColor;
        private String fontFamily; private String headingFontFamily;
        private String cssOverrides; private String dateFormat; private String timeFormat; private String locale;
        private List<LabelResponse> labels;
    }
}
