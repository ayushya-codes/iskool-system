package com.leanquitous.iskool.services.almanac;

import com.leanquitous.iskool.dto.almanac.AlmanacDtos.*;
import com.leanquitous.iskool.entity.almanac.*;
import com.leanquitous.iskool.repositories.almanac.*;
import com.leanquitous.iskool.services.notification.NotificationService;
import com.leanquitous.iskool.tenant.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AlmanacService {

    private final AlmanacRemarkRepository remarkRepo;
    private final PrayerRepository prayerRepo;
    private final NotificationService notificationService;

    public RemarkResponse addRemark(RemarkRequest req) {
        AlmanacRemark remark = AlmanacRemark.builder().studentId(req.getStudentId()).remark(req.getRemark())
                .remarkDate(req.getRemarkDate()).remarkedByUserId(req.getRemarkedByUserId())
                .schoolId(TenantContext.getCurrentTenant()).build();
        RemarkResponse response = RemarkResponse.from(remarkRepo.save(remark));
        notificationService.broadcastToSchool("Almanac Update",
                "A new remark has been added to the almanac.");
        return response;
    }

    public List<RemarkResponse> getRemarksByStudent(Long studentId) {
        return remarkRepo.findBySchoolIdAndStudentIdOrderByRemarkDateDesc(TenantContext.getCurrentTenant(), studentId)
                .stream().map(RemarkResponse::from).toList();
    }

    public PrayerResponse createPrayer(PrayerRequest req) {
        Prayer prayer = Prayer.builder().title(req.getTitle()).language(req.getLanguage())
                .textContent(req.getTextContent()).audioUrl(req.getAudioUrl())
                .schoolId(TenantContext.getCurrentTenant()).build();
        return PrayerResponse.from(prayerRepo.save(prayer));
    }

    public List<PrayerResponse> getAllPrayers() {
        return prayerRepo.findBySchoolId(TenantContext.getCurrentTenant()).stream().map(PrayerResponse::from).toList();
    }

    public void deletePrayer(Long id) { prayerRepo.deleteById(id); }
}
