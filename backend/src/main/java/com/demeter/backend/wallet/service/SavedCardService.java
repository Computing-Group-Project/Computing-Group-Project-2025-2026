package com.demeter.backend.wallet.service;

import com.demeter.backend.wallet.dto.request.SaveCardRequest;
import com.demeter.backend.wallet.enums.SavedCardStatus;
import com.demeter.backend.wallet.model.SavedCard;
import com.demeter.backend.wallet.repo.SavedCardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SavedCardService {

    private final SavedCardRepository savedCardRepository;

    @Transactional
    public SavedCard saveCard(Long userId, SaveCardRequest req) {
        SavedCard card = SavedCard.builder()
                .userId(userId)
                .provider(req.getProvider())
                .providerPaymentMethodId(req.getProviderPaymentMethodId())
                .brand(req.getBrand())
                .last4(req.getLast4())
                .expMonth(req.getExpMonth())
                .expYear(req.getExpYear())
                .isDefault(false)
                .status(SavedCardStatus.ACTIVE)
                .build();

        card = savedCardRepository.save(card);

        if (req.isSetDefault()) {
            setDefault(userId, card.getId());
        }
        return card;
    }

    public List<SavedCard> list(Long userId) {
        return savedCardRepository.findByUserIdOrderByIsDefaultDescIdDesc(userId);
    }

    @Transactional
    public void setDefault(Long userId, Long cardId) {
        SavedCard card = savedCardRepository.findByIdAndUserId(cardId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Card not found"));

        // unset old default(s)
        List<SavedCard> defaults = savedCardRepository.findByUserIdAndIsDefaultTrue(userId);
        for (SavedCard c : defaults) {
            if (!c.getId().equals(cardId)) {
                c.setDefault(false);
                savedCardRepository.save(c);
            }
        }

        card.setDefault(true);
        savedCardRepository.save(card);
    }

    @Transactional
    public void delete(Long userId, Long cardId) {
        SavedCard card = savedCardRepository.findByIdAndUserId(cardId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Card not found"));
        savedCardRepository.delete(card);
    }
}