package com.demeter.backend.menu.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "menus")
public class Menu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long menuId;

    private String name;
    private String description;
    private Double price;
    private boolean available = true;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @OneToMany(mappedBy = "menu", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Customization> customizations;

    public Menu() {}

    public Menu(String name, String description, Double price, Category category) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.category = category;
    }

    public Long getMenuId() { return menuId; }
    public void setMenuId(Long menuId) { this.menuId = menuId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public boolean isAvailable() { return available; }
    public void setAvailable(boolean available) { this.available = available; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }

    public List<Customization> getCustomizations() { return customizations; }
    public void setCustomizations(List<Customization> customizations) { this.customizations = customizations; }
}
