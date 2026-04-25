export const uploadToCloudinary = async (file, folder = 'general') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'f2c_unsigned_preset');
  if (folder) {
    formData.append('folder', folder);
  }

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/dckxhi9de/image/upload`,
    { method: 'POST', body: formData }
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || 'Upload failed');
  }
  return data.secure_url;
};

export const uploadProductImages = async (userId, files, onProgress) => {
  const urls = [];
  const total = files.length;

  for (let i = 0; i < total; i++) {
    const file = files[i];
    const url = await uploadToCloudinary(file, `products/${userId}`);
    urls.push(url);
    if (onProgress) {
      onProgress(Math.round(((i + 1) / total) * 100));
    }
  }

  return urls;
};
