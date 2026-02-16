package com.demeter.backend.menu.model;

import jakarta.persistence.*;

@Entity
@Table(name = "customization_options")
public class CustomizationOption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long optionId;

    private String name;
    private Double extraPrice;

    @ManyToOne
    @JoinColumn(name = "customization_id")
    private Customization customization;

    public CustomizationOption() {}

    public CustomizationOption(String name, Double extraPrice, Customization customization) {
        this.name = name;
        this.extraPrice = extraPrice;
        this.customization = customization;
    }

    public Long getOptionId() { return optionId; }
    public void setOptionId(Long optionId) { this.optionId = optionId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Double getExtraPrice() { return extraPrice; }
    public void setExtraPrice(Double extraPrice) { this.extraPrice = extraPrice; }

    public Customization getCustomization() { return customization; }
    public void setCustomization(Customization customization) { this.customization = customization; }
}
