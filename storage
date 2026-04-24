import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

const useMock = import.meta.env.VITE_USE_MOCK_DATA === 'true';

// Mock image URLs for development
const MOCK_IMAGES = [
  'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400',
  'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400',
  'https://images.unsplash.com/photo-1518977676601-b28d4b7b4460?w=400',
  'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400',
  'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=400',
];

/**
 * Upload a single file to Firebase Storage.
 * Path: products/{userId}/{timestamp}_{fileName}
 * Returns the public download URL.
 */
export async function uploadProductImage(userId, file, onProgress) {
  if (useMock) {
    // Simulate upload delay
    await new Promise((r) => setTimeout(r, 400));
    const idx = Math.floor(Math.random() * MOCK_IMAGES.length);
    return MOCK_IMAGES[idx];
  }

  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const storagePath = `products/${userId}/${timestamp}_${safeName}`;
  const storageRef = ref(storage, storagePath);

  return new Promise((resolve, reject) => {
    const task = uploadBytesResumable(storageRef, file, {
      contentType: file.type,
    });

    task.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        onProgress?.(progress);
      },
      (error) => reject(error),
      async () => {
        try {
          const url = await getDownloadURL(task.snapshot.ref);
          resolve(url);
        } catch (err) {
          reject(err);
        }
      }
    );
  });
}

/**
 * Upload multiple product images (1-5).
 * Returns an array of download URLs.
 */
export async function uploadProductImages(userId, files, onTotalProgress) {
  if (files.length < 1 || files.length > 5) {
    throw new Error('Please upload between 1 and 5 photos.');
  }

  // Validate file types
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  for (const file of files) {
    if (!validTypes.includes(file.type)) {
      throw new Error(`Invalid file type: ${file.name}. Use JPG, PNG, WebP, or GIF.`);
    }
    if (file.size > 5 * 1024 * 1024) {
      throw new Error(`File too large: ${file.name}. Maximum 5MB per image.`);
    }
  }

  const progresses = new Array(files.length).fill(0);
  const urls = [];

  for (let i = 0; i < files.length; i++) {
    const url = await uploadProductImage(userId, files[i], (p) => {
      progresses[i] = p;
      const total = Math.round(
        progresses.reduce((a, b) => a + b, 0) / files.length
      );
      onTotalProgress?.(total);
    });
    urls.push(url);
  }

  return urls;
}
