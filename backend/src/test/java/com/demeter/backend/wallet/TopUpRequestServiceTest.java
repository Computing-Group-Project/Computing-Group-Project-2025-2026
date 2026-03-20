package com.demeter.backend.wallet;

import com.demeter.backend.shared.exception.AppException;
import com.demeter.backend.wallet.dto.PendingTopUp;
import com.demeter.backend.wallet.service.KrakensWalletService;
import com.demeter.backend.wallet.service.TopUpRequestService;
import com.demeter.backend.ws.NotificationMessage;
import com.demeter.backend.ws.NotificationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TopUpRequestServiceTest {

    @Mock
    private KrakensWalletService walletService;

    @Mock
    private NotificationService notificationService;

    private TopUpRequestService topUpRequestService;

    @BeforeEach
    void setUp() {
        topUpRequestService = new TopUpRequestService(walletService, notificationService);
    }

    @Test
    void createRequest_shouldStoreAndNotifyAdmin() {
        PendingTopUp result = topUpRequestService.createRequest(1L, "garen", new BigDecimal("100.00"));

        assertNotNull(result);
        assertEquals(1L, result.getUserId());
        assertEquals("garen", result.getUsername());
        assertEquals(new BigDecimal("100.00"), result.getAmount());
        assertNotNull(result.getRequestedAt());

        verify(notificationService).sendToAdmin(any(NotificationMessage.class));
    }

    @Test
    void createRequest_shouldIncrementIds() {
        PendingTopUp first = topUpRequestService.createRequest(1L, "garen", new BigDecimal("50.00"));
        PendingTopUp second = topUpRequestService.createRequest(2L, "lux", new BigDecimal("100.00"));

        assertTrue(second.getRequestId() > first.getRequestId());
    }

    @Test
    void getPendingRequests_shouldReturnAll() {
        topUpRequestService.createRequest(1L, "garen", new BigDecimal("50.00"));
        topUpRequestService.createRequest(2L, "lux", new BigDecimal("100.00"));
        topUpRequestService.createRequest(3L, "fiora", new BigDecimal("200.00"));

        List<PendingTopUp> pending = topUpRequestService.getPendingRequests();

        assertEquals(3, pending.size());
    }

    @Test
    void approveRequest_shouldCreditAndNotifyStudent() {
        when(walletService.credit(eq(1L), eq(new BigDecimal("100.00")), anyString(), any()))
                .thenReturn(new BigDecimal("200.00"));

        PendingTopUp created = topUpRequestService.createRequest(1L, "garen", new BigDecimal("100.00"));
        PendingTopUp approved = topUpRequestService.approveRequest(created.getRequestId());

        assertEquals("garen", approved.getUsername());
        assertEquals(new BigDecimal("100.00"), approved.getAmount());

        verify(walletService).credit(eq(1L), eq(new BigDecimal("100.00")), anyString(), any());
        verify(notificationService).sendToUser(eq("garen"), any(NotificationMessage.class));

        // Should be removed from pending
        assertTrue(topUpRequestService.getPendingRequests().isEmpty());
    }

    @Test
    void approveRequest_notFound_shouldThrow() {
        assertThrows(AppException.class, () -> topUpRequestService.approveRequest(999));
    }

    @Test
    void rejectRequest_shouldRemoveAndNotifyStudent() {
        PendingTopUp created = topUpRequestService.createRequest(1L, "garen", new BigDecimal("100.00"));
        PendingTopUp rejected = topUpRequestService.rejectRequest(created.getRequestId());

        assertEquals("garen", rejected.getUsername());

        verify(notificationService).sendToUser(eq("garen"), any(NotificationMessage.class));
        verifyNoInteractions(walletService);

        assertTrue(topUpRequestService.getPendingRequests().isEmpty());
    }

    @Test
    void rejectRequest_notFound_shouldThrow() {
        assertThrows(AppException.class, () -> topUpRequestService.rejectRequest(999));
    }
}
