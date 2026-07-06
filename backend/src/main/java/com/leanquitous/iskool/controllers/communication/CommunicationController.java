package com.leanquitous.iskool.controllers.communication;

import com.leanquitous.iskool.dto.communication.CommunicationDtos.*;
import com.leanquitous.iskool.services.communication.CommunicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/communication")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
public class CommunicationController {

    private final CommunicationService communicationService;

    // ── Calendar Events ──
    @PostMapping("/events")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL', 'SUPERVISOR')")
    public ResponseEntity<CalendarEventResponse> createEvent(@RequestBody CalendarEventRequest req) {
        return ResponseEntity.ok(communicationService.createEvent(req));
    }

    @GetMapping("/events")
    public ResponseEntity<List<CalendarEventResponse>> getAllEvents() {
        return ResponseEntity.ok(communicationService.getAllEvents());
    }

    @DeleteMapping("/events/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        communicationService.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }

    // ── Circulars ──
    @PostMapping("/circulars")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL', 'SUPERVISOR')")
    public ResponseEntity<CircularResponse> createCircular(@RequestBody CircularRequest req) {
        return ResponseEntity.ok(communicationService.createCircular(req));
    }

    @GetMapping("/circulars")
    public ResponseEntity<List<CircularResponse>> getAllCirculars() {
        return ResponseEntity.ok(communicationService.getAllCirculars());
    }

    @DeleteMapping("/circulars/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> deleteCircular(@PathVariable Long id) {
        communicationService.deleteCircular(id);
        return ResponseEntity.noContent().build();
    }

    // ── Class Announcements ──
    @PostMapping("/announcements")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL', 'SUPERVISOR')")
    public ResponseEntity<AnnouncementResponse> createAnnouncement(@RequestBody AnnouncementRequest req) {
        return ResponseEntity.ok(communicationService.createAnnouncement(req));
    }

    @GetMapping("/announcements/division/{divisionId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL', 'FACULTY', 'PARENT')")
    public ResponseEntity<List<AnnouncementResponse>> getAnnouncementsByDivision(@PathVariable Long divisionId) {
        return ResponseEntity.ok(communicationService.getAnnouncementsByDivision(divisionId));
    }

    @DeleteMapping("/announcements/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL', 'SUPERVISOR')")
    public ResponseEntity<Void> deleteAnnouncement(@PathVariable Long id) {
        communicationService.deleteAnnouncement(id);
        return ResponseEntity.noContent().build();
    }

    // ── Media Gallery ──
    @PostMapping("/galleries")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL', 'SUPERVISOR')")
    public ResponseEntity<GalleryResponse> createGallery(@RequestBody GalleryRequest req) {
        return ResponseEntity.ok(communicationService.createGallery(req));
    }

    @GetMapping("/galleries")
    public ResponseEntity<List<GalleryResponse>> getAllGalleries() {
        return ResponseEntity.ok(communicationService.getAllGalleries());
    }

    @GetMapping("/galleries/pending")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL')")
    public ResponseEntity<List<GalleryResponse>> getPendingGalleries() {
        return ResponseEntity.ok(communicationService.getPendingGalleries());
    }

    @PutMapping("/galleries/{id}/approve")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL')")
    public ResponseEntity<GalleryResponse> approveGallery(@PathVariable Long id, @RequestParam Long approvedByUserId) {
        return ResponseEntity.ok(communicationService.approveGallery(id, approvedByUserId));
    }

    @DeleteMapping("/galleries/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> deleteGallery(@PathVariable Long id) {
        communicationService.deleteGallery(id);
        return ResponseEntity.noContent().build();
    }

    // ── Media Assets ──
    @PostMapping("/assets")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL', 'SUPERVISOR')")
    public ResponseEntity<AssetResponse> uploadAsset(@RequestBody AssetRequest req) {
        return ResponseEntity.ok(communicationService.uploadAsset(req));
    }

    @GetMapping("/assets/gallery/{galleryId}")
    public ResponseEntity<List<AssetResponse>> getAssetsByGallery(@PathVariable Long galleryId) {
        return ResponseEntity.ok(communicationService.getAssetsByGallery(galleryId));
    }

    @DeleteMapping("/assets/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL', 'SUPERVISOR')")
    public ResponseEntity<Void> deleteAsset(@PathVariable Long id) {
        communicationService.deleteAsset(id);
        return ResponseEntity.noContent().build();
    }
}
