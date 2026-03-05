import React from "react";
import "./Checkout.css";

const Checkout = () => {
    return (
        <div className="checkout-page dark">
            {/* Top Bar */}
            <div className="top-bar dark">
                <div className="top-left">
                    <div className="logo-circle">D</div>
                    <span className="logo-text">Demeter</span>
                </div>

                <div className="top-right">
                    <button className="icon-btn">
                        <i className="fa-regular fa-sun"></i> {/* theme toggle */}
                    </button>
                    <button className="icon-btn">
                        <i className="fa-solid fa-right-from-bracket"></i> {/* logout */}
                    </button>
                    <div className="balance-box">
                        450 GK <button className="plus-btn">+</button>
                    </div>
                    <span className="cart-emoji">🛒</span>
                </div>
            </div>

            {/* Checkout Container */}
            <div className="checkout-container">
                {/* LEFT SIDE */}
                <div className="checkout-left">
                    <h1 className="checkout-title">Shopping Cart</h1>

                    <div className="cart-item">
                        <img
                            src="https://via.placeholder.com/80"
                            alt="Neuro Burger"
                            className="cart-image"
                        />
                        <div className="cart-details">
                            <div className="cart-header">
                                <h3>Neuro-Burger</h3>
                                <span className="price">GK 45</span>
                            </div>
                            <div className="cart-footer">
                                <span className="qty">Qty: 1</span>
                                <button className="remove-btn">
                                    <i className="fa-regular fa-trash-can"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Pair Suggestion */}
                    <div className="pair-box">
                        <div className="pair-header">
                            <span>✨</span>
                            <p>Pairs well with your order</p>
                        </div>
                        <div className="pair-item">
                            <div className="pair-info">
                                <img src="https://via.placeholder.com/60" alt="Void Latte" />
                                <div>
                                    <h4>Void Latte</h4>
                                    <span>GK 15</span>
                                </div>
                            </div>
                            <button className="add-btn">Add</button>
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="checkout-right">
                    <div className="summary-card">
                        <h2>Order Summary</h2>
                        <div className="summary-row subtotal">
                            <span>Subtotal</span>
                            <span>GK 45</span>
                        </div>
                        <div className="summary-row total">
                            <span>Total</span>
                            <span>GK 45</span>
                        </div>
                        <div className="balance-box">
                            Current Balance: <strong>GK 374</strong>
                        </div>
                        <button className="pay-btn">
                            <img src="https://via.placeholder.com/24" alt="gold" />
                            Pay with Gold Krakens
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
