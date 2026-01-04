# Status Monitoring & Analytics

BahFeel memiliki sistem monitoring lengkap untuk melacak kesehatan aplikasi dan analytics pengunjung.

## 📊 Akses Status Page

- **URL Public**: `/status`
- **API Endpoint**: `/api/status`
- **Tidak memerlukan autentikasi** - Publik untuk semua

## 🎯 Fitur Status Page

### 1. **Analytics Overview**
- Total kunjungan halaman (all-time dan 24h)
- Total API requests (all-time dan 24h)
- Rata-rata response time API
- Status kesehatan services

### 2. **Top Pages Statistics**
- Daftar halaman yang paling banyak dikunjungi
- Jumlah visitors per halaman

### 3. **Request Methods Statistics**
- Breakdown dari HTTP methods (GET, POST, dll)
- Jumlah requests per method

### 4. **Recent Requests (Last 50)**
Tabel detail dengan:
- Endpoint yang diakses
- HTTP method
- Status code response
- Response time (ms)
- IP address pengunjung
- Timestamp request

### 5. **Service Status**
- Nama service
- Status (UP/DOWN)
- Response time
- Last checked timestamp

## 📁 Data Storage

Semua data disimpan dalam JSON file di:
- **Development**: `data/monitoring.json`
- **Production**: `/tmp/bahfeel/monitoring.json`

### Struktur Data:

```json
{
  "pageVisits": [
    {
      "page": "/dashboard",
      "timestamp": "2024-01-04T10:42:40.493Z",
      "userAgent": "Mozilla/5.0...",
      "ip": "192.168.1.1"
    }
  ],
  "requests": [
    {
      "endpoint": "/api/reflect",
      "method": "POST",
      "timestamp": "2024-01-04T10:42:40.493Z",
      "statusCode": 200,
      "duration": 245.5,
      "ip": "192.168.1.1"
    }
  ],
  "services": [
    {
      "name": "OpenAI API",
      "status": "up",
      "lastChecked": "2024-01-04T10:42:40.493Z",
      "responseTime": 1250
    }
  ],
  "lastUpdated": "2024-01-04T10:42:40.493Z"
}
```

## 🔄 Auto-Refresh

Status page secara otomatis melakukan refresh setiap 30 detik untuk mendapatkan data terbaru.

## 📊 Data Retention

- **Page Visits**: Menyimpan 10,000 kunjungan terakhir
- **API Requests**: Menyimpan 10,000 request terakhir
- **Services**: Menyimpan status terbaru untuk setiap service

Data yang lama akan otomatis dihapus untuk mencegah file terlalu besar.

## 🛠️ Integrasi

### Page Tracking
Setiap halaman otomatis dilacak melalui `PageTracker` component yang tertanam di root layout.

### Request Logging
Middleware otomatis mencatat semua API requests dan response time.

### Service Monitoring
Services dapat diupdate melalui:
```typescript
import { updateServiceStatus } from '@/lib/monitoring';

updateServiceStatus('Service Name', 'up', responseTime);
```

## 📈 API Response Format

```json
{
  "status": "ok",
  "timestamp": "2024-01-04T10:42:40.493Z",
  "analytics": {
    "totalPageVisits": 1234,
    "totalRequests": 5678,
    "pageStats": { "/dashboard": 450, "/status": 200 },
    "methodStats": { "GET": 3000, "POST": 2678 },
    "endpointStats": { "/api/reflect": 1500, "/api/status": 600 },
    "avgResponseTime": 245.5,
    "visits24h": 123,
    "requests24h": 567,
    "uptime": 3,
    "totalServices": 4
  },
  "services": [...],
  "recentRequests": [...],
  "recentVisits": [...]
}
```

## 🔒 Privacy & Security

- IP addresses dicatat untuk analytics tapi tidak dikirim ke service eksternal
- User agent strings disimpan untuk debugging
- Semua data disimpan local (tidak ada cloud sync)
- Halaman status bersifat publik tetapi hanya menampilkan data aggregate

## 🚀 Contoh Penggunaan

### Fetch Status Programmatically
```javascript
const response = await fetch('/api/status');
const data = await response.json();
console.log(data.analytics);
```

### Monitor Dalam Browser
Buka: `https://yourdomain.com/status`

Halaman akan otomatis update setiap 30 detik dengan data real-time.
