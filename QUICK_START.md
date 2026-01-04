# Quick Start Guide - Status Monitoring

## 🚀 Mulai dalam 3 Langkah

### 1. Build Project
```bash
cd /home/alboyonnn/Developments/iseng/echofeel
npm run build
```

### 2. Jalankan Development Server
```bash
npm run dev
```
Server akan berjalan di `http://localhost:3000`

### 3. Akses Status Dashboard
Buka di browser: **http://localhost:3000/status**

---

## 📊 Melihat Data

### Via UI Dashboard
1. Kunjungi halaman manapun (misal: /dashboard)
2. Buka /status
3. Lihat statistik pengunjung & request di dashboard
4. Tab-tab: Overview | Requests | Services

### Via JSON API
```bash
curl http://localhost:3000/api/status | jq .
```

### Via File Langsung
```bash
cat data/monitoring.json | jq .
```

---

## 🧪 Testing

### Test Page Visit
1. Kunjungi: http://localhost:3000/dashboard
2. Tunggu 2 detik
3. Buka: http://localhost:3000/status
4. Lihat `/dashboard` muncul di "Top Pages"

### Test API Request
1. Buka: http://localhost:3000/express/text
2. Ketik sesuatu (misal: "Aku sedih")
3. Klik "Lihat Penjelasannya"
4. Tunggu response selesai
5. Buka: http://localhost:3000/status
6. Lihat `/api/reflect` di tabel requests

### Test Auto-Refresh
1. Di dashboard /status
2. Lihat stat cards
3. Tunggu 30 detik
4. Dashboard otomatis refresh dengan data terbaru

---

## 📁 File Locations

### Dev Environment
```
echofeel/
├── src/
│   ├── lib/monitoring.ts              ← Core logic
│   ├── middleware.ts                  ← Request logging
│   ├── components/PageTracker.tsx      ← Page tracking
│   ├── app/
│   │   ├── status/page.tsx             ← Dashboard UI
│   │   └── api/
│   │       ├── status/route.ts         ← GET endpoint
│   │       └── track-page/route.ts     ← POST endpoint
│   └── layout.tsx                      ← PageTracker added
│
└── data/
    └── monitoring.json                 ← Data file (auto-created)
```

### Data Storage
- **Development**: `data/monitoring.json`
- **Production**: `/tmp/bahfeel/monitoring.json`
- **Auto-created** on first request
- **Auto-formatted** as JSON

---

## 🎨 Dashboard Overview

```
┌─────────────────────────────────────────────┐
│  BahFeel Status                    [Refresh] │
│  Service monitoring & analytics             │
└─────────────────────────────────────────────┘

┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│ Visits   │  │ Requests │  │ Response │  │ Services │
│ 1,234    │  │ 5,678    │  │ 245ms    │  │ 3/4      │
│ 123 24h  │  │ 567 24h  │  │ (avg)    │  │ healthy  │
└──────────┘  └──────────┘  └──────────┘  └──────────┘

┌─────────────────────────────────────────────┐
│ [Overview] [Requests] [Services]            │
├─────────────────────────────────────────────┤
│ Tab Content Here                            │
│ • Top Pages / Methods / Tables              │
│ • Auto-updating every 30 seconds            │
└─────────────────────────────────────────────┘
```

---

## 📈 Apa yang Dilacak?

### Page Visits
```json
{
  "page": "/dashboard",
  "timestamp": "2024-01-04T10:42:40.493Z",
  "userAgent": "Mozilla/5.0...",
  "ip": "192.168.1.1"
}
```

### API Requests
```json
{
  "endpoint": "/api/reflect",
  "method": "POST",
  "statusCode": 200,
  "duration": 245.5,
  "timestamp": "2024-01-04T10:42:40.493Z",
  "ip": "192.168.1.1"
}
```

### Services
```json
{
  "name": "OpenAI API",
  "status": "up",
  "responseTime": 1250,
  "lastChecked": "2024-01-04T10:42:40.493Z"
}
```

---

## ⚙️ Configuration

### Data Limits
- **Page Visits**: 10,000 items (auto-cleanup)
- **Requests**: 10,000 items (auto-cleanup)
- **Services**: Unlimited

### Refresh Interval
- Default: 30 seconds
- Customizable di `/src/app/status/page.tsx`
- Line: `const interval = setInterval(fetchStatus, 30000);`

### Storage Path
- Dev: `data/monitoring.json`
- Prod: `/tmp/bahfeel/monitoring.json`
- Auto-selected based on `NODE_ENV`

---

## 🔧 Troubleshooting

### Status Page Blank
- [ ] Check browser console for errors
- [ ] Verify server running: `npm run dev`
- [ ] Check data/monitoring.json exists

### No Data Showing
- [ ] Make sure you visited some pages
- [ ] Trigger an API call (reflect, upload)
- [ ] Refresh page or wait 30 seconds

### monitoring.json Not Created
- [ ] Check write permissions on `data/` directory
- [ ] Try creating manually: `mkdir -p data`
- [ ] Check disk space availability

### TypeScript Errors
- [ ] Run: `npm run build`
- [ ] Check error messages
- [ ] Ensure all node_modules installed: `npm install`

---

## 📚 Dokumentasi Lengkap

- **STATUS_MONITORING.md** - Dokumentasi sistem lengkap
- **MONITORING_EXAMPLES.md** - Code examples & integration
- **In-code comments** - Fungsi-fungsi dijelaskan detail

---

## 🎯 Next Steps

### Basic Setup ✓
- [x] Build project
- [x] Run dev server
- [x] Open status dashboard

### Testing
- [ ] Visit multiple pages
- [ ] Trigger API calls
- [ ] Check data in monitoring.json
- [ ] Verify auto-refresh works

### Customization
- [ ] Adjust refresh interval
- [ ] Add more services to monitor
- [ ] Customize dashboard styling
- [ ] Export/analyze data

### Production
- [ ] Test with production build
- [ ] Setup Docker/deployment
- [ ] Configure persistent storage
- [ ] Monitor in production

---

## 💡 Pro Tips

1. **Real-time Monitoring**
   - Open /status in separate window
   - Watch live updates as users interact

2. **Export Data**
   - Backup: `cp data/monitoring.json backup.json`
   - Export: `jq '.' data/monitoring.json > report.json`

3. **Performance Optimization**
   - Reduce refresh interval for faster updates
   - Archive old data periodically
   - Monitor file size growth

4. **Service Monitoring**
   - Setup health checks every minute
   - Track third-party API availability
   - Alert on service down

---

## 📞 Support

Untuk bantuan lebih lanjut, lihat dokumentasi lengkap:
- STATUS_MONITORING.md - System overview
- MONITORING_EXAMPLES.md - Code examples

---

**Happy Monitoring! 🚀**
