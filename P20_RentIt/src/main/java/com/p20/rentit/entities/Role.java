package com.p20.rentit.entities;

import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "role")
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "role_id")
    private int roleId;

    @Column(name = "role_name")
    private String roleName;

    @JsonIgnoreProperties("role")
    @OneToMany(mappedBy = "role", cascade = CascadeType.ALL)
    private Set<User> users;

    // ---------- Constructors ----------

    public Role() {
        super();
    }

    public Role(int roleId, String roleName) {
        super();
        this.roleId = roleId;
        this.roleName = roleName;
    }

    // ---------- Getters & Setters ----------

    public int getRoleId() {
        return roleId;
    }

    public void setRoleId(int roleId) {
        this.roleId = roleId;
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

    public Set<User> getUsers() {
        return users;
    }

    public void setUsers(Set<User> users) {
        for (User u : users) {
            u.setRole(this);
        }
        this.users = users;
    }
}
