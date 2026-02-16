# 🔍 Quick Diagnostic Guide

## Please tell me which error you're seeing:

### 1. **Browser Error?**
Open http://localhost:5173 in browser and check:

**Browser Console (F12):**
- Any red errors?
- Network tab - what status codes? (404, 500, 502, CORS, etc.)
- Screenshot if possible

**Example errors to look for:**
```
❌ Failed to fetch
❌ 404 Not Found  
❌ 500 Internal Server Error
❌ 502 Bad Gateway
❌ CORS policy error
```

### 2. **Container/Service Error?**
Check container logs:

```powershell
# Frontend
docker logs frontend --tail 20

# API Gateway  
docker logs api-gateway --tail 30

# Auth Service
docker logs auth-service --tail 20

# Customer Service  
docker logs customer-service --tail 20
```

### 3. **Database Connection Error?**
```powershell
# Check MySQL
docker logs mysql-db --tail 20

# Test connection
docker exec mysql-db mysql -u rentit -prentit123 -e "USE rentit_db; SHOW TABLES;"
```

---

## What I Found So Far:

✅ **All containers running:**
- mysql-db (Up 16 minutes)
- discovery-server (Running)
- api-gateway (Running)
- auth-service (Running)
- customer-service (Running)
- admin-service (Running)
- owner-service (Running)
- frontend (Running)

✅ **Eureka registration:** Services are registered

⚠️ **Found:** Some connection exceptions in API Gateway logs (might be transient startup issues)

---

## Quick Tests:

### Test 1: Check if frontend is accessible
```powershell
curl http://localhost:5173
# Should return HTML
```

### Test 2: Check if API Gateway responds
```powershell
curl http://localhost:8080
# Should return some response
```

### Test 3: Check nginx proxy  
```powershell
docker exec frontend cat /etc/nginx/conf.d/default.conf | Select-String "proxy_pass"
# Should show: proxy_pass http://api-gateway:8080/
```

---

## Please provide:

1. **What error do you see?** (browser message, status code, etc.)
2. **Where do you see it?** (browser, console, network tab, logs)
3. **When does it happen?** (on page load, clicking button, specific action)
4. **Screenshot?** (if possible)

This will help me pinpoint the exact issue!
