package com.leanquitous.iskool.dto.communication;

import com.leanquitous.iskool.entity.communication.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDate;
import java.util.List;

public class CommunicationDtos {

    // ── CalendarEvent ──
    @Data @Builder @AllArgsConstructor
    public static class CalendarEventResponse {
        private Long id; private String title; private String description; private LocalDate eventDate; private CalendarEvent.EventType eventType;
        public static CalendarEventResponse from(CalendarEvent e) {
            return CalendarEventResponse.builder().id(e.getId()).title(e.getTitle()).description(e.getDescription())
                    .eventDate(e.getEventDate()).eventType(e.getEventType()).build();
        }
    }
    @Data
    public static class CalendarEventRequest {
        private String title; private String description; @JsonFormat(pattern = "yyyy-MM-dd") private LocalDate eventDate; private CalendarEvent.EventType eventType;
    }

    // ── Circular ──
    @Data @Builder @AllArgsConstructor
    public static class CircularResponse {
        private Long id; private String title; private String content; private String attachmentUrl;
        private LocalDate publishedDate; private Integer targetClassLevel; private Long publishedByUserId;
        public static CircularResponse from(Circular c) {
            return CircularResponse.builder().id(c.getId()).title(c.getTitle()).content(c.getContent())
                    .attachmentUrl(c.getAttachmentUrl()).publishedDate(c.getPublishedDate())
                    .targetClassLevel(c.getTargetClassLevel()).publishedByUserId(c.getPublishedByUserId()).build();
        }
    }
    @Data
    public static class CircularRequest {
        private String title; private String content; private String attachmentUrl;
        @JsonFormat(pattern = "yyyy-MM-dd") private LocalDate publishedDate; private Integer targetClassLevel; private Long publishedByUserId;
    }

    // ── ClassAnnouncement ──
    @Data @Builder @AllArgsConstructor
    public static class AnnouncementResponse {
        private Long id; private Long divisionId; private String content; private Long publishedByFacultyId;
        public static AnnouncementResponse from(ClassAnnouncement a) {
            return AnnouncementResponse.builder().id(a.getId()).divisionId(a.getDivisionId())
                    .content(a.getContent()).publishedByFacultyId(a.getPublishedByFacultyId()).build();
        }
    }
    @Data
    public static class AnnouncementRequest {
        private Long divisionId; private String content; private Long publishedByFacultyId;
    }

    // ── MediaGallery ──
    @Data @Builder @AllArgsConstructor
    public static class GalleryResponse {
        private Long id; private String title; private LocalDate eventDate; private Integer targetClassLevel;
        private Boolean isApproved; private Long approvedByUserId;
        public static GalleryResponse from(MediaGallery g) {
            return GalleryResponse.builder().id(g.getId()).title(g.getTitle()).eventDate(g.getEventDate())
                    .targetClassLevel(g.getTargetClassLevel()).isApproved(g.getIsApproved()).approvedByUserId(g.getApprovedByUserId()).build();
        }
    }
    @Data
    public static class GalleryRequest {
        private String title; @JsonFormat(pattern = "yyyy-MM-dd") private LocalDate eventDate; private Integer targetClassLevel;
    }

    // ── MediaAsset ──
    @Data @Builder @AllArgsConstructor
    public static class AssetResponse {
        private Long id; private Long galleryId; private String fileUrl; private MediaAsset.AssetType assetType; private Long uploadedByFacultyId;
        public static AssetResponse from(MediaAsset a) {
            return AssetResponse.builder().id(a.getId()).galleryId(a.getGalleryId()).fileUrl(a.getFileUrl())
                    .assetType(a.getAssetType()).uploadedByFacultyId(a.getUploadedByFacultyId()).build();
        }
    }
    @Data
    public static class AssetRequest {
        private Long galleryId; private String fileUrl; private MediaAsset.AssetType assetType; private Long uploadedByFacultyId;
    }
}
