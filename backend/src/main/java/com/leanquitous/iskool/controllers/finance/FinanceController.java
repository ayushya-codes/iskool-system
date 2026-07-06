package com.leanquitous.iskool.controllers.finance;

import com.leanquitous.iskool.dto.finance.FinanceDtos.*;
import com.leanquitous.iskool.entity.finance.Invoice;
import com.leanquitous.iskool.services.finance.FinanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/finance")
@RequiredArgsConstructor
public class FinanceController {

    private final FinanceService financeService;

    // ── Fee Structure ──
    @PostMapping("/fee-structures")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL', 'CLERK', 'SCHOOL_TRUSTEE')")
    public ResponseEntity<FeeStructureResponse> createFeeStructure(@RequestBody FeeStructureRequest req) {
        return ResponseEntity.ok(financeService.createFeeStructure(req));
    }

    @GetMapping("/fee-structures/batch/{batchId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL', 'CLERK', 'SCHOOL_TRUSTEE')")
    public ResponseEntity<List<FeeStructureResponse>> getFeeStructuresByBatch(@PathVariable Long batchId) {
        return ResponseEntity.ok(financeService.getFeeStructuresByBatch(batchId));
    }

    @GetMapping("/fee-structures/class/{classId}/batch/{batchId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL', 'CLERK', 'SCHOOL_TRUSTEE')")
    public ResponseEntity<List<FeeStructureResponse>> getFeeStructuresByClass(@PathVariable Long classId, @PathVariable Long batchId) {
        return ResponseEntity.ok(financeService.getFeeStructuresByClass(classId, batchId));
    }

    @DeleteMapping("/fee-structures/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> deleteFeeStructure(@PathVariable Long id) {
        financeService.deleteFeeStructure(id);
        return ResponseEntity.noContent().build();
    }

    // ── Invoice ──
    @PostMapping("/invoices")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL', 'CLERK', 'SCHOOL_TRUSTEE')")
    public ResponseEntity<InvoiceResponse> createInvoice(@RequestBody InvoiceRequest req) {
        return ResponseEntity.ok(financeService.createInvoice(req));
    }

    @GetMapping("/invoices/student/{studentId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL', 'CLERK', 'SCHOOL_TRUSTEE', 'PARENT')")
    public ResponseEntity<List<InvoiceResponse>> getInvoicesByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(financeService.getInvoicesByStudent(studentId));
    }

    @GetMapping("/invoices/batch/{batchId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL', 'CLERK', 'SCHOOL_TRUSTEE')")
    public ResponseEntity<List<InvoiceResponse>> getInvoicesByBatch(@PathVariable Long batchId) {
        return ResponseEntity.ok(financeService.getInvoicesByBatch(batchId));
    }

    @GetMapping("/invoices/status/{status}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL', 'CLERK', 'SCHOOL_TRUSTEE')")
    public ResponseEntity<List<InvoiceResponse>> getInvoicesByStatus(@PathVariable Invoice.InvoiceStatus status) {
        return ResponseEntity.ok(financeService.getInvoicesByStatus(status));
    }

    // ── Payment ──
    @PostMapping("/payments")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL', 'CLERK', 'SCHOOL_TRUSTEE')")
    public ResponseEntity<PaymentResponse> recordPayment(@RequestBody PaymentRequest req) {
        return ResponseEntity.ok(financeService.recordPayment(req));
    }

    @GetMapping("/payments/invoice/{invoiceId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL', 'CLERK', 'SCHOOL_TRUSTEE', 'PARENT')")
    public ResponseEntity<List<PaymentResponse>> getPaymentsByInvoice(@PathVariable Long invoiceId) {
        return ResponseEntity.ok(financeService.getPaymentsByInvoice(invoiceId));
    }

    // ── Receipt ──
    @PostMapping("/receipts")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL', 'CLERK', 'SCHOOL_TRUSTEE')")
    public ResponseEntity<ReceiptResponse> generateReceipt(@RequestBody ReceiptRequest req) {
        return ResponseEntity.ok(financeService.generateReceipt(req));
    }

    @GetMapping("/receipts/payment/{paymentId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL', 'CLERK', 'SCHOOL_TRUSTEE', 'PARENT')")
    public ResponseEntity<ReceiptResponse> getReceiptByPayment(@PathVariable Long paymentId) {
        return ResponseEntity.ok(financeService.getReceiptByPayment(paymentId));
    }
}
