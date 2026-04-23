import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { addProduct } from '../lib/firestore';
import { uploadProductImages } from '../lib/storage';
import Button from '../components/ui/Button';

const UNITS = [
  { value: 'kg', label: 'Kilogram (kg)' },
  { value: 'gram', label: 'Gram (g)' },
  { value: 'piece', label: 'Piece' },
  { value: 'dozen', label: 'Dozen' },
  { value: 'liter', label: 'Liter (L)' },
  { value: 'bunch', label: 'Bunch' },
];

const SHELF_UNITS = [
  { value: 'hours', label: 'Hours' },
  { value: 'days', label: 'Days' },
  { value: 'weeks', label: 'Weeks' },
];

export default function AddProductPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    unit: 'kg',
    shelfValue: '',
    shelfUnit: 'days',
  });

  const [images, setImages] = useState([]); // File objects
  const [previews, setPreviews] = useState([]); // Data URLs
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 5) {
      setError('Maximum 5 images allowed.');
      return;
    }

    // Validate types and sizes
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    for (const file of files) {
      if (!validTypes.includes(file.type)) {
        setError(`Invalid file type: ${file.name}. Use JPG, PNG, WebP, or GIF.`);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError(`File too large: ${file.name}. Maximum 5MB per image.`);
        return;
      }
    }

    setError('');
    const newImages = [...images, ...files];
    setImages(newImages);

    // Generate previews
    const newPreviews = [];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        newPreviews.push(ev.target.result);
        if (newPreviews.length === files.length) {
          setPreviews((prev) => [...prev, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (images.length < 1) {
      setError('Please upload at least 1 product image.');
      return;
    }

    if (!form.name.trim() || !form.price) {
      setError('Name and price are required.');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Upload images to Firebase Storage
      const imageUrls = await uploadProductImages(
        user.uid,
        images,
        (progress) => setUploadProgress(progress)
      );

      // Save product document to Firestore
      await addProduct({
        sellerId: user.uid,
        name: form.name.trim(),
        description: form.description.trim(),
        price: parseFloat(form.price),
        unit: form.unit,
        shelfLife: form.shelfValue
          ? { value: parseInt(form.shelfValue), unit: form.shelfUnit }
          : null,
        imageUrls,
      });

      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to create product. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // ─── Success Screen ───
  if (success) {
    return (
      <div className="max-w-container mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-secondary-container rounded-full flex items-center justify-center mx-auto">
          <span className="material-symbols-outlined text-4xl text-on-secondary-container">check_circle</span>
        </div>
        <h1 className="font-display-xl text-3xl text-on-surface">Product Listed!</h1>
        <p className="text-on-surface-variant max-w-md mx-auto">
          Your product is now live on the marketplace. Customers can find and order it immediately.
        </p>
        <div className="flex gap-3 justify-center">
          <Button
            variant="outline"
            onClick={() => {
              setSuccess(false);
              setForm({ name: '', description: '', price: '', unit: 'kg', shelfValue: '', shelfUnit: 'days' });
              setImages([]);
              setPreviews([]);
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
            Add Another
          </Button>
          <Button variant="primary" onClick={() => navigate('/dashboard')}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>dashboard</span>
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const inputClass =
    'w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-2.5 text-on-surface text-sm placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all';

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="p-2 -ml-2 hover:bg-surface-container rounded-xl transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 22 }}>
            arrow_back
          </span>
        </button>
        <div>
          <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-0.5">
            Farmer Dashboard
          </p>
          <h1 className="font-display-xl text-2xl text-primary leading-none">
            Add New Product
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ─── Image Upload ─── */}
        <div>
          <label className="block text-xs font-semibold text-on-surface-variant mb-2 tracking-wide uppercase">
            Product Photos ({images.length}/5) *
          </label>

          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {/* Existing previews */}
            {previews.map((src, i) => (
              <div key={i} className="relative aspect-square rounded-xl overflow-hidden group">
                <img src={src} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 w-6 h-6 bg-error text-on-error rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>close</span>
                </button>
                {i === 0 && (
                  <span className="absolute bottom-1 left-1 text-[10px] bg-primary/80 text-on-primary px-2 py-0.5 rounded-full">
                    Cover
                  </span>
                )}
              </div>
            ))}

            {/* Add button */}
            {images.length < 5 && (
              <label className="aspect-square rounded-xl border-2 border-dashed border-outline-variant hover:border-primary/50 flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors bg-surface-container-low hover:bg-primary-container/10">
                <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 24 }}>
                  add_photo_alternate
                </span>
                <span className="text-[10px] text-on-surface-variant font-medium">Add Photo</span>
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </label>
            )}
          </div>
          <p className="text-xs text-on-surface-variant mt-2">
            JPG, PNG, WebP or GIF · Max 5MB each · First image is the cover
          </p>
        </div>

        {/* ─── Product Name ─── */}
        <div>
          <label className="block text-xs font-semibold text-on-surface-variant mb-1.5 tracking-wide uppercase">
            Product Name *
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="e.g. Organic Roma Tomatoes"
            className={inputClass}
            maxLength={200}
          />
        </div>

        {/* ─── Description ─── */}
        <div>
          <label className="block text-xs font-semibold text-on-surface-variant mb-1.5 tracking-wide uppercase">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Tell customers about your product — how it's grown, what makes it special…"
            className={`${inputClass} min-h-[100px] resize-none`}
            rows={3}
            maxLength={2000}
          />
          <p className="text-xs text-on-surface-variant mt-1">
            {form.description.length}/2000 characters
          </p>
        </div>

        {/* ─── Price & Unit ─── */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1.5 tracking-wide uppercase">
              Price ($) *
            </label>
            <input
              name="price"
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={handleChange}
              required
              placeholder="0.00"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1.5 tracking-wide uppercase">
              Unit
            </label>
            <select name="unit" value={form.unit} onChange={handleChange} className={inputClass}>
              {UNITS.map((u) => (
                <option key={u.value} value={u.value}>{u.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ─── Shelf Life ─── */}
        <div>
          <label className="block text-xs font-semibold text-on-surface-variant mb-1.5 tracking-wide uppercase">
            Shelf Life (optional)
          </label>
          <div className="grid grid-cols-2 gap-4">
            <input
              name="shelfValue"
              type="number"
              min="1"
              value={form.shelfValue}
              onChange={handleChange}
              placeholder="e.g. 3"
              className={inputClass}
            />
            <select name="shelfUnit" value={form.shelfUnit} onChange={handleChange} className={inputClass}>
              {SHELF_UNITS.map((u) => (
                <option key={u.value} value={u.value}>{u.label}</option>
              ))}
            </select>
          </div>
          {form.shelfValue && (
            <p className="text-xs text-primary mt-1.5 flex items-center gap-1">
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>schedule</span>
              Best within {form.shelfValue} {form.shelfUnit}
            </p>
          )}
        </div>

        {/* ─── Error ─── */}
        {error && (
          <div className="p-3 bg-error-container text-on-error-container text-sm rounded-xl flex items-center gap-2">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>error</span>
            {error}
          </div>
        )}

        {/* ─── Upload Progress ─── */}
        {uploading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-on-surface-variant">
              <span>Uploading images…</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
              <div
                className="bg-primary h-full rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* ─── Submit ─── */}
        <Button type="submit" variant="primary" size="lg" className="w-full" disabled={uploading}>
          {uploading ? (
            <>
              <div className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
              Creating Listing…
            </>
          ) : (
            <>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>publish</span>
              List Product on Marketplace
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
