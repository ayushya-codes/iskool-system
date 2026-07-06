package com.leanquitous.iskool.services.communication;

import com.leanquitous.iskool.dto.communication.CommunicationDtos.*;
import com.leanquitous.iskool.entity.communication.*;
import com.leanquitous.iskool.repositories.communication.*;
import com.leanquitous.iskool.services.notification.NotificationService;
import com.leanquitous.iskool.tenant.TenantContext;
import com.leanquitous.iskool.tenant.TenantValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommunicationService {

    private final CalendarEventRepository eventRepo;
    private final CircularRepository circularRepo;
    private final ClassAnnouncementRepository announcementRepo;
    private final MediaGalleryRepository galleryRepo;
    private final MediaAssetRepository assetRepo;
    private final NotificationService notificationService;

    // ── Calendar Events ──
    public CalendarEventResponse createEvent(CalendarEventRequest req) {
        CalendarEvent event = CalendarEvent.builder().title(req.getTitle()).description(req.getDescription())
                .eventDate(req.getEventDate()).eventType(req.getEventType())
                .schoolId(TenantContext.getCurrentTenant()).build();
        CalendarEventResponse response = CalendarEventResponse.from(eventRepo.save(event));
        notificationService.broadcastToSchool("New Event: " + req.getTitle(),
                req.getDescription() != null ? req.getDescription() : "A new event has been scheduled.");
        return response;
    }

    public List<CalendarEventResponse> getAllEvents() {
        return eventRepo.findBySchoolIdOrderByEventDateAsc(TenantContext.getCurrentTenant())
                .stream().map(CalendarEventResponse::from).toList();
    }

    public void deleteEvent(Long id) { eventRepo.deleteById(id); }

    // ── Circulars ──
    public CircularResponse createCircular(CircularRequest req) {
        Circular circular = Circular.builder().title(req.getTitle()).content(req.getContent())
                .attachmentUrl(req.getAttachmentUrl()).publishedDate(req.getPublishedDate())
                .targetClassLevel(req.getTargetClassLevel()).publishedByUserId(req.getPublishedByUserId())
                .schoolId(TenantContext.getCurrentTenant()).build();
        CircularResponse response = CircularResponse.from(circularRepo.save(circular));
        notificationService.broadcastToSchool("New Circular: " + req.getTitle(),
                req.getContent() != null ? req.getContent() : "A new circular has been published.");
        return response;
    }

    public List<CircularResponse> getAllCirculars() {
        return circularRepo.findBySchoolIdOrderByPublishedDateDesc(TenantContext.getCurrentTenant())
                .stream().map(CircularResponse::from).toList();
    }

    public void deleteCircular(Long id) { circularRepo.deleteById(id); }

    // ── Class Announcements ──
    public AnnouncementResponse createAnnouncement(AnnouncementRequest req) {
        ClassAnnouncement ann = ClassAnnouncement.builder().divisionId(req.getDivisionId()).content(req.getContent())
                .publishedByFacultyId(req.getPublishedByFacultyId()).schoolId(TenantContext.getCurrentTenant()).build();
        AnnouncementResponse response = AnnouncementResponse.from(announcementRepo.save(ann));
        notificationService.broadcastToSchool("New Announcement", req.getContent());
        return response;
    }

    public List<AnnouncementResponse> getAnnouncementsByDivision(Long divisionId) {
        return announcementRepo.findBySchoolIdAndDivisionIdOrderByCreatedAtDesc(TenantContext.getCurrentTenant(), divisionId)
                .stream().map(AnnouncementResponse::from).toList();
    }

    public void deleteAnnouncement(Long id) { announcementRepo.deleteById(id); }

    // ── Media Gallery ──
    public GalleryResponse createGallery(GalleryRequest req) {
        MediaGallery gallery = MediaGallery.builder().title(req.getTitle()).eventDate(req.getEventDate())
                .targetClassLevel(req.getTargetClassLevel()).isApproved(false)
                .schoolId(TenantContext.getCurrentTenant()).build();
        return GalleryResponse.from(galleryRepo.save(gallery));
    }

    public List<GalleryResponse> getAllGalleries() {
        return galleryRepo.findBySchoolIdAndIsActiveTrueOrderByEventDateDesc(TenantContext.getCurrentTenant())
                .stream().map(GalleryResponse::from).toList();
    }

    public List<GalleryResponse> getPendingGalleries() {
        return galleryRepo.findBySchoolIdAndIsApprovedAndIsActiveTrue(TenantContext.getCurrentTenant(), false)
                .stream().map(GalleryResponse::from).toList();
    }

    public GalleryResponse approveGallery(Long id, Long approvedByUserId) {
        MediaGallery gallery = galleryRepo.findById(id).orElseThrow(() -> new RuntimeException("Gallery not found"));
        TenantValidator.validateOwnership(gallery.getSchoolId());
        gallery.setIsApproved(true);
        gallery.setApprovedByUserId(approvedByUserId);
        return GalleryResponse.from(galleryRepo.save(gallery));
    }

    public void deleteGallery(Long id) {
        MediaGallery gallery = galleryRepo.findById(id).orElseThrow(() -> new RuntimeException("Gallery not found"));
        TenantValidator.validateOwnership(gallery.getSchoolId());
        gallery.setIsActive(false);
        galleryRepo.save(gallery);
    }

    // ── Media Assets ──
    public AssetResponse uploadAsset(AssetRequest req) {
        MediaAsset asset = MediaAsset.builder().galleryId(req.getGalleryId()).fileUrl(req.getFileUrl())
                .assetType(req.getAssetType()).uploadedByFacultyId(req.getUploadedByFacultyId())
                .schoolId(TenantContext.getCurrentTenant()).build();
        return AssetResponse.from(assetRepo.save(asset));
    }

    public List<AssetResponse> getAssetsByGallery(Long galleryId) {
        return assetRepo.findBySchoolIdAndGalleryId(TenantContext.getCurrentTenant(), galleryId)
                .stream().map(AssetResponse::from).toList();
    }

    public void deleteAsset(Long id) { assetRepo.deleteById(id); }
}
