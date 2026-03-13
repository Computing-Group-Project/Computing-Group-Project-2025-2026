package com.demeter.backend.wallet;

import com.demeter.backend.wallet.enums.*;
import com.demeter.backend.wallet.model.Wallet;
import com.demeter.backend.wallet.model.WalletTransaction;
import com.demeter.backend.wallet.repo.SavedCardRepository;
import com.demeter.backend.wallet.repo.WalletRepository;
import com.demeter.backend.wallet.repo.WalletTransactionRepository;
import com.demeter.backend.wallet.service.WalletPaymentService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class WalletPaymentServiceTest {

    @Mock
    private SavedCardRepository savedCardRepository;

    @Mock
    private WalletRepository walletRepository;

    @Mock
    private WalletTransactionRepository txRepository;

    @InjectMocks
    private WalletPaymentService walletPaymentService;

    private Wallet createActiveWallet(Long id, Long balance) {
        return Wallet.builder()
                .id(id)
                .userId(1L)
                .balance(balance)
                .status(WalletStatus.ACTIVE)
                .createdAt(Instant.now())
                .build();
    }

    private WalletTransaction createPendingCreditTx(Long walletId, Long amount) {
        return WalletTransaction.builder()
                .id(1L)
                .walletId(walletId)
                .amount(amount)
                .type(TransactionType.CREDIT)
                .status(TransactionStatus.PENDING)
                .category(TransactionCategory.TOPUP)
                .source(TransactionSource.PAYMENT_GATEWAY)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();
    }

    // ── markPaymentSuccess Tests ──

    @Test
    void markPaymentSuccess_shouldCreditWalletAndMarkSuccess() {
        Wallet wallet = createActiveWallet(1L, 1000L);
        WalletTransaction tx = createPendingCreditTx(1L, 500L);

        when(txRepository.findById(1L)).thenReturn(Optional.of(tx));
        when(walletRepository.findByIdForUpdate(1L)).thenReturn(Optional.of(wallet));
        when(walletRepository.save(any(Wallet.class))).thenAnswer(i -> i.getArgument(0));
        when(txRepository.save(any(WalletTransaction.class))).thenAnswer(i -> i.getArgument(0));

        WalletTransaction result = walletPaymentService.markPaymentSuccess(1L);

        assertEquals(TransactionStatus.SUCCESS, result.getStatus());
        assertEquals(1500L, wallet.getBalance());
        verify(walletRepository).findByIdForUpdate(1L);
        verify(walletRepository).save(wallet);
    }

    @Test
    void markPaymentSuccess_withFrozenWallet_shouldThrow() {
        Wallet wallet = createActiveWallet(1L, 1000L);
        wallet.setStatus(WalletStatus.FROZEN);
        WalletTransaction tx = createPendingCreditTx(1L, 500L);

        when(txRepository.findById(1L)).thenReturn(Optional.of(tx));
        when(walletRepository.findByIdForUpdate(1L)).thenReturn(Optional.of(wallet));

        assertThrows(IllegalStateException.class,
                () -> walletPaymentService.markPaymentSuccess(1L));
    }

    @Test
    void markPaymentSuccess_alreadyCompleted_shouldThrow() {
        WalletTransaction tx = createPendingCreditTx(1L, 500L);
        tx.setStatus(TransactionStatus.SUCCESS);

        when(txRepository.findById(1L)).thenReturn(Optional.of(tx));

        assertThrows(IllegalStateException.class,
                () -> walletPaymentService.markPaymentSuccess(1L));
    }

    @Test
    void markPaymentSuccess_transactionNotFound_shouldThrow() {
        when(txRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class,
                () -> walletPaymentService.markPaymentSuccess(999L));
    }

    // ── markPaymentFailed Tests ──

    @Test
    void markPaymentFailed_shouldMarkFailedWithReason() {
        WalletTransaction tx = createPendingCreditTx(1L, 500L);

        when(txRepository.findById(1L)).thenReturn(Optional.of(tx));
        when(txRepository.save(any(WalletTransaction.class))).thenAnswer(i -> i.getArgument(0));

        WalletTransaction result = walletPaymentService.markPaymentFailed(1L, "Card declined");

        assertEquals(TransactionStatus.FAILED, result.getStatus());
        assertEquals("Card declined", result.getFailureReason());
    }

    @Test
    void markPaymentFailed_alreadyCompleted_shouldThrow() {
        WalletTransaction tx = createPendingCreditTx(1L, 500L);
        tx.setStatus(TransactionStatus.SUCCESS);

        when(txRepository.findById(1L)).thenReturn(Optional.of(tx));

        assertThrows(IllegalStateException.class,
                () -> walletPaymentService.markPaymentFailed(1L, "reason"));
    }

    // ── Debit transaction should not credit wallet ──

    @Test
    void markPaymentSuccess_debitTransaction_shouldNotCreditWallet() {
        WalletTransaction tx = createPendingCreditTx(1L, 500L);
        tx.setType(TransactionType.DEBIT);

        when(txRepository.findById(1L)).thenReturn(Optional.of(tx));
        when(txRepository.save(any(WalletTransaction.class))).thenAnswer(i -> i.getArgument(0));

        WalletTransaction result = walletPaymentService.markPaymentSuccess(1L);

        assertEquals(TransactionStatus.SUCCESS, result.getStatus());
        verify(walletRepository, never()).findByIdForUpdate(any());
        verify(walletRepository, never()).save(any());
    }
}
