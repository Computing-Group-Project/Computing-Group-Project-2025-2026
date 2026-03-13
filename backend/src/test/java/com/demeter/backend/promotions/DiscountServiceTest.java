package com.demeter.backend.promotions;

import com.demeter.backend.promotions.model.Discount;
import com.demeter.backend.promotions.repo.DiscountRepository;
import com.demeter.backend.promotions.service.DiscountService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DiscountServiceTest {

    @Mock
    private DiscountRepository discountRepository;

    @InjectMocks
    private DiscountService discountService;

    private Discount createTestDiscount() {
        Discount d = new Discount(1, "PERCENTAGE", BigDecimal.valueOf(20), "Burger", "Min order 2");
        d.setDiscountId(1);
        d.setIsActive(true);
        return d;
    }

    @Test
    void createDiscount_shouldSaveAndReturn() {
        Discount discount = createTestDiscount();
        when(discountRepository.save(any(Discount.class))).thenReturn(discount);

        Discount result = discountService.createDiscount(discount);

        assertNotNull(result.getDiscountId());
        assertEquals("PERCENTAGE", result.getDiscountType());
        verify(discountRepository).save(discount);
    }

    @Test
    void getActiveDiscounts_shouldReturnOnlyActive() {
        Discount active = createTestDiscount();
        when(discountRepository.findByIsActive(true)).thenReturn(List.of(active));

        List<Discount> result = discountService.getActiveDiscounts();

        assertEquals(1, result.size());
        assertTrue(result.get(0).getIsActive());
    }

    @Test
    void getDiscountsByCafeteria_shouldFilterByCafeteriaId() {
        Discount d = createTestDiscount();
        when(discountRepository.findByCafeteriaId(1)).thenReturn(List.of(d));

        List<Discount> result = discountService.getDiscountsByCafeteria(1);

        assertEquals(1, result.size());
        assertEquals(1, result.get(0).getCafeteriaId());
    }

    @Test
    void getPendingAIDiscounts_shouldReturnUnapprovedAIDiscounts() {
        Discount d = createTestDiscount();
        d.setAiGenerated(true);
        d.setApprovedBy(null);

        when(discountRepository.findByAiGeneratedAndApprovedByIsNull(true)).thenReturn(List.of(d));

        List<Discount> result = discountService.getPendingAIDiscounts();

        assertEquals(1, result.size());
        assertTrue(result.get(0).getAiGenerated());
        assertNull(result.get(0).getApprovedBy());
    }

    @Test
    void approveDiscount_shouldSetApprovedByAndActivate() {
        Discount d = createTestDiscount();
        d.setApprovedBy(null);

        when(discountRepository.findById(1)).thenReturn(Optional.of(d));
        when(discountRepository.save(any(Discount.class))).thenAnswer(i -> i.getArgument(0));

        Discount result = discountService.approveDiscount(1, 42);

        assertEquals(42, result.getApprovedBy());
        assertTrue(result.getIsActive());
    }

    @Test
    void rejectDiscount_shouldDeactivate() {
        Discount d = createTestDiscount();

        when(discountRepository.findById(1)).thenReturn(Optional.of(d));
        when(discountRepository.save(any(Discount.class))).thenAnswer(i -> i.getArgument(0));

        Discount result = discountService.rejectDiscount(1);

        assertFalse(result.getIsActive());
    }

    @Test
    void deactivateDiscount_shouldSetInactive() {
        Discount d = createTestDiscount();

        when(discountRepository.findById(1)).thenReturn(Optional.of(d));
        when(discountRepository.save(any(Discount.class))).thenAnswer(i -> i.getArgument(0));

        Discount result = discountService.deactivateDiscount(1);

        assertFalse(result.getIsActive());
    }

    @Test
    void approveDiscount_withInvalidId_shouldThrow() {
        when(discountRepository.findById(999)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class,
                () -> discountService.approveDiscount(999, 42));
    }
}
