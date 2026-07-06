package com.leanquitous.iskool.services.event;

import com.leanquitous.iskool.dto.event.EventDtos.*;
import com.leanquitous.iskool.entity.event.SchoolEvent;
import com.leanquitous.iskool.entity.student.StudentTimeline;
import com.leanquitous.iskool.repositories.event.SchoolEventRepository;
import com.leanquitous.iskool.repositories.student.StudentEnrollmentRepository;
import com.leanquitous.iskool.repositories.student.StudentTimelineRepository;
import com.leanquitous.iskool.tenant.TenantContext;
import com.leanquitous.iskool.tenant.TenantValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {

    private final SchoolEventRepository eventRepo;
    private final StudentTimelineRepository timelineRepo;
    private final StudentEnrollmentRepository enrollmentRepo;

    public EventResponse create(EventRequest req) {
        Long schoolId = TenantContext.getCurrentTenant();
        SchoolEvent event = SchoolEvent.builder()
                .name(req.getName())
                .description(req.getDescription())
                .eventDate(req.getEventDate())
                .endDate(req.getEndDate())
                .eventType(req.getEventType())
                .venue(req.getVenue())
                .targetClassLevel(req.getTargetClassLevel())
                .targetDivisionId(req.getTargetDivisionId())
                .managedByUserId(req.getManagedByUserId())
                .schoolId(schoolId)
                .build();
        SchoolEvent saved = eventRepo.save(event);
        autoGenerateTimelineForEvent(saved, schoolId);
        return EventResponse.from(saved);
    }

    public List<EventResponse> getAll() {
        return eventRepo.findBySchoolIdOrderByEventDateDesc(TenantContext.getCurrentTenant())
                .stream().map(EventResponse::from).toList();
    }

    public List<EventResponse> getUpcoming() {
        return eventRepo.findBySchoolIdAndEventDateGreaterThanEqualOrderByEventDateAsc(
                        TenantContext.getCurrentTenant(), LocalDate.now())
                .stream().map(EventResponse::from).toList();
    }

    public List<EventResponse> getByType(SchoolEvent.EventType type) {
        return eventRepo.findBySchoolIdAndEventTypeOrderByEventDateDesc(TenantContext.getCurrentTenant(), type)
                .stream().map(EventResponse::from).toList();
    }

    public List<EventResponse> getByDateRange(LocalDate start, LocalDate end) {
        return eventRepo.findBySchoolIdAndEventDateBetweenOrderByEventDateAsc(TenantContext.getCurrentTenant(), start, end)
                .stream().map(EventResponse::from).toList();
    }

    public void delete(Long id) {
        SchoolEvent event = eventRepo.findById(id).orElseThrow(() -> new RuntimeException("Event not found"));
        TenantValidator.validateOwnership(event.getSchoolId());
        eventRepo.delete(event);
    }

    private void autoGenerateTimelineForEvent(SchoolEvent event, Long schoolId) {
        if (event.getTargetDivisionId() != null) {
            List<Long> studentIds = enrollmentRepo
                    .findBySchoolIdAndDivisionIdIn(schoolId, List.of(event.getTargetDivisionId()))
                    .stream().map(e -> e.getStudentId()).distinct().toList();
            for (Long studentId : studentIds) {
                StudentTimeline timeline = StudentTimeline.builder()
                        .studentId(studentId)
                        .eventType("EVENT")
                        .eventDate(event.getEventDate())
                        .title(event.getName())
                        .description(event.getDescription())
                        .schoolId(schoolId)
                        .build();
                timelineRepo.save(timeline);
            }
        } else {
            List<Long> studentIds = enrollmentRepo
                    .findBySchoolIdAndBatchId(schoolId, getCurrentBatchId())
                    .stream().map(e -> e.getStudentId()).distinct().toList();
            for (Long studentId : studentIds) {
                StudentTimeline timeline = StudentTimeline.builder()
                        .studentId(studentId)
                        .eventType("EVENT")
                        .eventDate(event.getEventDate())
                        .title(event.getName())
                        .description(event.getDescription())
                        .schoolId(schoolId)
                        .build();
                timelineRepo.save(timeline);
            }
        }
    }

    private Long getCurrentBatchId() {
        return null;
    }
}
