package com.p20.rentit.security;

import jakarta.servlet.http.HttpServletRequest;

public class RoleGuard {

    public static void checkRole(HttpServletRequest request, String... allowedRoles) {

        Object roleObj = request.getAttribute("role");

        if (roleObj == null) {
            throw new RuntimeException("Unauthorized");
        }

        String userRole = roleObj.toString();

        for (String role : allowedRoles) {
            if (role.equalsIgnoreCase(userRole)) {
                return;
            }
        }

        throw new RuntimeException("Access Denied for role: " + userRole);
    }
}
