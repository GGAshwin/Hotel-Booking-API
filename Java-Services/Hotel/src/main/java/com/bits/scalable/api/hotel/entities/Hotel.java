package com.bits.scalable.api.hotel.entities;

import jakarta.persistence.*;
import java.util.Map;
import java.util.UUID;

@Entity
public class Hotel {
    @Id
    @GeneratedValue
    private UUID id;

    private String name;
    private String location;

    @ElementCollection
    @CollectionTable(name = "hotel_amenities", joinColumns = @JoinColumn(name = "hotel_id"))
    @MapKeyColumn(name = "amenity_name")
    @Column(name = "amenity_value")
    private Map<String, Boolean> amenities;

    private String description;
    private double rating;

    @Column(name = "manager_id")
    private UUID managerId;

    // Getters and Setters

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Map<String, Boolean> getAmenities() {
        return amenities;
    }

    public void setAmenities(Map<String, Boolean> amenities) {
        this.amenities = amenities;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }

    public UUID getManagerId() {
        return managerId;
    }

    public void setManagerId(UUID managerId) {
        this.managerId = managerId;
    }

}
