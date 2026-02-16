# 🐛 Comprehensive Diagnostic Report & Solutions

This document summarizes all technical issues encountered during the Docker deployment of the Rent-It application and their specific solutions.

## 1. Frontend Networking Issue
- **Problem:** React app could not reach backend APIs (`http://localhost:8080`) when running inside Docker container.
- **Root Cause:** `localhost` inside a container refers to the container itself, not the host or other services.
- **Solution:** 
    - Implemented Nginx Reverse Proxy (`nginx.conf`) in the frontend container.
    - Configured frontend to use relative paths (`/api/...`).
    - Nginx routes `/api` requests to `api-gateway` service.

## 2. Backend 500 Internal Server Error (Auth Service)
- **Problem:** Endpoints like `/api/auth/location/cities` returned generic 500 Errors.
- **Root Cause:** Circular reference / Serialization failure in `City` entity.
    - Missing `getAreas()` getter.
    - Incorrect `@JsonIgnoreProperties` usage.
- **Solution:** 
    - Added `getAreas()` method.
    - Changed annotation to `@JsonIgnore`.

## 3. Docker Build Reliability
- **Problem:** Code fixes (like the City entity fix) were not reflecting in running containers.
- **Root Cause:** Dockerfiles were just copying pre-built JARs/DLLs.
- **Solution:** 
    - Converted all Service Dockerfiles to **Multi-Stage Builds**.
    - Now Docker performs the `maven package` or `dotnet publish` ensuring latest code is always used.

## 4. Admin & Owner Service Unreachable (Port Mismatch)
- **Problem:** Services were running but unreachable (Connection Refused).
- **Root Cause:** 
    - `docker-compose` expected ports 9091/9092.
    - .NET 8 containers default to port 8080.
- **Solution:** 
    - Updated `appsettings.json` / Dockerfiles to set `ASPNETCORE_HTTP_PORTS=9091` (Admin) and `9092` (Owner).

## 5. Mobile / Local Network Access (CORS)
- **Problem:** App worked on localhost but failed on Mobile/LAN IP.
- **Root Cause:** 
    - API Gateway `RouterConfig.java` restricted origins.
    - Invalid Configuration: Used `AllowedOrigins("*")` with `AllowCredentials(true)` which is forbidden.
- **Solution:** 
    - Updated to use `AllowedOriginPatterns("*")`.

## 6. Database Connection Failure (.NET Services)
- **Problem:** Admin and Owner services crashed or logged `SocketException` / `SSL Connection Error` when connecting to MySQL.
- **Root Causes:**
    1.  **SSL Handshake:** MySQL 8 requires SSL by default; .NET client failed handshake.
    2.  **DNS Resolution:** Docker internal DNS (`mysql-db`) sometimes failed or returned IPv6, causing socket timeouts.
    3.  **Public Key Retrieval:** MySQL 8 default authentication plugin (`caching_sha2_password`) requires public key retrieval.
- **Solution:** 
    - **SSL:** Added `SslMode=None` to connection strings.
    - **Keys:** Added `AllowPublicKeyRetrieval=True`.
    - **DNS:** Temporarily bypassed DNS by Hardcoding Container IP (`172.18.0.3`) in `appsettings.json`. NOTE: This IP can change if containers are recreated.

## Summary of Active Fixes
| Service | Issue | Status |
| :--- | :--- | :--- |
| Frontend | Networking | ✅ Fixed (Nginx) |
| Auth Service | 500 Error | ✅ Fixed (Entity Code) |
| API Gateway | Mobile Access | ✅ Fixed (CORS Patterns) |
| Admin Service | DB Connection | ✅ Fixed (IP + SSL Config) |
| Owner Service | DB Connection | ✅ Fixed (IP + SSL Config) |
