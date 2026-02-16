# Testing Guide - Docker Frontend Fix

## What Was Fixed

### Files Created:
1. ✅ `.env.development` - Uses `http://localhost:8080` for local dev
2. ✅ `.env.production` - Uses `/api` for Docker deployment
3. ✅ `nginx.conf` - Nginx proxy configuration

### Files Modified:
1. ✅ `src/api/axios.js` - Now uses `import.meta.env.VITE_API_BASE_URL`
2. ✅ `Dockerfile` - Copies nginx.conf into container

---

## How to Test

### Option 1: Rebuild Frontend Only (Faster)
```bash
# Stop and remove frontend container
docker-compose stop frontend
docker-compose rm -f frontend

# Rebuild frontend with no cache
docker-compose build --no-cache frontend

# Start frontend
docker-compose up -d frontend

# Check logs
docker logs -f frontend
```

### Option 2: Full Rebuild (Recommended if issues persist)
```bash
# Stop all containers
docker-compose down

# Remove all containers and rebuild
docker-compose build --no-cache

# Start all services
docker-compose up -d

# Check all logs
docker-compose logs -f
```

---

## Verification Steps

### 1. Check Frontend Container Logs
```bash
docker logs frontend
```
You should see nginx starting successfully.

### 2. Check API Gateway Container
```bash
docker logs api-gateway
```
Ensure it's registered with Eureka.

### 3. Test from Browser
1. Open `http://localhost:5173`
2. Open browser DevTools (F12) → Network tab
3. Try to login or browse vehicles
4. Check the API requests - they should go to `/api/...` instead of `http://localhost:8080/...`

### 4. Verify API Proxying
In browser console:
```javascript
fetch('/api/auth/login', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({email: 'test@test.com', password: 'test'})
})
.then(r => r.json())
.then(console.log)
```

---

## Expected Results

✅ **Before Fix:**
- Browser tries to fetch: `http://localhost:8080/auth/login`
- Error: "Failed to fetch" or "Network error"

✅ **After Fix:**
- Browser fetches: `/api/auth/login` (relative URL)
- Nginx proxies to: `http://api-gateway:8080/auth/login`
- You get a proper API response (even if 401/403, that's OK - it means API is reachable!)

---

## Troubleshooting

### Issue: Still getting "Failed to fetch"
**Solution:** Make sure you rebuilt the frontend image:
```bash
docker-compose build --no-cache frontend
docker-compose up -d frontend
```

### Issue: 502 Bad Gateway
**Cause:** API Gateway container is not running or not registered with Eureka
**Solution:**
```bash
# Check if api-gateway is running
docker ps | grep api-gateway

# Check eureka registration
curl http://localhost:8761/

# Restart api-gateway
docker-compose restart api-gateway
```

### Issue: CORS errors
**Cause:** API Gateway needs CORS configuration
**Solution:** The nginx.conf already includes CORS headers, but API Gateway should handle CORS. Check your API Gateway CORS configuration.

---

## Local Development (Laptop)

Your local development still works! Just run:
```bash
cd rent-it-frontend
npm run dev
```

It will use `.env.development` which points to `http://localhost:8080` ✅

---

## Summary

**What changed:**
- Frontend now uses environment variables for API URL
- Docker uses nginx proxy (`/api` → `api-gateway:8080`)
- Local dev still uses direct connection (`localhost:8080`)

**Why this works:**
- Containers communicate using Docker service names
- Nginx runs inside frontend container and proxies API requests
- Browser makes relative URL requests that nginx intercepts
