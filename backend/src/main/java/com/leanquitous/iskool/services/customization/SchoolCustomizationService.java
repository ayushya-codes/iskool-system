package com.leanquitous.iskool.services.customization;

import com.leanquitous.iskool.dto.customization.SchoolCustomizationDtos.*;
import com.leanquitous.iskool.entity.customization.*;
import com.leanquitous.iskool.entity.tenant.School;
import com.leanquitous.iskool.repositories.customization.*;
import com.leanquitous.iskool.repositories.tenant.SchoolRepository;
import com.leanquitous.iskool.services.storage.S3StorageService;
import com.leanquitous.iskool.tenant.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SchoolCustomizationService {

    private final SchoolCustomizationRepository customizationRepo;
    private final CustomLabelRepository labelRepo;
    private final SchoolAssetRepository assetRepo;
    private final SchoolRepository schoolRepo;
    private final S3StorageService s3StorageService;

    // ── Theme / Customization ──

    public CustomizationResponse getCustomization() {
        Long schoolId = TenantContext.getCurrentTenant();
        SchoolCustomization cust = customizationRepo.findBySchoolId(schoolId)
                .orElseGet(() -> createDefault(schoolId));
        return CustomizationResponse.from(cust);
    }

    public CustomizationResponse updateCustomization(CustomizationRequest req) {
        Long schoolId = TenantContext.getCurrentTenant();
        SchoolCustomization cust = customizationRepo.findBySchoolId(schoolId)
                .orElseGet(() -> createDefault(schoolId));

        if (req.getFaviconUrl() != null) cust.setFaviconUrl(req.getFaviconUrl());
        if (req.getBannerUrl() != null) cust.setBannerUrl(req.getBannerUrl());
        if (req.getReportCardLogoUrl() != null) cust.setReportCardLogoUrl(req.getReportCardLogoUrl());
        if (req.getFontFamily() != null) cust.setFontFamily(req.getFontFamily());
        if (req.getHeadingFontFamily() != null) cust.setHeadingFontFamily(req.getHeadingFontFamily());
        if (req.getAccentColor() != null) cust.setAccentColor(req.getAccentColor());
        if (req.getBackgroundColor() != null) cust.setBackgroundColor(req.getBackgroundColor());
        if (req.getSidebarColor() != null) cust.setSidebarColor(req.getSidebarColor());
        if (req.getCssOverrides() != null) cust.setCssOverrides(req.getCssOverrides());
        if (req.getDateFormat() != null) cust.setDateFormat(req.getDateFormat());
        if (req.getTimeFormat() != null) cust.setTimeFormat(req.getTimeFormat());
        if (req.getLocale() != null) cust.setLocale(req.getLocale());
        if (req.getEnableFinance() != null) cust.setEnableFinance(req.getEnableFinance());
        if (req.getEnableHelpdesk() != null) cust.setEnableHelpdesk(req.getEnableHelpdesk());
        if (req.getEnableInventory() != null) cust.setEnableInventory(req.getEnableInventory());
        if (req.getEnableAlmanac() != null) cust.setEnableAlmanac(req.getEnableAlmanac());
        if (req.getEnableCommunication() != null) cust.setEnableCommunication(req.getEnableCommunication());
        if (req.getEnableSafety() != null) cust.setEnableSafety(req.getEnableSafety());

        return CustomizationResponse.from(customizationRepo.save(cust));
    }

    private SchoolCustomization createDefault(Long schoolId) {
        SchoolCustomization cust = SchoolCustomization.builder()
                .schoolId(schoolId)
                .enableFinance(true).enableHelpdesk(true).enableInventory(true)
                .enableAlmanac(true).enableCommunication(true).enableSafety(true)
                .dateFormat("dd-MM-yyyy").timeFormat("HH:mm").locale("en")
                .build();
        return customizationRepo.save(cust);
    }

    // ── Public Theme (no auth) ──

    public PublicThemeResponse getPublicTheme(String subdomain) {
        School school = schoolRepo.findBySubdomain(subdomain)
                .orElseThrow(() -> new RuntimeException("School not found for subdomain: " + subdomain));

        SchoolCustomization cust = customizationRepo.findBySchoolId(school.getId()).orElse(null);
        List<LabelResponse> labels = labelRepo.findBySchoolIdAndLanguage(school.getId(), "en")
                .stream().map(LabelResponse::from).toList();

        return PublicThemeResponse.builder()
                .schoolName(school.getName())
                .subdomain(school.getSubdomain())
                .logoUrl(school.getLogoUrl())
                .faviconUrl(cust != null ? cust.getFaviconUrl() : null)
                .bannerUrl(cust != null ? cust.getBannerUrl() : null)
                .primaryColor(school.getPrimaryColor())
                .secondaryColor(school.getSecondaryColor())
                .accentColor(cust != null ? cust.getAccentColor() : null)
                .backgroundColor(cust != null ? cust.getBackgroundColor() : null)
                .sidebarColor(cust != null ? cust.getSidebarColor() : null)
                .fontFamily(cust != null ? cust.getFontFamily() : null)
                .headingFontFamily(cust != null ? cust.getHeadingFontFamily() : null)
                .cssOverrides(cust != null ? cust.getCssOverrides() : null)
                .dateFormat(cust != null ? cust.getDateFormat() : "dd-MM-yyyy")
                .timeFormat(cust != null ? cust.getTimeFormat() : "HH:mm")
                .locale(cust != null ? cust.getLocale() : "en")
                .labels(labels)
                .build();
    }

    // ── Custom Labels ──

    public LabelResponse upsertLabel(LabelRequest req) {
        Long schoolId = TenantContext.getCurrentTenant();
        CustomLabel label = labelRepo.findBySchoolIdAndLabelKeyAndLanguage(
                schoolId, req.getLabelKey(), req.getLanguage())
                .orElseGet(() -> CustomLabel.builder()
                        .schoolId(schoolId)
                        .labelKey(req.getLabelKey())
                        .language(req.getLanguage())
                        .build());
        label.setLabelValue(req.getLabelValue());
        return LabelResponse.from(labelRepo.save(label));
    }

    public List<LabelResponse> getLabelsByLanguage(String language) {
        Long schoolId = TenantContext.getCurrentTenant();
        return labelRepo.findBySchoolIdAndLanguage(schoolId, language)
                .stream().map(LabelResponse::from).toList();
    }

    public List<LabelResponse> getAllLabels() {
        Long schoolId = TenantContext.getCurrentTenant();
        return labelRepo.findBySchoolId(schoolId).stream().map(LabelResponse::from).toList();
    }

    public void deleteLabel(Long id) { labelRepo.deleteById(id); }

    // ── Asset Upload ──

    public AssetResponse uploadAsset(SchoolAsset.AssetType assetType, MultipartFile file, Long uploadedByUserId) {
        Long schoolId = TenantContext.getCurrentTenant();
        String folder = assetType.name().toLowerCase().replace("_", "-");
        S3StorageService.UploadResult result = s3StorageService.upload(schoolId, folder, file);

        SchoolAsset asset = SchoolAsset.builder()
                .schoolId(schoolId)
                .assetType(assetType)
                .fileUrl(result.getFileUrl())
                .s3Key(result.getS3Key())
                .originalFilename(result.getOriginalFilename())
                .contentType(result.getContentType())
                .fileSizeBytes(result.getFileSizeBytes())
                .uploadedByUserId(uploadedByUserId)
                .build();
        return AssetResponse.from(assetRepo.save(asset));
    }

    public List<AssetResponse> getAssetsByType(SchoolAsset.AssetType assetType) {
        Long schoolId = TenantContext.getCurrentTenant();
        return assetRepo.findBySchoolIdAndAssetType(schoolId, assetType)
                .stream().map(AssetResponse::from).toList();
    }

    public List<AssetResponse> getAllAssets() {
        Long schoolId = TenantContext.getCurrentTenant();
        return assetRepo.findBySchoolId(schoolId).stream().map(AssetResponse::from).toList();
    }

    public void deleteAsset(Long id) {
        Long schoolId = TenantContext.getCurrentTenant();
        SchoolAsset asset = assetRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Asset not found"));
        if (!asset.getSchoolId().equals(schoolId)) {
            throw new RuntimeException("Asset does not belong to current tenant");
        }
        s3StorageService.delete(asset.getS3Key());
        assetRepo.deleteById(id);
    }
}
