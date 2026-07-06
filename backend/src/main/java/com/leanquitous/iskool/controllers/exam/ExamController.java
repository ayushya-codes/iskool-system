package com.leanquitous.iskool.controllers.exam;

import com.leanquitous.iskool.dto.exam.ExamDtos.*;
import com.leanquitous.iskool.services.exam.ExamService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exams")
@RequiredArgsConstructor
public class ExamController {

    private final ExamService examService;

    // ── Exam ──
    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL')")
    public ResponseEntity<ExamResponse> createExam(@RequestBody ExamRequest req) {
        return ResponseEntity.ok(examService.createExam(req));
    }

    @GetMapping("/batch/{batchId}")
    public ResponseEntity<List<ExamResponse>> getExamsByBatch(@PathVariable Long batchId) {
        return ResponseEntity.ok(examService.getExamsByBatch(batchId));
    }

    @GetMapping("/division/{divisionId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL', 'FACULTY', 'PARENT')")
    public ResponseEntity<List<ExamResponse>> getExamsByDivision(@PathVariable Long divisionId) {
        return ResponseEntity.ok(examService.getExamsByDivision(divisionId));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> deleteExam(@PathVariable Long id) {
        examService.deleteExam(id);
        return ResponseEntity.noContent().build();
    }

    // ── Portions ──
    @PostMapping("/portions")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL', 'FACULTY')")
    public ResponseEntity<ExamPortionResponse> setPortion(@RequestBody ExamPortionRequest req) {
        return ResponseEntity.ok(examService.setPortion(req));
    }

    @GetMapping("/{examId}/portions")
    public ResponseEntity<List<ExamPortionResponse>> getPortions(@PathVariable Long examId) {
        return ResponseEntity.ok(examService.getPortions(examId));
    }

    // ── Results ──
    @PostMapping("/results")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL', 'FACULTY')")
    public ResponseEntity<ExamResultResponse> enterResult(@RequestBody ExamResultRequest req) {
        return ResponseEntity.ok(examService.enterResult(req));
    }

    @GetMapping("/{examId}/results")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL', 'FACULTY')")
    public ResponseEntity<List<ExamResultResponse>> getResultsByExam(@PathVariable Long examId) {
        return ResponseEntity.ok(examService.getResultsByExam(examId));
    }

    @GetMapping("/{examId}/results/student/{studentId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL', 'FACULTY', 'PARENT')")
    public ResponseEntity<List<ExamResultResponse>> getResultsByStudent(@PathVariable Long examId, @PathVariable Long studentId) {
        return ResponseEntity.ok(examService.getResultsByStudent(examId, studentId));
    }

    @GetMapping("/{examId}/results/student/{studentId}/parent")
    @PreAuthorize("hasRole('PARENT')")
    public ResponseEntity<List<ExamResultResponse>> getResultsByStudentForParent(@PathVariable Long examId, @PathVariable Long studentId) {
        return ResponseEntity.ok(examService.getResultsByStudentForParent(examId, studentId));
    }

    // ── Grading Schemes ──
    @PostMapping("/grading-schemes")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL')")
    public ResponseEntity<GradingSchemeResponse> createGradingScheme(@RequestBody GradingSchemeRequest req) {
        return ResponseEntity.ok(examService.createGradingScheme(req));
    }

    @GetMapping("/grading-schemes")
    public ResponseEntity<List<GradingSchemeResponse>> getAllGradingSchemes() {
        return ResponseEntity.ok(examService.getAllGradingSchemes());
    }

    @DeleteMapping("/grading-schemes/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> deleteGradingScheme(@PathVariable Long id) {
        examService.deleteGradingScheme(id);
        return ResponseEntity.noContent().build();
    }

    // ── Rank List ──
    @PostMapping("/ranks")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL')")
    public ResponseEntity<RankListResponse> setRank(@RequestBody RankListRequest req) {
        return ResponseEntity.ok(examService.setRank(req));
    }

    @GetMapping("/{examId}/ranks")
    public ResponseEntity<List<RankListResponse>> getRankList(@PathVariable Long examId) {
        return ResponseEntity.ok(examService.getRankList(examId));
    }

    // ── Report Cards ──
    @PostMapping("/report-cards")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL')")
    public ResponseEntity<ReportCardResponse> generateReportCard(@RequestBody ReportCardRequest req) {
        return ResponseEntity.ok(examService.generateReportCard(req));
    }

    @PutMapping("/report-cards/{id}/approve")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL')")
    public ResponseEntity<ReportCardResponse> approveReportCard(@PathVariable Long id, @RequestParam Long approvedByUserId) {
        return ResponseEntity.ok(examService.approveReportCard(id, approvedByUserId));
    }

    @GetMapping("/report-cards/batch/{batchId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL')")
    public ResponseEntity<List<ReportCardResponse>> getReportCardsByBatch(@PathVariable Long batchId) {
        return ResponseEntity.ok(examService.getReportCardsByBatch(batchId));
    }
}
