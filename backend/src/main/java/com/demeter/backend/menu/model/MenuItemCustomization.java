package com.demeter.backend.menu.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name = "MenuItemCustomization")
public class MenuItemCustomization {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "customization_id")
    private Long customizationId;

    @Column(name = "ingredient_name")
    private String ingredientName;

    @Column(name = "modification_type")
    private String modificationType;

    @Column(name = "price_adjustment")
    private Double priceAdjustment;

    @Column(name = "is_available")
    private boolean available = true;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "item_id")
    private Menu menu;

    public MenuItemCustomization() {}

    public MenuItemCustomization(String ingredientName, String modificationType, Double priceAdjustment, Menu menu) {
        this.ingredientName = ingredientName;
        this.modificationType = modificationType;
        this.priceAdjustment = priceAdjustment;
        this.menu = menu;
    }

}
