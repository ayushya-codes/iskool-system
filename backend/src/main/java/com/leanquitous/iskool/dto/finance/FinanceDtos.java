package com.leanquitous.iskool.dto.finance;

import com.leanquitous.iskool.entity.finance.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class FinanceDtos {

    // ── FeeStructure ──
    @Data @Builder @AllArgsConstructor
    public static class FeeStructureResponse {
        private Long id; private Long classId; private Long batchId;
        private FeeStructure.FeeType feeType; private BigDecimal amount;
        public static FeeStructureResponse from(FeeStructure f) {
            return FeeStructureResponse.builder().id(f.getId()).classId(f.getClassId()).batchId(f.getBatchId())
                    .feeType(f.getFeeType()).amount(f.getAmount()).build();
        }
    }
    @Data
    public static class FeeStructureRequest {
        private Long classId; private Long batchId; private FeeStructure.FeeType feeType; private BigDecimal amount;
    }

    // ── Invoice ──
    @Data @Builder @AllArgsConstructor
    public static class InvoiceResponse {
        private Long id; private Long studentId; private Long batchId; private String invoiceNumber;
        private BigDecimal totalAmount; private LocalDate dueDate; private Invoice.InvoiceStatus status;
        public static InvoiceResponse from(Invoice i) {
            return InvoiceResponse.builder().id(i.getId()).studentId(i.getStudentId()).batchId(i.getBatchId())
                    .invoiceNumber(i.getInvoiceNumber()).totalAmount(i.getTotalAmount()).dueDate(i.getDueDate())
                    .status(i.getStatus()).build();
        }
    }
    @Data
    public static class InvoiceRequest {
        private Long studentId; private Long batchId; private String invoiceNumber;
        private BigDecimal totalAmount; private LocalDate dueDate;
    }

    // ── Payment ──
    @Data @Builder @AllArgsConstructor
    public static class PaymentResponse {
        private Long id; private Long invoiceId; private BigDecimal amount;
        private Payment.PaymentMethod paymentMethod; private String transactionRef; private LocalDateTime paidAt;
        public static PaymentResponse from(Payment p) {
            return PaymentResponse.builder().id(p.getId()).invoiceId(p.getInvoiceId()).amount(p.getAmount())
                    .paymentMethod(p.getPaymentMethod()).transactionRef(p.getTransactionRef()).paidAt(p.getPaidAt()).build();
        }
    }
    @Data
    public static class PaymentRequest {
        private Long invoiceId; private BigDecimal amount;
        private Payment.PaymentMethod paymentMethod; private String transactionRef;
    }

    // ── Receipt ──
    @Data @Builder @AllArgsConstructor
    public static class ReceiptResponse {
        private Long id; private Long paymentId; private String receiptNumber; private String fileUrl;
        public static ReceiptResponse from(Receipt r) {
            return ReceiptResponse.builder().id(r.getId()).paymentId(r.getPaymentId())
                    .receiptNumber(r.getReceiptNumber()).fileUrl(r.getFileUrl()).build();
        }
    }
    @Data
    public static class ReceiptRequest {
        private Long paymentId; private String receiptNumber; private String fileUrl;
    }
}
