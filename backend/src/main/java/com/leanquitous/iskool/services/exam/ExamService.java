package com.leanquitous.iskool.services.exam;

import com.leanquitous.iskool.dto.exam.ExamDtos.*;
import com.leanquitous.iskool.entity.exam.*;
import com.leanquitous.iskool.repositories.exam.*;
import com.leanquitous.iskool.tenant.TenantContext;
import com.leanquitous.iskool.tenant.TenantValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExamService {

    private final ExamRepository examRepo;
    private final ExamPortionRepository portionRepo;
    private final ExamResultRepository resultRepo;
    private final GradingSchemeRepository gradingRepo;
    private final RankListRepository rankRepo;
    private final ReportCardRepository reportCardRepo;

    // ── Exam ──

    public ExamResponse createExam(ExamRequest req) {
        Exam exam = Exam.builder().divisionId(req.getDivisionId()).batchId(req.getBatchId())
                .name(req.getName()).examType(req.getExamType()).examDate(req.getExamDate())
                .schoolId(TenantContext.getCurrentTenant()).build();
        return ExamResponse.from(examRepo.save(exam));
    }

    public List<ExamResponse> getExamsByBatch(Long batchId) {
        return examRepo.findBySchoolIdAndBatchIdAndIsActiveTrueOrderByExamDateAsc(TenantContext.getCurrentTenant(), batchId)
                .stream().map(ExamResponse::from).toList();
    }

    public List<ExamResponse> getExamsByDivision(Long divisionId) {
        return examRepo.findBySchoolIdAndDivisionIdAndIsActiveTrueOrderByExamDateAsc(TenantContext.getCurrentTenant(), divisionId)
                .stream().map(ExamResponse::from).toList();
    }

    public void deleteExam(Long id) {
        Exam exam = examRepo.findById(id).orElseThrow(() -> new RuntimeException("Exam not found"));
        TenantValidator.validateOwnership(exam.getSchoolId());
        exam.setIsActive(false);
        examRepo.save(exam);
    }

    // ── ExamPortion ──

    public ExamPortionResponse setPortion(ExamPortionRequest req) {
        ExamPortion portion = ExamPortion.builder().examId(req.getExamId()).subjectId(req.getSubjectId())
                .portions(req.getPortions()).schoolId(TenantContext.getCurrentTenant()).build();
        return ExamPortionResponse.from(portionRepo.save(portion));
    }

    public List<ExamPortionResponse> getPortions(Long examId) {
        return portionRepo.findBySchoolIdAndExamId(TenantContext.getCurrentTenant(), examId)
                .stream().map(ExamPortionResponse::from).toList();
    }

    // ── ExamResult ──

    public ExamResultResponse enterResult(ExamResultRequest req) {
        String grade = req.getGrade() != null ? req.getGrade() : computeGrade(req.getMarksObtained(), req.getMaxMarks());
        ExamResult result = ExamResult.builder().examId(req.getExamId()).studentId(req.getStudentId())
                .subjectId(req.getSubjectId()).marksObtained(req.getMarksObtained()).maxMarks(req.getMaxMarks())
                .grade(grade).uploadedByUserId(req.getUploadedByUserId())
                .schoolId(TenantContext.getCurrentTenant()).build();
        return ExamResultResponse.from(resultRepo.save(result));
    }

    public List<ExamResultResponse> getResultsByExam(Long examId) {
        return resultRepo.findBySchoolIdAndExamId(TenantContext.getCurrentTenant(), examId)
                .stream().map(ExamResultResponse::from).toList();
    }

    public List<ExamResultResponse> getResultsByStudent(Long examId, Long studentId) {
        return resultRepo.findBySchoolIdAndExamIdAndStudentId(TenantContext.getCurrentTenant(), examId, studentId)
                .stream().map(ExamResultResponse::from).toList();
    }

    public List<ExamResultResponse> getResultsByStudentForParent(Long examId, Long studentId) {
        return resultRepo.findBySchoolIdAndExamIdAndStudentId(TenantContext.getCurrentTenant(), examId, studentId)
                .stream().map(r -> {
                    ExamResultResponse resp = ExamResultResponse.from(r);
                    resp.setUploadedByUserId(null);
                    return resp;
                }).toList();
    }

    // ── GradingScheme ──

    public GradingSchemeResponse createGradingScheme(GradingSchemeRequest req) {
        GradingScheme scheme = GradingScheme.builder().name(req.getName()).gradeLabel(req.getGradeLabel())
                .minPercentage(req.getMinPercentage()).maxPercentage(req.getMaxPercentage())
                .schoolId(TenantContext.getCurrentTenant()).build();
        return GradingSchemeResponse.from(gradingRepo.save(scheme));
    }

    public List<GradingSchemeResponse> getAllGradingSchemes() {
        return gradingRepo.findBySchoolIdAndIsActiveTrueOrderByMinPercentageDesc(TenantContext.getCurrentTenant())
                .stream().map(GradingSchemeResponse::from).toList();
    }

    public void deleteGradingScheme(Long id) {
        GradingScheme scheme = gradingRepo.findById(id).orElseThrow(() -> new RuntimeException("Grading scheme not found"));
        TenantValidator.validateOwnership(scheme.getSchoolId());
        scheme.setIsActive(false);
        gradingRepo.save(scheme);
    }

    // ── RankList ──

    public RankListResponse setRank(RankListRequest req) {
        RankList rank = RankList.builder().examId(req.getExamId()).studentId(req.getStudentId())
                .classRank(req.getClassRank()).sectionRank(req.getSectionRank()).schoolRank(req.getSchoolRank())
                .schoolId(TenantContext.getCurrentTenant()).build();
        return RankListResponse.from(rankRepo.save(rank));
    }

    public List<RankListResponse> getRankList(Long examId) {
        return rankRepo.findBySchoolIdAndExamIdOrderByClassRankAsc(TenantContext.getCurrentTenant(), examId)
                .stream().map(RankListResponse::from).toList();
    }

    // ── ReportCard ──

    public ReportCardResponse generateReportCard(ReportCardRequest req) {
        ReportCard card = ReportCard.builder().studentId(req.getStudentId()).batchId(req.getBatchId())
                .fileUrl(req.getFileUrl()).isApproved(false).schoolId(TenantContext.getCurrentTenant()).build();
        return ReportCardResponse.from(reportCardRepo.save(card));
    }

    public ReportCardResponse approveReportCard(Long id, Long approvedByUserId) {
        ReportCard card = reportCardRepo.findById(id).orElseThrow(() -> new RuntimeException("Report card not found"));
        TenantValidator.validateOwnership(card.getSchoolId());
        card.setIsApproved(true);
        card.setApprovedByUserId(approvedByUserId);
        return ReportCardResponse.from(reportCardRepo.save(card));
    }

    public List<ReportCardResponse> getReportCardsByBatch(Long batchId) {
        return reportCardRepo.findBySchoolIdAndBatchId(TenantContext.getCurrentTenant(), batchId)
                .stream().map(ReportCardResponse::from).toList();
    }

    // ── Helper ──

    private String computeGrade(BigDecimal marks, BigDecimal max) {
        if (max == null || max.compareTo(BigDecimal.ZERO) == 0) return "N/A";
        BigDecimal percentage = marks.multiply(BigDecimal.valueOf(100)).divide(max, 2, RoundingMode.HALF_UP);
        List<GradingScheme> schemes = gradingRepo.findBySchoolIdAndIsActiveTrueOrderByMinPercentageDesc(TenantContext.getCurrentTenant());
        for (GradingScheme s : schemes) {
            if (percentage.compareTo(s.getMinPercentage()) >= 0) return s.getGradeLabel();
        }
        return "F";
    }
}
