# Deployment Checklist

## ✅ Pre-Deployment

### Code Quality
- [x] All TypeScript compiles without errors
- [x] No console errors in development
- [x] All features working as expected
- [x] Documentation complete

### Testing
- [ ] Build succeeds: `npm run build`
- [ ] Dev server runs: `npm run dev`
- [ ] Status page loads: `/status`
- [ ] Page visits tracked correctly
- [ ] API requests logged correctly
- [ ] Data stored in monitoring.json
- [ ] Auto-refresh works (30s interval)

### Data Management
- [ ] monitoring.json created successfully
- [ ] Data structure valid JSON
- [ ] File size reasonable (~1-5MB)
- [ ] Auto-cleanup working (10k limit)
- [ ] No sensitive data in logs

### Performance
- [ ] Dashboard loads < 2 seconds
- [ ] API response < 500ms
- [ ] No memory leaks
- [ ] File I/O not blocking requests

## 🚀 Deployment Steps

### 1. Build for Production
```bash
npm run build
```
Expected: ✅ Build succeeds without errors

### 2. Verify Build
```bash
# Check .next folder exists
ls -la .next/

# Check production build
npm start  # or your production command
```
Expected: ✅ Server starts without errors

### 3. Environment Setup
```bash
# Ensure NODE_ENV is set (usually automatic in production)
echo $NODE_ENV  # Should be 'production'

# Verify /tmp is writable
touch /tmp/test-write && rm /tmp/test-write
```
Expected: ✅ /tmp is writable

### 4. Data Directory Permissions
```bash
# Development
mkdir -p data
chmod 755 data

# Production (usually handled by system)
# /tmp/bahfeel will be auto-created with proper permissions
```

### 5. Test Production Build
```bash
# Run production build locally
NODE_ENV=production npm start

# Test status page
curl http://localhost:3000/status

# Test page tracking
curl -X POST http://localhost:3000/api/track-page \
  -H "Content-Type: application/json" \
  -d '{"page": "/test"}'

# Check data file
cat data/monitoring.json
```
Expected: ✅ All endpoints working

### 6. Deploy to Production
```bash
# Using Docker
docker build -t echofeel .
docker run -v app-data:/tmp/bahfeel echofeel

# Using Vercel
vercel deploy

# Using traditional hosting
npm run build && npm start

# Using cloud platforms (AWS, GCP, Azure)
# Follow platform-specific deployment guides
```

### 7. Post-Deployment Verification
```bash
# Check status page
curl https://yourdomain.com/status

# Verify data is being recorded
# Wait a few minutes, then check

curl https://yourdomain.com/status | jq '.analytics'

# Expected output:
# {
#   "totalPageVisits": <number>,
#   "totalRequests": <number>,
#   ...
# }
```
Expected: ✅ Data being recorded correctly

## 📊 Monitoring in Production

### Daily Checks
- [ ] Status page accessible
- [ ] Data being collected
- [ ] No disk space issues
- [ ] File size reasonable

### Weekly Checks
- [ ] Review top pages
- [ ] Check API response times
- [ ] Verify service health
- [ ] Check data retention

### Monthly Checks
- [ ] Archive old data if needed
- [ ] Review analytics trends
- [ ] Optimize if needed
- [ ] Update documentation

## 🔒 Security Checklist

- [x] No sensitive data in logs
- [x] No external API calls for tracking
- [x] IP addresses not sent to 3rd party
- [x] Status page safe for public access
- [x] No authentication bypass
- [x] File permissions correct

## 🐛 Troubleshooting

### Issue: monitoring.json not created
**Solution:**
```bash
# Check permissions
ls -la data/
# Create manually if needed
mkdir -p data
touch data/monitoring.json
```

### Issue: Data not showing
**Solution:**
- Visit multiple pages
- Trigger API calls
- Wait for data to be written
- Check file exists: `ls -la data/monitoring.json`

### Issue: /status page blank
**Solution:**
```bash
# Check API endpoint
curl http://localhost:3000/api/status

# Check browser console for errors
# Check server logs for errors
# Verify node_modules installed
npm install
```

### Issue: High memory usage
**Solution:**
```bash
# Check file size
du -h data/monitoring.json

# Cleanup old data (if needed)
# Edit monitoring.ts to adjust limits
```

## 📈 Performance Baselines

Expected values in production:

- **Page load**: < 2 seconds
- **API response**: 200-500ms (depends on OpenAI)
- **Dashboard refresh**: 30 seconds
- **Data file size**: 1-5 MB
- **Memory overhead**: < 50 MB

If values exceed these, review:
- Network connectivity
- OpenAI API performance
- Disk I/O performance
- System resources

## 🚨 Critical Alerts

Monitor for:
- [ ] monitoring.json exceeds 10 MB (disk space issue)
- [ ] API response time > 5000ms (service issue)
- [ ] /api/status returns error (system issue)
- [ ] File write failures (permission issue)

## ✅ Final Checklist

- [ ] Code reviewed and tested
- [ ] Documentation complete
- [ ] Build succeeds
- [ ] Tests pass
- [ ] Data properly stored
- [ ] Security verified
- [ ] Performance acceptable
- [ ] Monitoring working
- [ ] Team trained
- [ ] Backup plan ready

## 📞 Support & Rollback

### If issues occur:
1. Check logs: `docker logs <container>` or `tail -f logs/*.log`
2. Verify data: `cat data/monitoring.json | jq .`
3. Check permissions: `ls -la data/`
4. Restart service: `npm start` or container restart

### Rollback plan:
```bash
# Backup current data
cp data/monitoring.json backup-$(date +%Y%m%d).json

# If needed, reset data
rm data/monitoring.json
# New file will be created on next request
```

---

**Ready to Deploy! 🚀**

Follow these steps carefully for smooth deployment.
Contact support if any issues arise.
