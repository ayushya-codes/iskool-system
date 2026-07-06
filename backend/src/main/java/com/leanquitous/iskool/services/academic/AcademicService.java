package com.leanquitous.iskool.services.academic;

import com.leanquitous.iskool.dto.academic.AcademicDtos.*;
import com.leanquitous.iskool.entity.academic.*;
import com.leanquitous.iskool.repositories.academic.*;
import com.leanquitous.iskool.tenant.TenantContext;
import com.leanquitous.iskool.tenant.TenantValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AcademicService {

    private final AcademicBatchRepository batchRepo;
    private final TermRepository termRepo;
    private final SchoolClassRepository classRepo;
    private final DivisionRepository divisionRepo;
    private final SubjectRepository subjectRepo;

    // ── Batch ──

    public BatchResponse createBatch(BatchRequest req) {
        AcademicBatch batch = AcademicBatch.builder()
                .name(req.getName())
                .startDate(req.getStartDate())
                .endDate(req.getEndDate())
                .isActive(req.getIsActive() != null ? req.getIsActive() : false)
                .schoolId(TenantContext.getCurrentTenant())
                .build();
        return BatchResponse.from(batchRepo.save(batch));
    }

    public List<BatchResponse> getAllBatches() {
        return batchRepo.findBySchoolIdOrderByStartDateDesc(TenantContext.getCurrentTenant())
                .stream().map(BatchResponse::from).toList();
    }

    public BatchResponse getActiveBatch() {
        AcademicBatch batch = batchRepo.findBySchoolIdAndIsActiveTrue(TenantContext.getCurrentTenant())
                .orElseThrow(() -> new RuntimeException("No active academic batch"));
        return BatchResponse.from(batch);
    }

    public BatchResponse updateBatch(Long id, BatchRequest req) {
        AcademicBatch batch = batchRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Batch not found"));
        TenantValidator.validateOwnership(batch.getSchoolId());
        if (req.getName() != null) batch.setName(req.getName());
        if (req.getStartDate() != null) batch.setStartDate(req.getStartDate());
        if (req.getEndDate() != null) batch.setEndDate(req.getEndDate());
        if (req.getIsActive() != null) batch.setIsActive(req.getIsActive());
        return BatchResponse.from(batchRepo.save(batch));
    }

    public void deleteBatch(Long id) {
        AcademicBatch batch = batchRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Batch not found"));
        TenantValidator.validateOwnership(batch.getSchoolId());
        batchRepo.delete(batch);
    }

    // ── Term ──

    public TermResponse createTerm(TermRequest req) {
        Term term = Term.builder()
                .batchId(req.getBatchId())
                .name(req.getName())
                .startDate(req.getStartDate())
                .endDate(req.getEndDate())
                .schoolId(TenantContext.getCurrentTenant())
                .build();
        return TermResponse.from(termRepo.save(term));
    }

    public List<TermResponse> getTermsByBatch(Long batchId) {
        return termRepo.findBySchoolIdAndBatchIdOrderByStartDateAsc(TenantContext.getCurrentTenant(), batchId)
                .stream().map(TermResponse::from).toList();
    }

    public void deleteTerm(Long id) {
        Term term = termRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Term not found"));
        TenantValidator.validateOwnership(term.getSchoolId());
        termRepo.delete(term);
    }

    // ── Class ──

    public ClassResponse createClass(ClassRequest req) {
        SchoolClass schoolClass = SchoolClass.builder()
                .name(req.getName())
                .level(req.getLevel())
                .schoolId(TenantContext.getCurrentTenant())
                .build();
        return ClassResponse.from(classRepo.save(schoolClass));
    }

    public List<ClassResponse> getAllClasses() {
        return classRepo.findBySchoolIdOrderByLevelAsc(TenantContext.getCurrentTenant())
                .stream().map(ClassResponse::from).toList();
    }

    public ClassResponse updateClass(Long id, ClassRequest req) {
        SchoolClass schoolClass = classRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Class not found"));
        TenantValidator.validateOwnership(schoolClass.getSchoolId());
        if (req.getName() != null) schoolClass.setName(req.getName());
        if (req.getLevel() != null) schoolClass.setLevel(req.getLevel());
        return ClassResponse.from(classRepo.save(schoolClass));
    }

    public void deleteClass(Long id) {
        SchoolClass schoolClass = classRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Class not found"));
        TenantValidator.validateOwnership(schoolClass.getSchoolId());
        classRepo.delete(schoolClass);
    }

    // ── Division ──

    public DivisionResponse createDivision(DivisionRequest req) {
        Division division = Division.builder()
                .classId(req.getClassId())
                .name(req.getName())
                .schoolId(TenantContext.getCurrentTenant())
                .build();
        return DivisionResponse.from(divisionRepo.save(division));
    }

    public List<DivisionResponse> getDivisionsByClass(Long classId) {
        return divisionRepo.findBySchoolIdAndClassIdOrderByNameAsc(TenantContext.getCurrentTenant(), classId)
                .stream().map(DivisionResponse::from).toList();
    }

    public void deleteDivision(Long id) {
        Division division = divisionRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Division not found"));
        TenantValidator.validateOwnership(division.getSchoolId());
        divisionRepo.delete(division);
    }

    // ── Subject ──

    public SubjectResponse createSubject(SubjectRequest req) {
        Subject subject = Subject.builder()
                .name(req.getName())
                .code(req.getCode())
                .schoolId(TenantContext.getCurrentTenant())
                .build();
        return SubjectResponse.from(subjectRepo.save(subject));
    }

    public List<SubjectResponse> getAllSubjects() {
        return subjectRepo.findBySchoolIdOrderByNameAsc(TenantContext.getCurrentTenant())
                .stream().map(SubjectResponse::from).toList();
    }

    public SubjectResponse updateSubject(Long id, SubjectRequest req) {
        Subject subject = subjectRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Subject not found"));
        TenantValidator.validateOwnership(subject.getSchoolId());
        if (req.getName() != null) subject.setName(req.getName());
        if (req.getCode() != null) subject.setCode(req.getCode());
        return SubjectResponse.from(subjectRepo.save(subject));
    }

    public void deleteSubject(Long id) {
        Subject subject = subjectRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Subject not found"));
        TenantValidator.validateOwnership(subject.getSchoolId());
        subjectRepo.delete(subject);
    }
}
