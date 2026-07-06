package com.leanquitous.iskool.services.finance;

import com.leanquitous.iskool.dto.finance.FinanceDtos.*;
import com.leanquitous.iskool.entity.finance.*;
import com.leanquitous.iskool.repositories.finance.*;
import com.leanquitous.iskool.tenant.TenantContext;
import com.leanquitous.iskool.tenant.TenantValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FinanceService {

    private final FeeStructureRepository feeRepo;
    private final InvoiceRepository invoiceRepo;
    private final PaymentRepository paymentRepo;
    private final ReceiptRepository receiptRepo;

    // ── FeeStructure ──

    public FeeStructureResponse createFeeStructure(FeeStructureRequest req) {
        FeeStructure fee = FeeStructure.builder().classId(req.getClassId()).batchId(req.getBatchId())
                .feeType(req.getFeeType()).amount(req.getAmount()).schoolId(TenantContext.getCurrentTenant()).build();
        return FeeStructureResponse.from(feeRepo.save(fee));
    }

    public List<FeeStructureResponse> getFeeStructuresByBatch(Long batchId) {
        return feeRepo.findBySchoolIdAndBatchIdAndIsActiveTrue(TenantContext.getCurrentTenant(), batchId)
                .stream().map(FeeStructureResponse::from).toList();
    }

    public List<FeeStructureResponse> getFeeStructuresByClass(Long classId, Long batchId) {
        return feeRepo.findBySchoolIdAndClassIdAndBatchIdAndIsActiveTrue(TenantContext.getCurrentTenant(), classId, batchId)
                .stream().map(FeeStructureResponse::from).toList();
    }

    public void deleteFeeStructure(Long id) {
        FeeStructure fee = feeRepo.findById(id).orElseThrow(() -> new RuntimeException("Fee structure not found"));
        TenantValidator.validateOwnership(fee.getSchoolId());
        fee.setIsActive(false);
        feeRepo.save(fee);
    }

    // ── Invoice ──

    public InvoiceResponse createInvoice(InvoiceRequest req) {
        Invoice invoice = Invoice.builder().studentId(req.getStudentId()).batchId(req.getBatchId())
                .invoiceNumber(req.getInvoiceNumber()).totalAmount(req.getTotalAmount()).dueDate(req.getDueDate())
                .status(Invoice.InvoiceStatus.PENDING).schoolId(TenantContext.getCurrentTenant()).build();
        return InvoiceResponse.from(invoiceRepo.save(invoice));
    }

    public List<InvoiceResponse> getInvoicesByStudent(Long studentId) {
        return invoiceRepo.findBySchoolIdAndStudentId(TenantContext.getCurrentTenant(), studentId)
                .stream().map(InvoiceResponse::from).toList();
    }

    public List<InvoiceResponse> getInvoicesByBatch(Long batchId) {
        return invoiceRepo.findBySchoolIdAndBatchId(TenantContext.getCurrentTenant(), batchId)
                .stream().map(InvoiceResponse::from).toList();
    }

    public List<InvoiceResponse> getInvoicesByStatus(Invoice.InvoiceStatus status) {
        return invoiceRepo.findBySchoolIdAndStatus(TenantContext.getCurrentTenant(), status)
                .stream().map(InvoiceResponse::from).toList();
    }

    // ── Payment ──

    public PaymentResponse recordPayment(PaymentRequest req) {
        Payment payment = Payment.builder().invoiceId(req.getInvoiceId()).amount(req.getAmount())
                .paymentMethod(req.getPaymentMethod()).transactionRef(req.getTransactionRef())
                .paidAt(LocalDateTime.now()).schoolId(TenantContext.getCurrentTenant()).build();
        Payment saved = paymentRepo.save(payment);
        updateInvoiceStatus(saved.getInvoiceId(), saved.getAmount());
        return PaymentResponse.from(saved);
    }

    public List<PaymentResponse> getPaymentsByInvoice(Long invoiceId) {
        return paymentRepo.findBySchoolIdAndInvoiceId(TenantContext.getCurrentTenant(), invoiceId)
                .stream().map(PaymentResponse::from).toList();
    }

    // ── Receipt ──

    public ReceiptResponse generateReceipt(ReceiptRequest req) {
        Receipt receipt = Receipt.builder().paymentId(req.getPaymentId()).receiptNumber(req.getReceiptNumber())
                .fileUrl(req.getFileUrl()).schoolId(TenantContext.getCurrentTenant()).build();
        return ReceiptResponse.from(receiptRepo.save(receipt));
    }

    public ReceiptResponse getReceiptByPayment(Long paymentId) {
        return receiptRepo.findBySchoolIdAndPaymentId(TenantContext.getCurrentTenant(), paymentId)
                .map(ReceiptResponse::from).orElse(null);
    }

    // ── Helper ──

    private void updateInvoiceStatus(Long invoiceId, BigDecimal paymentAmount) {
        invoiceRepo.findById(invoiceId).ifPresent(invoice -> {
            BigDecimal totalPaid = paymentRepo.findBySchoolIdAndInvoiceId(TenantContext.getCurrentTenant(), invoiceId)
                    .stream().map(Payment::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
            if (totalPaid.compareTo(invoice.getTotalAmount()) >= 0) {
                invoice.setStatus(Invoice.InvoiceStatus.PAID);
            } else if (totalPaid.compareTo(BigDecimal.ZERO) > 0) {
                invoice.setStatus(Invoice.InvoiceStatus.PARTIALLY_PAID);
            }
            invoiceRepo.save(invoice);
        });
    }
}
