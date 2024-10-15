package com.example.demo.model;

import java.util.UUID;

import com.example.demo.common.constants.OrganizationType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "organization")
public class Organization {
    @Id
    @Column(name = "id", nullable = false)
    private String id = UUID.randomUUID().toString();

    @Column(name = "parent_id")
    private String parentId;

    @Enumerated(EnumType.STRING)
    @Column(name = "org_type", nullable = false)
    private OrganizationType orgType;

    @Column(name = "head_of_org", nullable = false)
    private String headOfOrg;

    @Column(name = "username", nullable = false)
    private String username;

}