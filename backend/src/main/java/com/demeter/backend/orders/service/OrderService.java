package com.demeter.backend.orders.service;

import com.demeter.backend.orders.model.Order;
import com.demeter.backend.orders.model.OrderItem;
import com.demeter.backend.promotions.service.DiscountApplicationService;
import com.demeter.backend.shared.enums.ErrorCode;
import com.demeter.backend.shared.enums.OrderStatus;
import com.demeter.backend.shared.exception.AppException;
import com.demeter.backend.orders.repo.OrderRepository;
import com.demeter.backend.shared.util.LogActivity;
import com.demeter.backend.transactions.repo.TransactionHistoryRepository;
import com.demeter.backend.wallet.service.KrakensWalletService;
import com.demeter.backend.ws.NotificationMessage;
import com.demeter.backend.ws.NotificationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {
    private final OrderRepository repo;
    private final KrakensWalletService walletService;
    private final NotificationService notificationService;
    private final DiscountApplicationService discountApplicationService;
    private final TransactionHistoryRepository transactionHistoryRepository;

    public OrderService(OrderRepository repo, KrakensWalletService walletService,
                        NotificationService notificationService,
                        DiscountApplicationService discountApplicationService,
                        TransactionHistoryRepository transactionHistoryRepository) {
        this.repo = repo;
        this.walletService = walletService;
        this.notificationService = notificationService;
        this.discountApplicationService = discountApplicationService;
        this.transactionHistoryRepository = transactionHistoryRepository;
    }

    @Transactional
    @LogActivity(action = "PLACE_ORDER", targetTable = "ORDER")
    public Order placeOrder(Order order) {
        order.setStatus(OrderStatus.PLACED);
        order.setCreatedAt(LocalDateTime.now());

        // Set back-reference for each item
        if (order.getItems() != null) {
            for (OrderItem item : order.getItems()) {
                item.setOrder(order);
                if (item.getSubtotal() == null && item.getUnitPrice() != null && item.getQuantity() != null) {
                    item.setSubtotal(item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
                }
            }
        }

        // Apply discount if provided
        BigDecimal chargeAmount = order.getTotalAmount();
        if (order.getAppliedDiscountId() != null && chargeAmount != null) {
            try {
                BigDecimal discountAmt = discountApplicationService.calculateDiscount(
                        order.getAppliedDiscountId(), chargeAmount);
                order.setDiscountAmount(discountAmt);
                chargeAmount = chargeAmount.subtract(discountAmt);
                order.setFinalAmount(chargeAmount);
            } catch (AppException e) {
                // If discount is invalid, proceed without discount
                order.setDiscountAmount(BigDecimal.ZERO);
                order.setFinalAmount(chargeAmount);
            }
        } else {
            order.setFinalAmount(chargeAmount);
        }

        // Save order first to get the orderId for reference
        Order saved = repo.save(order);

        // Then debit wallet with the final (discounted) amount
        if (chargeAmount != null && saved.getUserId() != null) {
            walletService.debit(
                    saved.getUserId(),
                    chargeAmount,
                    "Payment for order #" + saved.getOrderId(),
                    saved.getOrderId() != null ? saved.getOrderId().intValue() : null
            );
        }

        // Notify staff
        notificationService.sendToStaff(new NotificationMessage(
                "NEW_ORDER", "New Order",
                "New order #" + saved.getOrderId() + " placed",
                String.valueOf(saved.getOrderId()),
                OrderStatus.PLACED.name()
        ));

        return saved;
    }

    @Transactional
    @LogActivity(action = "UPDATE_ORDER_STATUS", targetTable = "ORDER")
    public Order updateStatus(Long id, OrderStatus status) {
        Order order = repo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        // Only allow cancellation from PLACED state (FR6)
        if (status == OrderStatus.CANCELLED) {
            if (order.getStatus() != OrderStatus.PLACED) {
                throw new AppException(ErrorCode.ORDER_CANNOT_BE_CANCELLED);
            }
            // Refund the actual charged amount by looking up the original debit transaction,
            // since finalAmount is @Transient and not persisted
            if (order.getUserId() != null && order.getOrderId() != null) {
                BigDecimal refundAmount = transactionHistoryRepository
                        .findByReferenceIdAndTransactionType(order.getOrderId().intValue(), "DEBIT")
                        .map(tx -> tx.getAmount())
                        .orElse(order.getTotalAmount());
                walletService.credit(
                        order.getUserId(),
                        refundAmount,
                        "Refund for cancelled order #" + order.getOrderId(),
                        order.getOrderId().intValue()
                );
            }
        }

        order.setStatus(status);

        if (status == OrderStatus.CONFIRMED) {
            order.setConfirmedAt(LocalDateTime.now());
        } else if (status == OrderStatus.COMPLETED) {
            order.setCompletedAt(LocalDateTime.now());
        }

        Order updated = repo.save(order);

        // Notify clients
        notificationService.sendOrderUpdate(new NotificationMessage(
                "ORDER_STATUS", "Order Updated",
                "Order #" + updated.getOrderId() + " is now " + status.name(),
                String.valueOf(updated.getOrderId()),
                status.name()
        ));

        return updated;
    }

    public List<Order> getOrdersByUser(Long userId) {
        return repo.findByUserId(userId);
    }

    public List<Order> getOrdersByCafeteria(Long cafeteriaId) {
        return repo.findByCafeteriaId(cafeteriaId);
    }

    public List<Order> getActiveOrdersByCafeteria(Long cafeteriaId) {
        return repo.findByCafeteriaIdAndStatusIn(cafeteriaId,
                List.of(OrderStatus.PLACED, OrderStatus.CONFIRMED, OrderStatus.PREPARING, OrderStatus.READY));
    }

    public List<Order> getAllOrders() {
        return repo.findAll();
    }
}
