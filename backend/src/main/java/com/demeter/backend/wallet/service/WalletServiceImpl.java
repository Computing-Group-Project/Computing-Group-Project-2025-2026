package com.demeter.backend.wallet.service;

import com.demeter.backend.wallet.dto.request.*;
import com.demeter.backend.wallet.dto.response.WalletBalanceResponse;
import com.demeter.backend.wallet.dto.response.WalletResponse;
import com.demeter.backend.wallet.dto.response.WalletTransactionResponse;
import com.demeter.backend.wallet.enums.TransactionStatus;
import com.demeter.backend.wallet.enums.TransactionType;
import com.demeter.backend.wallet.enums.WalletStatus;
import com.demeter.backend.wallet.model.Wallet;
import com.demeter.backend.wallet.model.WalletTransaction;
import com.demeter.backend.wallet.repo.WalletRepository;
import com.demeter.backend.wallet.repo.WalletTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WalletServiceImpl implements WalletService {

    private final WalletRepository walletRepository;
    private final WalletTransactionRepository walletTransactionRepository;
    private final WalletTransactionService walletTransactionService;
    private final ModelMapper modelMapper;



    @Override
    @Transactional
    public WalletResponse createWallet(CreateWalletRequest request) {
        boolean exists = walletRepository.existsByUserId(request.getUserId());
        if (exists) {
            throw new IllegalArgumentException("Wallet already exists for userId: " + request.getUserId());
        }

        Wallet wallet = Wallet.builder()
                .userId(request.getUserId())
                .balance(request.getInitialBalance() == null ? 0L : request.getInitialBalance())
                .status(WalletStatus.ACTIVE)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        Wallet saved = walletRepository.save(wallet);
        return modelMapper.map(saved, WalletResponse.class);
    }

    @Override
    public WalletResponse getWalletByUserId(Long userId) {
        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Wallet not found for userId: " + userId));
        return modelMapper.map(wallet, WalletResponse.class);
    }

    @Override
    public WalletResponse getWalletById(Long walletId) {
        Wallet wallet = walletRepository.findById(walletId)
                .orElseThrow(() -> new IllegalArgumentException("Wallet not found: " + walletId));
        return modelMapper.map(wallet, WalletResponse.class);
    }

    @Override
    public WalletBalanceResponse getWalletBalance(Long walletId) {
        Wallet wallet = walletRepository.findById(walletId)
                .orElseThrow(() -> new IllegalArgumentException("Wallet not found: " + walletId));

        WalletBalanceResponse res = new WalletBalanceResponse();
        res.setWalletId(wallet.getId());
        res.setUserId(wallet.getUserId());
        res.setBalance(wallet.getBalance());
        res.setStatus(wallet.getStatus());
        return res;
    }

    @Override
    @Transactional
    public WalletTransactionResponse credit(CreditRequest request) {
        validatePositiveAmount(request.getAmount());

        Wallet wallet = walletRepository.findByIdForUpdate(request.getWalletId())
                .orElseThrow(() -> new IllegalArgumentException("Wallet not found: " + request.getWalletId()));

        ensureWalletActive(wallet);

        WalletTransaction tx = walletTransactionService.createTransaction(
                wallet.getId(),
                request.getAmount(),
                TransactionType.CREDIT,
                TransactionStatus.PENDING,
                request.getReferenceId(),
                request.getDescription()
        );

        wallet.setBalance(wallet.getBalance() + request.getAmount());
        wallet.setUpdatedAt(Instant.now());
        walletRepository.save(wallet);

        tx = walletTransactionService.markSuccess(tx.getId());
        return modelMapper.map(tx, WalletTransactionResponse.class);
    }

    @Override
    @Transactional
    public WalletTransactionResponse debit(DebitRequest request) {
        validatePositiveAmount(request.getAmount());

        Wallet wallet = walletRepository.findByIdForUpdate(request.getWalletId())
                .orElseThrow(() -> new IllegalArgumentException("Wallet not found: " + request.getWalletId()));

        ensureWalletActive(wallet);

        WalletTransaction tx = walletTransactionService.createTransaction(
                wallet.getId(),
                request.getAmount(),
                TransactionType.DEBIT,
                TransactionStatus.PENDING,
                request.getReferenceId(),
                request.getDescription()
        );

        if (wallet.getBalance() < request.getAmount()) {
            walletTransactionService.markFailed(tx.getId(), "Insufficient balance");
            throw new IllegalStateException("Insufficient balance");
        }

        wallet.setBalance(wallet.getBalance() - request.getAmount());
        wallet.setUpdatedAt(Instant.now());
        walletRepository.save(wallet);

        tx = walletTransactionService.markSuccess(tx.getId());
        return modelMapper.map(tx, WalletTransactionResponse.class);
    }

    @Override
    @Transactional
    public WalletTransactionResponse charge(ChargeRequest request) {
        validatePositiveAmount(request.getAmount());

        Wallet wallet = walletRepository.findByUserIdForUpdate(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("Wallet not found for userId: " + request.getUserId()));

        ensureWalletActive(wallet);

        WalletTransaction tx = walletTransactionService.createTransaction(
                wallet.getId(),
                request.getAmount(),
                TransactionType.DEBIT,
                TransactionStatus.PENDING,
                request.getReferenceId(),
                request.getDescription()
        );

        if (wallet.getBalance() < request.getAmount()) {
            walletTransactionService.markFailed(tx.getId(), "Insufficient balance");
            throw new IllegalStateException("Insufficient balance");
        }

        wallet.setBalance(wallet.getBalance() - request.getAmount());
        wallet.setUpdatedAt(Instant.now());
        walletRepository.save(wallet);

        tx = walletTransactionService.markSuccess(tx.getId());
        return modelMapper.map(tx, WalletTransactionResponse.class);
    }

    @Override
    @Transactional
    public WalletTransactionResponse refund(RefundRequest request) {
        validatePositiveAmount(request.getAmount());

        Wallet wallet = walletRepository.findByUserIdForUpdate(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("Wallet not found for userId: " + request.getUserId()));

        ensureWalletActive(wallet);

        WalletTransaction tx = walletTransactionService.createTransaction(
                wallet.getId(),
                request.getAmount(),
                TransactionType.CREDIT,
                TransactionStatus.PENDING,
                request.getReferenceId(),
                request.getDescription()
        );

        wallet.setBalance(wallet.getBalance() + request.getAmount());
        wallet.setUpdatedAt(Instant.now());
        walletRepository.save(wallet);

        tx = walletTransactionService.markSuccess(tx.getId());
        return modelMapper.map(tx, WalletTransactionResponse.class);
    }

    @Override
    @Transactional
    public WalletResponse freezeWallet(Long walletId) {
        Wallet wallet = walletRepository.findByIdForUpdate(walletId)
                .orElseThrow(() -> new IllegalArgumentException("Wallet not found: " + walletId));

        wallet.setStatus(WalletStatus.FROZEN);
        wallet.setUpdatedAt(Instant.now());
        return modelMapper.map(walletRepository.save(wallet), WalletResponse.class);
    }

    @Override
    @Transactional
    public WalletResponse unfreezeWallet(Long walletId) {
        Wallet wallet = walletRepository.findByIdForUpdate(walletId)
                .orElseThrow(() -> new IllegalArgumentException("Wallet not found: " + walletId));

        wallet.setStatus(WalletStatus.ACTIVE);
        wallet.setUpdatedAt(Instant.now());
        return modelMapper.map(walletRepository.save(wallet), WalletResponse.class);
    }

    @Override
    public List<WalletTransactionResponse> getWalletTransactions(Long walletId) {
        return walletTransactionRepository.findByWalletIdOrderByCreatedAtDesc(walletId)
                .stream()
                .map(tx -> modelMapper.map(tx, WalletTransactionResponse.class))
                .collect(Collectors.toList());
    }

    @Override
    public WalletTransactionResponse getTransactionById(Long transactionId) {
        WalletTransaction tx = walletTransactionService.getById(transactionId);
        return modelMapper.map(tx, WalletTransactionResponse.class);
    }

    private void validatePositiveAmount(Long amount) {
        if (amount == null || amount <= 0) {
            throw new IllegalArgumentException("Amount must be > 0");
        }
    }

    private void ensureWalletActive(Wallet wallet) {
        if (wallet.getStatus() == WalletStatus.FROZEN) {
            throw new IllegalStateException("Wallet is frozen");
        }
        if (wallet.getStatus() == WalletStatus.SUSPENDED) {
            throw new IllegalStateException("Wallet is suspended");
        }
    }

}