package com.demeter.backend.wallet.service;

import com.demeter.backend.shared.enums.ErrorCode;
import com.demeter.backend.shared.exception.AppException;
import com.demeter.backend.shared.util.LogActivity;
import com.demeter.backend.wallet.dto.PendingTopUp;
import com.demeter.backend.ws.NotificationMessage;
import com.demeter.backend.ws.NotificationService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class TopUpRequestService {

    private final ConcurrentHashMap<Integer, PendingTopUp> pendingRequests = new ConcurrentHashMap<>();
    private final AtomicInteger idGenerator = new AtomicInteger(1);

    private final KrakensWalletService walletService;
    private final NotificationService notificationService;

    public TopUpRequestService(KrakensWalletService walletService, NotificationService notificationService) {
        this.walletService = walletService;
        this.notificationService = notificationService;
    }

    public PendingTopUp createRequest(Long userId, String username, BigDecimal amount) {
        int id = idGenerator.getAndIncrement();
        PendingTopUp request = new PendingTopUp(id, userId, username, amount);
        pendingRequests.put(id, request);

        notificationService.sendToAdmin(new NotificationMessage(
                "TOPUP_REQUEST",
                "New Top-Up Request",
                username + " requested " + amount + " GK top-up",
                null,
                "PENDING"
        ));

        return request;
    }

    public List<PendingTopUp> getPendingRequests() {
        return pendingRequests.values().stream()
                .sorted(Comparator.comparing(PendingTopUp::getRequestedAt))
                .toList();
    }

    @LogActivity(action = "APPROVE_TOPUP", targetTable = "TRANSACTION_HISTORY")
    public PendingTopUp approveRequest(int requestId) {
        PendingTopUp request = pendingRequests.remove(requestId);
        if (request == null) {
            throw new AppException(ErrorCode.TOPUP_REQUEST_NOT_FOUND);
        }

        walletService.credit(
                request.getUserId(),
                request.getAmount(),
                "Approved top-up request #" + requestId,
                null
        );

        notificationService.sendToUser(request.getUsername(), new NotificationMessage(
                "TOPUP_APPROVED",
                "Top-Up Approved",
                "Your request for " + request.getAmount() + " GK has been approved",
                null,
                "APPROVED"
        ));

        return request;
    }

    @LogActivity(action = "REJECT_TOPUP", targetTable = "TRANSACTION_HISTORY")
    public PendingTopUp rejectRequest(int requestId) {
        PendingTopUp request = pendingRequests.remove(requestId);
        if (request == null) {
            throw new AppException(ErrorCode.TOPUP_REQUEST_NOT_FOUND);
        }

        notificationService.sendToUser(request.getUsername(), new NotificationMessage(
                "TOPUP_REJECTED",
                "Top-Up Rejected",
                "Your request for " + request.getAmount() + " GK has been rejected",
                null,
                "REJECTED"
        ));

        return request;
    }
}
