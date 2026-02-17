package com.demeter.backend.wallet.controller;

import com.demeter.backend.wallet.dto.request.SaveCardRequest;
import com.demeter.backend.wallet.mapper.WalletExtraMapper;
import com.demeter.backend.wallet.security.CurrentUserIdProvider;
import com.demeter.backend.wallet.service.SavedCardService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/wallet/cards")
@RequiredArgsConstructor
public class WalletCardsController {

    private final CurrentUserIdProvider currentUserIdProvider;
    private final SavedCardService savedCardService;
    private final WalletExtraMapper mapper;

    @PostMapping
    public Object save(@Valid @RequestBody SaveCardRequest req) {
        Long userId = currentUserIdProvider.getUserIdOrThrow();
        var saved = savedCardService.saveCard(userId, req);
        return mapper.toCardResponse(saved);
    }

    @GetMapping
    public Object list() {
        Long userId = currentUserIdProvider.getUserIdOrThrow();
        return savedCardService.list(userId)
                .stream()
                .map(mapper::toCardResponse)
                .collect(Collectors.toList());
    }

    @PutMapping("/{cardId}/default")
    public void setDefault(@PathVariable Long cardId) {
        Long userId = currentUserIdProvider.getUserIdOrThrow();
        savedCardService.setDefault(userId, cardId);
    }

    @DeleteMapping("/{cardId}")
    public void delete(@PathVariable Long cardId) {
        Long userId = currentUserIdProvider.getUserIdOrThrow();
        savedCardService.delete(userId, cardId);
    }
}