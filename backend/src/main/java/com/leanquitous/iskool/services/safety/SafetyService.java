package com.leanquitous.iskool.services.safety;

import com.leanquitous.iskool.dto.safety.SafetyDtos.*;
import com.leanquitous.iskool.entity.safety.*;
import com.leanquitous.iskool.repositories.safety.*;
import com.leanquitous.iskool.tenant.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SafetyService {

    private final GatePassRepository gatePassRepo;
    private final ProxyPickupRepository proxyPickupRepo;

    public GatePassResponse createGatePass(GatePassRequest req) {
        GatePass pass = GatePass.builder().studentId(req.getStudentId()).passCode(req.getPassCode())
                .validDate(req.getValidDate()).isUsed(false).schoolId(TenantContext.getCurrentTenant()).build();
        return GatePassResponse.from(gatePassRepo.save(pass));
    }

    public GatePassResponse verifyGatePass(String passCode, LocalDate validDate) {
        GatePass pass = gatePassRepo.findBySchoolIdAndPassCodeAndValidDate(
                TenantContext.getCurrentTenant(), passCode, validDate)
                .orElseThrow(() -> new RuntimeException("Invalid gate pass"));
        if (pass.getIsUsed()) throw new RuntimeException("Gate pass already used");
        pass.setIsUsed(true);
        return GatePassResponse.from(gatePassRepo.save(pass));
    }

    public List<GatePassResponse> getGatePassesByStudent(Long studentId) {
        return gatePassRepo.findBySchoolIdAndStudentId(TenantContext.getCurrentTenant(), studentId)
                .stream().map(GatePassResponse::from).toList();
    }

    public ProxyPickupResponse createProxyPickup(ProxyPickupRequest req) {
        ProxyPickup pickup = ProxyPickup.builder().studentId(req.getStudentId()).pickupPersonName(req.getPickupPersonName())
                .pickupPersonPhotoUrl(req.getPickupPersonPhotoUrl()).validDate(req.getValidDate())
                .schoolId(TenantContext.getCurrentTenant()).build();
        return ProxyPickupResponse.from(proxyPickupRepo.save(pickup));
    }

    public List<ProxyPickupResponse> getProxyPickupsByDate(LocalDate validDate) {
        return proxyPickupRepo.findBySchoolIdAndValidDate(TenantContext.getCurrentTenant(), validDate)
                .stream().map(ProxyPickupResponse::from).toList();
    }

    public List<ProxyPickupResponse> getProxyPickupsByStudent(Long studentId) {
        return proxyPickupRepo.findBySchoolIdAndStudentId(TenantContext.getCurrentTenant(), studentId)
                .stream().map(ProxyPickupResponse::from).toList();
    }
}
