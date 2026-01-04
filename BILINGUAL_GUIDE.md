# Panduan Fitur Bilingual (English & Indonesian)

## 📱 Cara Menggunakan Language Selector

### Untuk Pengguna
1. Klik tombol **"🇮🇩 ID"** (jika mode English) atau **"🇬🇧 EN"** (jika mode Indonesia) di pojok kanan atas
2. Bahasa akan berubah ke seluruh aplikasi secara langsung
3. Preferensi bahasa akan tetap selama session

### Untuk Developer
Setiap halaman sudah dilengkapi dengan LanguageSwitcher component yang bisa digunakan dengan 2 baris kode:

```tsx
import { LanguageSwitcher } from '../components/LanguageSwitcher';

export default function MyPage() {
  return (
    <div>
      <LanguageSwitcher />
      {/* Rest of your page */}
    </div>
  );
}
```

## 🌐 Menambah Translations Baru

1. Edit file `src/context/LanguageContext.tsx`
2. Tambah key baru ke object `translations`:

```tsx
const translations: Translations = {
  myNewKey: { 
    en: 'English text here', 
    id: 'Teks Indonesia di sini' 
  },
  // ... existing keys
};
```

3. Gunakan di component dengan `useLanguage` hook:

```tsx
import { useLanguage } from '../context/LanguageContext';

export default function MyComponent() {
  const { t } = useLanguage();
  
  return <h1>{t('myNewKey')}</h1>;
}
```

## 📝 Bahasa yang Didukung

- 🇬🇧 **English** (en)
- 🇮🇩 **Indonesian** (id)

## 🔑 Keys yang Sudah Tersedia

### General
- `appName` - Nama aplikasi
- `tagline` - Tagline utama
- `problem` - Deskripsi masalah
- `startExpressing` - Tombol mulai
- `privacy` - Privacy statement

### Dashboard
- `dashboardTitle` - Judul dashboard
- `writeThoughts` - Label tulis pikiran
- `writeDesc` - Deskripsi tulis
- `uploadImage` - Label upload gambar
- `uploadDesc` - Deskripsi upload
- `viewTimeline` - Lihat timeline
- `expressMore` - Ungkapkan lagi

### Text Expression
- `writeThoughtsPlaceholder` - Placeholder textarea

### Image Expression
- `takePicture` - Ambil gambar
- `takePictureDesc` - Deskripsi ambil gambar
- `uploadImageDesc` - Deskripsi upload
- `dragDropImage` - Drag & drop text
- `clickSelect` - Click to select text
- `dropImageHere` - Drop here text
- `preview` - Label preview

### Reflection
- `yourReflection` - Judul refleksi
- `whatYouFeeling` - Label perasaan
- `whatProtecting` - Label proteksi
- `gentleStep` - Label langkah lembut
- `saveReflection` - Tombol simpan
- `reflectionSaved` - Pesan tersimpan
- `reflectingExpression` - Loading message

### Timeline
- `yourEmotionalTimeline` - Judul timeline
- `noReflectionsSaved` - Pesan kosong
- `startFirstReflection` - Link mulai
- `written` - Label written
- `image` - Label image
- `whatWasFeeling` - Apa yang rasakan
- `whatProtected` - Apa yang dilindungi
- `gentleStepTook` - Langkah yang diambil

### Error Messages
- `invalidImageFile` - File tidak valid
- `fileSizeTooLarge` - Ukuran file terlalu besar
- `failedProcessImage` - Gagal proses gambar
- `cameraPermissionDenied` - Izin kamera ditolak
- `noCameraFound` - Kamera tidak ditemukan
- `failedAccessCamera` - Gagal akses kamera
- `failedCapturePhoto` - Gagal ambil foto

### Buttons
- `back` - Kembali
- `reflect` - Renungkan
- `cancel` - Batal
- `capturePhoto` - Ambil foto

## 🎯 Halaman yang Sudah Mendukung Bilingual

✅ Home Page (`/`)
✅ Dashboard (`/dashboard`)
✅ Express Text (`/express/text`)
✅ Express Image (`/express/image`)
✅ Reflection (`/reflection`)
✅ Timeline (`/timeline`)

Semua error messages dan UI elements sudah fully localized!

## 📦 File Struktur

```
src/
├── context/
│   └── LanguageContext.tsx      # Language provider & translations
├── components/
│   └── LanguageSwitcher.tsx     # Language toggle button
└── app/
    ├── page.tsx                 # Home (bilingual)
    ├── layout.tsx              # Layout dengan LanguageProvider
    ├── dashboard/page.tsx      # Dashboard (bilingual)
    ├── express/
    │   ├── text/page.tsx      # Text express (bilingual)
    │   └── image/page.tsx     # Image express (bilingual)
    ├── reflection/
    │   ├── page.tsx           # Reflection page (bilingual)
    │   └── content.tsx        # Reflection content (bilingual)
    └── timeline/page.tsx      # Timeline (bilingual)
```

