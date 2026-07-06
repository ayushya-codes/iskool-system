package com.leanquitous.iskool.controllers.event;

import com.leanquitous.iskool.dto.event.EventDtos.*;
import com.leanquitous.iskool.entity.event.SchoolEvent;
import com.leanquitous.iskool.services.event.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'SUPERVISOR')")
    public ResponseEntity<EventResponse> create(@RequestBody EventRequest req) {
        return ResponseEntity.ok(eventService.create(req));
    }

    @GetMapping
    public ResponseEntity<List<EventResponse>> getAll(
            @RequestParam(required = false) SchoolEvent.EventType type,
            @RequestParam(required = false) LocalDate start,
            @RequestParam(required = false) LocalDate end) {
        if (type != null) {
            return ResponseEntity.ok(eventService.getByType(type));
        }
        if (start != null && end != null) {
            return ResponseEntity.ok(eventService.getByDateRange(start, end));
        }
        return ResponseEntity.ok(eventService.getAll());
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<EventResponse>> getUpcoming() {
        return ResponseEntity.ok(eventService.getUpcoming());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        eventService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
