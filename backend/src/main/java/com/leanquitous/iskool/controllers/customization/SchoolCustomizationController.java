package com.leanquitous.iskool.controllers.customization;

import com.leanquitous.iskool.dto.customization.SchoolCustomizationDtos.*;
import com.leanquitous.iskool.entity.customization.SchoolAsset;
import com.leanquitous.iskool.services.customization.SchoolCustomizationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class SchoolCustomizationController {

    private final SchoolCustomizationService customizationService;

    // ── Public Theme (no auth required) ──
    @GetMapping("/public/school/theme")
    public ResponseEntity<PublicThemeResponse> getPublicTheme(@RequestParam String subdomain) {
        return ResponseEntity.ok(customizationService.getPublicTheme(subdomain));
    }

    // ── Theme / Customization ──
    @GetMapping("/school/customization")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL', 'FACULTY')")
    public ResponseEntity<CustomizationResponse> getCustomization() {
        return ResponseEntity.ok(customizationService.getCustomization());
    }

    @PutMapping("/school/customization")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL')")
    public ResponseEntity<CustomizationResponse> updateCustomization(@RequestBody CustomizationRequest req) {
        return ResponseEntity.ok(customizationService.updateCustomization(req));
    }

    // ── Custom Labels ──
    @PostMapping("/school/labels")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL')")
    public ResponseEntity<LabelResponse> upsertLabel(@RequestBody LabelRequest req) {
        return ResponseEntity.ok(customizationService.upsertLabel(req));
    }

    @GetMapping("/school/labels")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL')")
    public ResponseEntity<List<LabelResponse>> getAllLabels() {
        return ResponseEntity.ok(customizationService.getAllLabels());
    }

    @GetMapping("/school/labels/{language}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL')")
    public ResponseEntity<List<LabelResponse>> getLabelsByLanguage(@PathVariable String language) {
        return ResponseEntity.ok(customizationService.getLabelsByLanguage(language));
    }

    @DeleteMapping("/school/labels/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> deleteLabel(@PathVariable Long id) {
        customizationService.deleteLabel(id);
        return ResponseEntity.noContent().build();
    }

    // ── Asset Upload ──
    @PostMapping("/school/assets/upload")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL')")
    public ResponseEntity<AssetResponse> uploadAsset(
            @RequestParam SchoolAsset.AssetType assetType,
            @RequestParam("file") MultipartFile file,
            @RequestParam Long uploadedByUserId) {
        return ResponseEntity.ok(customizationService.uploadAsset(assetType, file, uploadedByUserId));
    }

    @GetMapping("/school/assets")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL', 'FACULTY', 'PARENT')")
    public ResponseEntity<List<AssetResponse>> getAllAssets() {
        return ResponseEntity.ok(customizationService.getAllAssets());
    }

    @GetMapping("/school/assets/type/{assetType}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL', 'FACULTY', 'PARENT')")
    public ResponseEntity<List<AssetResponse>> getAssetsByType(@PathVariable SchoolAsset.AssetType assetType) {
        return ResponseEntity.ok(customizationService.getAssetsByType(assetType));
    }

    @DeleteMapping("/school/assets/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> deleteAsset(@PathVariable Long id) {
        customizationService.deleteAsset(id);
        return ResponseEntity.noContent().build();
    }
}
