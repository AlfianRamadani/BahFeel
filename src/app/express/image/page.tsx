'use client';

import { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Upload, Camera } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { LanguageSwitcher } from '../../../components/LanguageSwitcher';

export default function ExpressImage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [imageDescription, setImageDescription] = useState<string>('');
  const [mode, setMode] = useState<'upload' | 'camera' | null>(null);
  const [error, setError] = useState<string>('');
  const [showCamera, setShowCamera] = useState(false);
  const router = useRouter();
  const { t, language } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const MAX_FILE_SIZE = 100 * 1024 * 1024;

  const compressImage = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let { width, height } = img;

          if (width > 1920 || height > 1920) {
            const ratio = Math.min(1920 / width, 1920 / height);
            width *= ratio;
            height *= ratio;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        };
      };
    });
  };

  const handleFile = async (selectedFile: File) => {
    setError('');

    if (!selectedFile.type.startsWith('image/')) {
      setError(t('invalidImageFile'));
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError(t('fileSizeTooLarge'));
      return;
    }

    try {
      const compressedData = await compressImage(selectedFile);
      setFile(selectedFile);
      setPreview(compressedData);
    } catch (err) {
      setError(t('failedProcessImage'));
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      handleFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp']
    },
    multiple: false,
  });

  const startCamera = async () => {
    setError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setShowCamera(true);
      }
    } catch (err: any) {
      if (err.name === 'NotAllowedError') {
        setError(t('cameraPermissionDenied'));
      } else if (err.name === 'NotFoundError') {
        setError(t('noCameraFound'));
      } else {
        setError(t('failedAccessCamera'));
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    try {
      const context = canvasRef.current.getContext('2d');
      if (!context) return;

      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);

      canvasRef.current.toBlob((blob) => {
        if (blob) {
          const newFile = new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
          handleFile(newFile);
          stopCamera();
          setShowCamera(false);
        }
      }, 'image/jpeg', 0.8);
    } catch (err) {
      setError(t('failedCapturePhoto'));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (file && preview) {
      const fullContent = imageDescription 
        ? `[IMAGE]\n${preview}\n[DESCRIPTION]\n${imageDescription}`
        : preview;
      
      try {
        const response = await fetch('/api/reflect', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ type: 'image', content: fullContent }),
        });

        if (!response.ok) {
          throw new Error('Failed to get reflection');
        }

        const data = await response.json();
        const reflectionData = {
          feeling: data.feeling,
          protection: data.protection,
          action: data.action,
        };
        
        router.push(`/reflection?type=image&content=${encodeURIComponent(JSON.stringify(reflectionData))}`);
      } catch (error) {
        console.error('Error getting reflection:', error);
        alert('Ada error saat generate reflection. Coba lagi ya.');
      }
    }
  };

  if (mode === 'camera' && showCamera) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4">
        <LanguageSwitcher />
        <motion.main
          key={language}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto w-full"
        >
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl font-bold text-stone-800 mb-8 text-center"
          >
            {t('takePicture')}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="relative bg-black rounded-lg overflow-hidden w-full" style={{ aspectRatio: '4/3' }}>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <div className="flex justify-center gap-4">
              <button
                type="button"
                onClick={() => {
                  stopCamera();
                  setMode(null);
                }}
                className="px-6 py-2 border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-50 transition-colors"
              >
                {t('cancel')}
              </button>
              <button
                type="button"
                onClick={takePhoto}
                className="px-6 py-2 bg-stone-700 text-white rounded-lg hover:bg-stone-800 transition-colors"
              >
                {t('capturePhoto')}
              </button>
            </div>
          </motion.div>

          <canvas ref={canvasRef} className="hidden" />
        </motion.main>
      </div>
    );
  }

  if (mode === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4">
        <LanguageSwitcher />
        <motion.main
          key={language}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto w-full text-center"
        >
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl font-bold text-stone-800 mb-8"
          >
            {t('uploadImage')}
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-4"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setMode('camera');
                setTimeout(() => startCamera(), 100);
              }}
              className="w-full bg-white border border-stone-200 rounded-lg p-8 hover:border-stone-300 hover:shadow-lg transition-all duration-300 text-stone-800"
            >
              <Camera className="mx-auto h-12 w-12 text-stone-600 mb-4" />
              <h2 className="text-xl font-semibold">{t('takePicture')}</h2>
              <p className="text-stone-600 mt-2">{t('takePictureDesc')}</p>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setMode('upload')}
              className="w-full bg-white border border-stone-200 rounded-lg p-8 hover:border-stone-300 hover:shadow-lg transition-all duration-300 text-stone-800"
            >
              <Upload className="mx-auto h-12 w-12 text-stone-600 mb-4" />
              <h2 className="text-xl font-semibold">{t('uploadImage')}</h2>
              <p className="text-stone-600 mt-2">{t('uploadImageDesc')}</p>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => router.back()}
              className="w-full px-6 py-2 border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-50 transition-colors"
            >
              {t('back')}
            </motion.button>
          </motion.div>
        </motion.main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4">
      <LanguageSwitcher />
      <motion.main
        key={language}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl mx-auto w-full"
      >
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-3xl font-bold text-stone-800 mb-8 text-center"
        >
          {t('uploadImage')}
        </motion.h1>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-6"
        >
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all ${isDragActive
              ? 'border-stone-400 bg-stone-50'
              : 'border-stone-300 hover:border-stone-400'
              }`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-stone-400 mb-4" />
            {isDragActive ? (
              <p className="text-stone-600 font-medium">{t('dropImageHere')}</p>
            ) : (
              <>
                <p className="text-stone-600 font-medium">{t('dragDropImage')}</p>
                <p className="text-stone-500 text-sm mt-1">{t('clickSelect')}</p>
              </>
            )}
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
            >
              {error}
            </motion.div>
          )}

          {preview && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-4"
            >
              <img
                src={preview}
                alt="Preview"
                className="max-w-full max-h-96 mx-auto rounded-lg border border-stone-200 shadow-sm"
              />
              <p className="text-sm text-stone-500">{t('preview')}</p>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-4"
              >
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  {t('imageDescription')}
                </label>
                <textarea
                  value={imageDescription}
                  onChange={(e) => setImageDescription(e.target.value)}
                  placeholder={t('imageDescriptionPlaceholder')}
                  className="w-full h-24 p-3 border border-stone-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-stone-300 bg-white text-stone-800 text-sm"
                />
                <p className="text-xs text-stone-500 mt-1">
                  {t('imageDescription')}
                </p>
              </motion.div>
            </motion.div>
          )}

          <div className="flex justify-center gap-4">
            <button
              type="button"
              onClick={() => {
                setFile(null);
                setPreview(null);
                setImageDescription('');
                setError('');
                setMode(null);
              }}
              className="px-6 py-2 border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-50 transition-colors"
            >
              {t('back')}
            </button>
            <button
              type="submit"
              disabled={!file || !preview}
              className="px-6 py-2 bg-stone-700 text-white rounded-lg hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {t('reflect')}
            </button>
          </div>
        </motion.form>
      </motion.main>
    </div>
  );
}
