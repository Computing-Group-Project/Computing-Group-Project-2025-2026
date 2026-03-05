package com.demeter.backend.wallet.service;

import com.demeter.backend.wallet.dto.request.CardChargeRequest;
import com.demeter.backend.wallet.enums.*;
import com.demeter.backend.wallet.model.SavedCard;
import com.demeter.backend.wallet.model.Wallet;
import com.demeter.backend.wallet.model.WalletTransaction;
import com.demeter.backend.wallet.repo.SavedCardRepository;
import com.demeter.backend.wallet.repo.WalletRepository;
import com.demeter.backend.wallet.repo.WalletTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class WalletPaymentService {

    private final SavedCardRepository savedCardRepository;
    private final WalletRepository walletRepository;
    private final WalletTransactionRepository txRepository;

    @Transactional
    public WalletTransaction createCardCharge(Long userId, CardChargeRequest req) {

        SavedCard selectedCard = selectCardForUser(userId, req.getSavedCardId());

        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Wallet not found"));

        if (wallet.getStatus() != WalletStatus.ACTIVE) {
            throw new IllegalStateException("Wallet is not active");
        }

        TransactionCategory category = (req.getCategory() != null)
                ? req.getCategory()
                : TransactionCategory.TOPUP;

        // For card->wallet, this is a CREDIT once payment succeeds.
        WalletTransaction tx = WalletTransaction.builder()
                .walletId(wallet.getId())
                .amount(req.getAmount())
                .type(TransactionType.CREDIT)
                .status(TransactionStatus.PENDING)
                .category(category)
                .source(TransactionSource.PAYMENT_GATEWAY)
                .referenceId(req.getReferenceId())
                .description(buildChargeDescription(req.getDescription(), selectedCard))
                .failureReason(null)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        return txRepository.save(tx);
    }

    private String buildChargeDescription(String description, SavedCard card) {
        String cardInfo = "";
        if (card.getBrand() != null && card.getLast4() != null) {
            cardInfo = " | card=" + card.getBrand() + " ****" + card.getLast4();
        } else if (card.getLast4() != null) {
            cardInfo = " | card=****" + card.getLast4();
        }
        if (description == null || description.isBlank()) {
            return "Card charge" + cardInfo;
        }
        return description + cardInfo;
    }

    private SavedCard selectCardForUser(Long userId, Long savedCardId) {

        if (savedCardId != null) {
            SavedCard card = savedCardRepository.findByIdAndUserId(savedCardId, userId)
                    .orElseThrow(() -> new IllegalArgumentException("Saved card not found"));

            if (card.getStatus() != SavedCardStatus.ACTIVE) {
                throw new IllegalStateException("Selected card is not active");
            }
            return card;
        }

        // try default ACTIVE card
        var defaultCard = savedCardRepository.findFirstByUserIdAndIsDefaultTrueAndStatus(
                userId, SavedCardStatus.ACTIVE
        );
        if (defaultCard.isPresent()) {
            return defaultCard.get();
        }

        // fallback to newest ACTIVE card
        var newestActive = savedCardRepository.findFirstByUserIdAndStatusOrderByIdDesc(
                userId, SavedCardStatus.ACTIVE
        );
        if (newestActive.isPresent()) {
            return newestActive.get();
        }

        throw new IllegalStateException("No active saved cards found. Please save a card first.");
    }

    @Transactional
    public WalletTransaction markPaymentSuccess(Long transactionId) {
        WalletTransaction tx = txRepository.findById(transactionId)
                .orElseThrow(() -> new IllegalArgumentException("Transaction not found"));

        if (tx.getStatus() != TransactionStatus.PENDING) {
            throw new IllegalStateException("Only PENDING transactions can be marked SUCCESS");
        }

        if (tx.getType() == TransactionType.CREDIT) {
            Wallet wallet = walletRepository.findById(tx.getWalletId())
                    .orElseThrow(() -> new IllegalArgumentException("Wallet not found"));

            if (wallet.getStatus() != WalletStatus.ACTIVE) {
                throw new IllegalStateException("Wallet is not active");
            }

            wallet.setBalance(wallet.getBalance() + tx.getAmount());
            walletRepository.save(wallet);
        }

        tx.setStatus(TransactionStatus.SUCCESS);
        tx.setUpdatedAt(Instant.now());
        return txRepository.save(tx);
    }

    @Transactional
    public WalletTransaction markPaymentFailed(Long transactionId, String reason) {
        WalletTransaction tx = txRepository.findById(transactionId)
                .orElseThrow(() -> new IllegalArgumentException("Transaction not found"));

        if (tx.getStatus() != TransactionStatus.PENDING) {
            throw new IllegalStateException("Only PENDING transactions can be marked FAILED");
        }

        tx.setStatus(TransactionStatus.FAILED);
        tx.setFailureReason(reason);
        tx.setUpdatedAt(Instant.now());
        return txRepository.save(tx);
    }
}