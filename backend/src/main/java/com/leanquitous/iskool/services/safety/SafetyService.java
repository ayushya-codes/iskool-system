package com.leanquitous.iskool.services.safety;

import com.leanquitous.iskool.dto.safety.SafetyDtos.*;
import com.leanquitous.iskool.entity.safety.*;
import com.leanquitous.iskool.entity.student.Student;
import com.leanquitous.iskool.repositories.safety.*;
import com.leanquitous.iskool.repositories.student.StudentRepository;
import com.leanquitous.iskool.tenant.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;

import javax.imageio.ImageIO;
import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SafetyService {

    private final GatePassRepository gatePassRepo;
    private final ProxyPickupRepository proxyPickupRepo;
    private final StudentRepository studentRepo;

    public GatePassResponse createGatePass(GatePassRequest req) {
        String passCode = UUID.randomUUID().toString().replace("-", "").substring(0, 8).toUpperCase();
        GatePass pass = GatePass.builder()
                .studentId(req.getStudentId())
                .passCode(passCode)
                .validDate(req.getValidDate())
                .isUsed(false)
                .pickupPersonName(req.getPickupPersonName())
                .pickupPersonPhone(req.getPickupPersonPhone())
                .relationship(req.getRelationship())
                .reason(req.getReason())
                .createdByUserId(req.getCreatedByUserId())
                .schoolId(TenantContext.getCurrentTenant())
                .build();
        GatePass saved = gatePassRepo.save(pass);
        GatePassResponse resp = GatePassResponse.from(saved);
        Student student = studentRepo.findById(saved.getStudentId()).orElse(null);
        if (student != null) {
            resp.setStudentName(student.getFirstName() + " " + student.getLastName());
            resp.setStudentPhotoUrl(student.getAvatarUrl());
            resp.setStudentDateOfBirth(student.getDateOfBirth());
            resp.setStudentGender(student.getGender());
        }
        resp.setQrCodeBase64(generateQrCodeBase64(passCode));
        return resp;
    }

    public GatePassResponse verifyGatePass(String passCode, LocalDate validDate) {
        GatePass pass = gatePassRepo.findBySchoolIdAndPassCodeAndValidDate(
                TenantContext.getCurrentTenant(), passCode, validDate)
                .orElseThrow(() -> new RuntimeException("Invalid gate pass"));
        if (pass.getIsUsed()) throw new RuntimeException("Gate pass already used");
        pass.setIsUsed(true);
        GatePass saved = gatePassRepo.save(pass);
        GatePassResponse resp = GatePassResponse.from(saved);
        Student student = studentRepo.findById(saved.getStudentId()).orElse(null);
        if (student != null) {
            resp.setStudentName(student.getFirstName() + " " + student.getLastName());
            resp.setStudentPhotoUrl(student.getAvatarUrl());
            resp.setStudentDateOfBirth(student.getDateOfBirth());
            resp.setStudentGender(student.getGender());
        }
        return resp;
    }

    public List<GatePassResponse> getGatePassesByStudent(Long studentId) {
        return gatePassRepo.findBySchoolIdAndStudentId(TenantContext.getCurrentTenant(), studentId)
                .stream().map(g -> {
                    GatePassResponse resp = GatePassResponse.from(g);
                    resp.setStudentName(getStudentName(g.getStudentId()));
                    return resp;
                }).toList();
    }

    private String getStudentName(Long studentId) {
        return studentRepo.findById(studentId)
                .map(s -> s.getFirstName() + " " + s.getLastName())
                .orElse("Unknown");
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

    private String generateQrCodeBase64(String content) {
        try {
            QRCodeWriter writer = new QRCodeWriter();
            Map<EncodeHintType, Object> hints = Map.of(
                    EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.M,
                    EncodeHintType.MARGIN, 2
            );
            BitMatrix matrix = writer.encode(content, BarcodeFormat.QR_CODE, 300, 300, hints);
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(matrix, "PNG", baos);
            return "data:image/png;base64," + Base64.getEncoder().encodeToString(baos.toByteArray());
        } catch (Exception e) {
            return null;
        }
    }
}
