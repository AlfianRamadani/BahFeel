'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'id';

interface Translations {
  [key: string]: {
    en: string;
    id: string;
  };
}

const translations: Translations = {
  appName: { en: 'BahFeel', id: 'BahFeel' },
  tagline: { en: 'When emotions are hard to say, let them be seen.', id: 'Lagi susah ungkapin perasaan?, ungkapin aja disini hehe.' },
  problem: {
    en: 'Millions struggle to articulate their emotions, leading to silent stress and delayed support. BahFeel helps you express what you feel through words or images, offering gentle reflections to guide you toward clarity and understanding.',
    id: 'Banyak orang yang susah ngungkapin apa yang dirasain, jadinya stres dalam diam dan nggak dapet bantuan. BahFeel di sini buat membantu kamu mengekspresikan perasaan lewat tulisan atau gambar, terus kasih pantulang yang adem biar kamu paham lebih baik tentang diri sendiri. Cihuyyy'
  },
  startExpressing: { en: 'Start Expressing', id: 'Mulai Ungkapin Perasaan' },
  privacy: { en: 'No account required. Your privacy is protected.', id: 'Enggak perlu akun kok. Privasimu tetep aman wkwk.' },
  dashboardTitle: { en: 'How would you like to express yourself today?', id: 'Gimana nih, mau ungkapin perasaan hari ini?' },
  writeThoughts: { en: 'Write Your Thoughts', id: 'Tulis Apa yang Kamu Rasain' },
  writeDesc: { en: 'Share what\'s on your mind through words.', id: 'Tulis aja perasaan, pikiran, atau apa pun yang lagi muter di otak kamu.' },
  uploadImage: { en: 'Upload an Image', id: 'Bagiin Gambar Kamu' },
  uploadDesc: { en: 'Express emotions through photos, drawings, or symbols.', id: 'Ceritain perasaan lewat foto, lukisan, atau simbol apapun yang kamu mau.' },
  viewTimeline: { en: 'View Your Emotional Timeline', id: 'Liat Riwayat Perasaanmu_^' },
  expressMore: { en: 'Express More', id: 'Ungkapin Lagi' },
  back: { en: 'Back', id: 'Kembali' },
  reflect: { en: 'Reflect', id: 'Liat Pantulannya' },
  cancel: { en: 'Cancel', id: 'Batalin' },
  capturePhoto: { en: 'Capture Photo', id: 'Ambil Fotonya' },
  takePicture: { en: 'Take a Picture', id: 'Ambil Foto Sekarang' },
  takePictureDesc: { en: 'Use your camera to capture an image', id: 'Pake kamera buat ambil foto' },
  uploadImageDesc: { en: 'Choose an image from your device', id: 'Pilih foto dari HP atau laptop kamu' },
  dragDropImage: { en: 'Drag & drop an image here', id: 'Seret atau drop foto ke sini' },
  clickSelect: { en: 'or click to select (Max 2MB)', id: 'atau klik buat pilih foto (Maks 2MB)' },
  dropImageHere: { en: 'Drop the image here...', id: 'Yaudah drop fotonya di sini...' },
  preview: { en: 'Preview (optimized)', id: 'Pratinjau (udah dicet dah)' },
  writeThoughtsPlaceholder: { en: 'What\'s on your mind? Share your feelings, thoughts, or experiences...', id: 'Apa yang lagi kamu pikir dan rasain? Cerita aja perasaan atau pengalaman kamu...' },
  yourReflection: { en: 'Your Reflection', id: 'Pantulan Perasaan Kamu' },
  whatYouFeeling: { en: 'What you might be feeling', id: 'Kayaknya kamu lagi ngerasa...' },
  whatProtecting: { en: 'What this emotion may be protecting', id: 'Perasaan ini mungkin melindungi kamu dari...' },
  gentleStep: { en: 'A gentle step you could take today', id: 'Langkah kecil yang bisa kamu coba hari ini' },
  saveReflection: { en: 'Save Reflection', id: 'Simpen Perasaan Ini' },
  reflectionSaved: { en: 'Reflection saved!', id: 'Udah tersimpen nih! ✨' },
  yourEmotionalTimeline: { en: 'Your Emotional Timeline', id: 'Riwayat Perasaan Kamu' },
  noReflectionsSaved: { en: 'No reflections saved yet.', id: 'Belum ada perasaan yang disimpen nih.' },
  startFirstReflection: { en: 'Start your first reflection', id: 'Yuk, mulai ungkapin perasaan kamu yang pertama' },
  written: { en: 'Written', id: 'Tulisan' },
  image: { en: 'Image', id: 'Gambar' },
  whatWasFeeling: { en: 'What I was feeling', id: 'Aku lagi ngerasa...' },
  whatProtected: { en: 'What it was protecting', id: 'Yang dilindungi perasaan itu adalah...' },
  gentleStepTook: { en: 'The gentle step I took', id: 'Langkah kecil yang aku coba buat...' },
  reflectingExpression: { en: 'Reflecting on your expression...', id: 'Lagi renungin perasaan kamu nih...' },
  cameraPermissionDenied: { en: 'Camera permission denied. Please allow camera access.', id: 'Kamera enggak bisa diakses nih. Coba izinin kamera di pengaturan.' },
  noCameraFound: { en: 'No camera found on this device.', id: 'HP atau laptop kamu kayaknya enggak ada kamera.' },
  failedAccessCamera: { en: 'Failed to access camera.', id: 'Ada error pas akses kamera. Coba lagi ya.' },
  failedCapturePhoto: { en: 'Failed to capture photo', id: 'Fotonya gagal diambil. Coba lagi deh.' },
  invalidImageFile: { en: 'Please select a valid image file', id: 'Pilih file foto yang bener ya, bukan apapun.' },
  fileSizeTooLarge: { en: 'File size must be less than 2MB', id: 'Fotonya terlalu besar deh. Pilih yang lebih kecil dari 2MB.' },
  failedProcessImage: { en: 'Failed to process image', id: 'Foto gagal diproses. Coba yang lain ya.' },
  imageDescription: { en: 'Describe this image (optional)', id: 'Jelasin tentang gambar ini (opsional)' },
  imageDescriptionPlaceholder: { en: 'What\'s going on in this image? How does it make you feel?', id: 'Apa sih yang ada di gambar ini? Gimana perasaan kamu melihatnya?' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('id');

  const t = (key: string) => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}