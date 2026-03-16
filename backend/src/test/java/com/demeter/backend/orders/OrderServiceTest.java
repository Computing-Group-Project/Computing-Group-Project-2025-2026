package com.demeter.backend.orders;

import com.demeter.backend.orders.model.Order;
import com.demeter.backend.orders.repo.OrderRepository;
import com.demeter.backend.orders.service.OrderService;
import com.demeter.backend.promotions.service.DiscountApplicationService;
import com.demeter.backend.shared.enums.ErrorCode;
import com.demeter.backend.shared.enums.OrderStatus;
import com.demeter.backend.shared.exception.AppException;
import com.demeter.backend.payments.model.Payment;
import com.demeter.backend.payments.repo.PaymentRepository;
import com.demeter.backend.transactions.model.TransactionHistory;
import com.demeter.backend.transactions.repo.TransactionHistoryRepository;
import com.demeter.backend.users.repo.UserRepository;
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

    @Mock
    private DiscountApplicationService discountApplicationService;

    @Mock
    private TransactionHistoryRepository transactionHistoryRepository;

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private OrderService orderService;

    @Test
    void placeOrder_shouldSetStatusToPlacedAndSave() {
        Order order = new Order(1L, 1L, new BigDecimal("45.00"));

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
        Order existing = new Order(1L, 1L, new BigDecimal("45.00"));
        existing.setOrderId(1L);
        existing.setStatus(OrderStatus.PLACED);

        when(repo.findById(1L)).thenReturn(Optional.of(existing));
        when(repo.save(any(Order.class))).thenReturn(existing);

        Order result = orderService.updateStatus(1L, OrderStatus.CONFIRMED);

        assertEquals(OrderStatus.CONFIRMED, result.getStatus());
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
    void cancelOrder_fromPlacedState_shouldRefundAndCancel() {
        Order existing = new Order(1L, 1L, new BigDecimal("100.00"));
        existing.setOrderId(5L);
        existing.setStatus(OrderStatus.PLACED);

        TransactionHistory debitTx = new TransactionHistory();
        debitTx.setAmount(new BigDecimal("90.00")); // discounted amount actually charged

        when(repo.findById(5L)).thenReturn(Optional.of(existing));
        when(transactionHistoryRepository.findByReferenceIdAndTransactionType(5, "DEBIT"))
                .thenReturn(Optional.of(debitTx));
        when(repo.save(any(Order.class))).thenReturn(existing);

        Order result = orderService.updateStatus(5L, OrderStatus.CANCELLED);

        assertEquals(OrderStatus.CANCELLED, result.getStatus());
        verify(walletService).credit(eq(1L), eq(new BigDecimal("90.00")), anyString(), eq(5));
        verify(notificationService).sendOrderUpdate(any());
    }

    @Test
    void cancelOrder_fromConfirmedState_shouldRefundAndCancel() {
        Order existing = new Order(1L, 1L, new BigDecimal("45.00"));
        existing.setOrderId(1L);
        existing.setStatus(OrderStatus.CONFIRMED);

        TransactionHistory debitTx = new TransactionHistory();
        debitTx.setAmount(new BigDecimal("45.00"));

        when(repo.findById(1L)).thenReturn(Optional.of(existing));
        when(transactionHistoryRepository.findByReferenceIdAndTransactionType(1, "DEBIT"))
                .thenReturn(Optional.of(debitTx));
        when(repo.save(any(Order.class))).thenReturn(existing);

        Order result = orderService.updateStatus(1L, OrderStatus.CANCELLED);

        assertEquals(OrderStatus.CANCELLED, result.getStatus());
        verify(walletService).credit(eq(1L), eq(new BigDecimal("45.00")), anyString(), eq(1));
    }

    @Test
    void cancelOrder_fromPreparingState_shouldThrow() {
        Order existing = new Order(1L, 1L, new BigDecimal("45.00"));
        existing.setOrderId(1L);
        existing.setStatus(OrderStatus.PREPARING);

        when(repo.findById(1L)).thenReturn(Optional.of(existing));

        AppException ex = assertThrows(AppException.class,
                () -> orderService.updateStatus(1L, OrderStatus.CANCELLED));
        assertEquals(ErrorCode.ORDER_CANNOT_BE_CANCELLED, ex.getErrorCode());
    }

    @Test
    void cancelOrder_refundsFallbackToTotalAmount_whenNoTransactionFound() {
        Order existing = new Order(1L, 1L, new BigDecimal("50.00"));
        existing.setOrderId(7L);
        existing.setStatus(OrderStatus.PLACED);

        when(repo.findById(7L)).thenReturn(Optional.of(existing));
        when(transactionHistoryRepository.findByReferenceIdAndTransactionType(7, "DEBIT"))
                .thenReturn(Optional.empty());
        when(repo.save(any(Order.class))).thenReturn(existing);

        orderService.updateStatus(7L, OrderStatus.CANCELLED);

        verify(walletService).credit(eq(1L), eq(new BigDecimal("50.00")), anyString(), eq(7));
    }

    @Test
    void getOrdersByUser_shouldReturnUserOrders() {
        Order o1 = new Order(1L, 1L, new BigDecimal("45.00"));
        Order o2 = new Order(1L, 2L, new BigDecimal("20.00"));

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

    @Test
    void updateStatus_invalidTransition_shouldThrow() {
        Order existing = new Order(1L, 1L, new BigDecimal("45.00"));
        existing.setOrderId(1L);
        existing.setStatus(OrderStatus.PLACED);

        when(repo.findById(1L)).thenReturn(Optional.of(existing));

        AppException ex = assertThrows(AppException.class,
                () -> orderService.updateStatus(1L, OrderStatus.READY));
        assertEquals(ErrorCode.INVALID_ORDER_TRANSITION, ex.getErrorCode());
    }

    @Test
    void updateStatus_fullLifecycle_succeeds() {
        Order order = new Order(1L, 1L, new BigDecimal("45.00"));
        order.setOrderId(1L);
        order.setStatus(OrderStatus.PLACED);

        when(repo.findById(1L)).thenReturn(Optional.of(order));
        when(repo.save(any(Order.class))).thenAnswer(inv -> inv.getArgument(0));

        orderService.updateStatus(1L, OrderStatus.CONFIRMED);
        assertEquals(OrderStatus.CONFIRMED, order.getStatus());

        orderService.updateStatus(1L, OrderStatus.PREPARING);
        assertEquals(OrderStatus.PREPARING, order.getStatus());

        orderService.updateStatus(1L, OrderStatus.READY);
        assertEquals(OrderStatus.READY, order.getStatus());

        orderService.updateStatus(1L, OrderStatus.COMPLETED);
        assertEquals(OrderStatus.COMPLETED, order.getStatus());
    }
}
