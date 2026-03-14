package com.demeter.backend.orders;

import com.demeter.backend.orders.model.Order;
import com.demeter.backend.orders.repo.OrderRepository;
import com.demeter.backend.orders.service.OrderService;
import com.demeter.backend.shared.enums.ErrorCode;
import com.demeter.backend.shared.enums.OrderStatus;
import com.demeter.backend.shared.exception.AppException;
import com.demeter.backend.wallet.service.KrakensWalletService;
import com.demeter.backend.ws.NotificationService;
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
class OrderServiceTest {

    @Mock
    private OrderRepository repo;

    @Mock
    private KrakensWalletService walletService;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private OrderService orderService;

    @Test
    void placeOrder_shouldSetStatusToPlacedAndSave() {
        Order order = new Order(1L, 1L, 45.0);

        when(walletService.debit(eq(1L), any(BigDecimal.class), anyString(), any()))
                .thenReturn(new BigDecimal("55.00"));
        when(repo.save(any(Order.class))).thenAnswer(invocation -> {
            Order saved = invocation.getArgument(0);
            saved.setOrderId(1L);
            return saved;
        });

        Order result = orderService.placeOrder(order);

        assertEquals(OrderStatus.PLACED, result.getStatus());
        assertNotNull(result.getOrderId());
        verify(repo).save(order);
        verify(walletService).debit(eq(1L), any(BigDecimal.class), anyString(), any());
        verify(notificationService).sendToStaff(any());
    }

    @Test
    void updateStatus_withValidId_shouldUpdateAndSave() {
        Order existing = new Order(1L, 1L, 45.0);
        existing.setOrderId(1L);
        existing.setStatus(OrderStatus.PLACED);

        when(repo.findById(1L)).thenReturn(Optional.of(existing));
        when(repo.save(any(Order.class))).thenReturn(existing);

        Order result = orderService.updateStatus(1L, OrderStatus.PREPARING);

        assertEquals(OrderStatus.PREPARING, result.getStatus());
        verify(repo).save(existing);
        verify(notificationService).sendOrderUpdate(any());
    }

    @Test
    void updateStatus_withInvalidId_shouldThrowAppException() {
        when(repo.findById(999L)).thenReturn(Optional.empty());

        AppException ex = assertThrows(AppException.class,
                () -> orderService.updateStatus(999L, OrderStatus.PREPARING));
        assertEquals(ErrorCode.ORDER_NOT_FOUND, ex.getErrorCode());
    }

    @Test
    void getOrdersByUser_shouldReturnUserOrders() {
        Order o1 = new Order(1L, 1L, 45.0);
        Order o2 = new Order(1L, 2L, 20.0);

        when(repo.findByUserId(1L)).thenReturn(List.of(o1, o2));

        List<Order> result = orderService.getOrdersByUser(1L);

        assertEquals(2, result.size());
        verify(repo).findByUserId(1L);
    }

    @Test
    void getAllOrders_shouldReturnAll() {
        when(repo.findAll()).thenReturn(List.of(new Order(), new Order(), new Order()));

        List<Order> result = orderService.getAllOrders();

        assertEquals(3, result.size());
    }
}
