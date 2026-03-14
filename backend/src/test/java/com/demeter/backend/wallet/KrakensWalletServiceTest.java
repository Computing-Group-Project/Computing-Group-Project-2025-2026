package com.demeter.backend.wallet;

import com.demeter.backend.shared.exception.AppException;
import com.demeter.backend.transactions.model.TransactionHistory;
import com.demeter.backend.transactions.repo.TransactionHistoryRepository;
import com.demeter.backend.users.model.User;
import com.demeter.backend.users.repo.UserRepository;
import com.demeter.backend.wallet.service.KrakensWalletService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class KrakensWalletServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private TransactionHistoryRepository transactionHistoryRepository;

    private KrakensWalletService walletService;

    @BeforeEach
    void setUp() {
        walletService = new KrakensWalletService(userRepository, transactionHistoryRepository);
    }

    private User createUser(Long id, BigDecimal balance) {
        User user = new User();
        user.setId(id);
        user.setUsername("testuser");
        user.setPassword("hash");
        user.setRole("STUDENT");
        user.setKrakensBalance(balance);
        return user;
    }

    @Test
    void getBalance_shouldReturnUserBalance() {
        User user = createUser(1L, new BigDecimal("100.00"));
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        BigDecimal balance = walletService.getBalance(1L);
        assertEquals(new BigDecimal("100.00"), balance);
    }

    @Test
    void getBalance_userNotFound_shouldThrow() {
        when(userRepository.findById(999L)).thenReturn(Optional.empty());
        assertThrows(AppException.class, () -> walletService.getBalance(999L));
    }

    @Test
    void debit_shouldSubtractAndRecordTransaction() {
        User user = createUser(1L, new BigDecimal("100.00"));
        when(userRepository.findByIdForUpdate(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArgument(0));
        when(transactionHistoryRepository.save(any(TransactionHistory.class))).thenAnswer(i -> i.getArgument(0));

        BigDecimal newBalance = walletService.debit(1L, new BigDecimal("30.00"), "Test debit", null);

        assertEquals(new BigDecimal("70.00"), newBalance);
        verify(userRepository).save(user);
        verify(transactionHistoryRepository).save(any(TransactionHistory.class));
    }

    @Test
    void debit_insufficientBalance_shouldThrow() {
        User user = createUser(1L, new BigDecimal("10.00"));
        when(userRepository.findByIdForUpdate(1L)).thenReturn(Optional.of(user));

        assertThrows(AppException.class,
                () -> walletService.debit(1L, new BigDecimal("50.00"), "Test", null));
    }

    @Test
    void credit_shouldAddAndRecordTransaction() {
        User user = createUser(1L, new BigDecimal("100.00"));
        when(userRepository.findByIdForUpdate(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArgument(0));
        when(transactionHistoryRepository.save(any(TransactionHistory.class))).thenAnswer(i -> i.getArgument(0));

        BigDecimal newBalance = walletService.credit(1L, new BigDecimal("50.00"), "Test credit", null);

        assertEquals(new BigDecimal("150.00"), newBalance);
        verify(userRepository).save(user);
        verify(transactionHistoryRepository).save(any(TransactionHistory.class));
    }

    @Test
    void getTransactionHistory_shouldReturnTransactions() {
        User user = createUser(1L, new BigDecimal("100.00"));
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        TransactionHistory tx = new TransactionHistory();
        tx.setTransactionId(1L);
        tx.setUserId(1L);
        tx.setTransactionType("CREDIT");
        tx.setAmount(new BigDecimal("100.00"));

        when(transactionHistoryRepository.findByUserIdOrderByCreatedAtDesc(1L))
                .thenReturn(List.of(tx));

        List<TransactionHistory> result = walletService.getTransactionHistory(1L);
        assertEquals(1, result.size());
    }
}
