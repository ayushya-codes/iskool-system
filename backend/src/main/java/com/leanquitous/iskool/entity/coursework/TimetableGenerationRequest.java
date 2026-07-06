package com.leanquitous.iskool.entity.coursework;

import com.leanquitous.iskool.entity.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "timetable_generation_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class TimetableGenerationRequest extends BaseEntity {

    @Column(name = "class_id", nullable = false)
    private Long classId;

    @Column(name = "batch_id", nullable = false)
    private Long batchId;

    @Column(name = "generated_by_user_id", nullable = false)
    private Long generatedByUserId;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private GenerationStatus status;

    @Column(name = "ai_model_used")
    private String aiModelUsed;

    @Column(name = "request_payload", columnDefinition = "TEXT")
    private String requestPayload;

    @Column(name = "response_payload", columnDefinition = "TEXT")
    private String responsePayload;

    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;

    public enum GenerationStatus {
        PENDING, PROCESSING, COMPLETED, FAILED, PUBLISHED
    }
}
