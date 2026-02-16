package com.demeter.backend.menu.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "customizations")
public class Customization {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long customizationId;

    private String name;

    @ManyToOne
    @JoinColumn(name = "menu_id")
    private Menu menu;

    @OneToMany(mappedBy = "customization", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CustomizationOption> options;

    public Customization() {}

    public Customization(String name, Menu menu) {
        this.name = name;
        this.menu = menu;
    }

    public Long getCustomizationId() { return customizationId; }
    public void setCustomizationId(Long customizationId) { this.customizationId = customizationId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Menu getMenu() { return menu; }
    public void setMenu(Menu menu) { this.menu = menu; }

    public List<CustomizationOption> getOptions() { return options; }
    public void setOptions(List<CustomizationOption> options) { this.options = options; }
}
