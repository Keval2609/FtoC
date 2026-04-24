import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { addProduct, getProductById, updateProduct, deleteProduct } from '../lib/firestore';
import { uploadProductImages } from '../lib/cloudinary';
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
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    unit: 'kg',
    shelfValue: '',
    shelfUnit: 'days',
    stock: '',
  });

  // Array of objects { isExisting: boolean, file: File|null, url: string }
  const [images, setImages] = useState([]);
  
  const [loadingInitial, setLoadingInitial] = useState(isEditMode);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      if (!isEditMode) return;
      try {
        const product = await getProductById(id);
        if (!product || product.sellerId !== user.uid) {
          setError('Product not found or access denied.');
          setLoadingInitial(false);
          return;
        }

        setForm({
          name: product.name || '',
          description: product.description || '',
          price: product.price ? product.price.toString() : '',
          unit: product.unit || 'kg',
          shelfValue: product.shelfLife?.value ? product.shelfLife.value.toString() : '',
          shelfUnit: product.shelfLife?.unit || 'days',
          stock: product.stock !== undefined ? product.stock.toString() : '',
        });

        if (product.imageUrls && Array.isArray(product.imageUrls)) {
          setImages(
            product.imageUrls.map(url => ({
              isExisting: true,
              file: null,
              url,
            }))
          );
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load product details.');
      } finally {
        setLoadingInitial(false);
      }
    }
    loadProduct();
  }, [id, isEditMode, user.uid]);

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
    const validTypes = ['image/jpeg', 'image/png'];
    for (const file of files) {
      if (!validTypes.includes(file.type)) {
        setError(`Invalid file type: ${file.name}. Use JPG or PNG only.`);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError(`File too large: ${file.name}. Maximum 5MB per image.`);
        return;
      }
    }

    setError('');
    
    // Create new image objects with local preview URLs
    const newImageObjects = files.map(file => ({
      isExisting: false,
      file,
      url: URL.createObjectURL(file),
    }));

    setImages(prev => [...prev, ...newImageObjects]);
  };

  const removeImage = (index) => {
    setImages((prev) => {
      const newImages = [...prev];
      const removed = newImages.splice(index, 1)[0];
      // Clean up local object URL if it was a newly added file
      if (!removed.isExisting && removed.url) {
        URL.revokeObjectURL(removed.url);
      }
      return newImages;
    });
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
      const existingUrls = images.filter(img => img.isExisting).map(img => img.url);
      const newFiles = images.filter(img => !img.isExisting).map(img => img.file);
      let newUrls = [];

      if (newFiles.length > 0) {
        newUrls = await uploadProductImages(
          user.uid,
          newFiles,
          (progress) => setUploadProgress(progress)
        );
      }

      const finalUrls = [...existingUrls, ...newUrls];

      const productData = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: parseFloat(form.price),
        unit: form.unit,
        shelfLife: form.shelfValue
          ? { value: parseInt(form.shelfValue), unit: form.shelfUnit }
          : null,
        stock: form.stock === '' ? 0 : parseFloat(form.stock),
        imageUrls: finalUrls,
      };

      if (isEditMode) {
        await updateProduct(id, productData);
      } else {
        await addProduct({
          ...productData,
          sellerId: user.uid,
        });
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to save product. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (confirm('Are you sure you want to completely delete this product? This action cannot be undone.')) {
      try {
        setUploading(true);
        await deleteProduct(id);
        navigate('/dashboard');
      } catch (err) {
        setError('Failed to delete product.');
        setUploading(false);
      }
    }
  };

  if (loadingInitial) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ─── Success Screen ───
  if (success) {
    return (
      <div className="max-w-container mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-secondary-container rounded-full flex items-center justify-center mx-auto">
          <span className="material-symbols-outlined text-4xl text-on-secondary-container">check_circle</span>
        </div>
        <h1 className="font-display-xl text-3xl text-on-surface">
          {isEditMode ? 'Product Updated!' : 'Product Listed!'}
        </h1>
        <p className="text-on-surface-variant max-w-md mx-auto">
          Your product is now live on the marketplace. Customers can find and order it immediately.
        </p>
        <div className="flex gap-3 justify-center">
          {!isEditMode && (
            <Button
              variant="outline"
              onClick={() => {
                setSuccess(false);
                setForm({ name: '', description: '', price: '', unit: 'kg', shelfValue: '', shelfUnit: 'days', stock: '' });
                setImages([]);
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
              Add Another
            </Button>
          )}
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
            {isEditMode ? 'Edit Product' : 'Add New Product'}
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
            {images.map((img, i) => (
              <div key={i} className="relative aspect-square rounded-xl overflow-hidden group">
                <img src={img.url} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 w-6 h-6 bg-error text-on-error rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-sm"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>delete</span>
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
                  accept="image/jpeg,image/png"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </label>
            )}
          </div>
          <p className="text-xs text-on-surface-variant mt-2">
            JPG or PNG · Max 5MB each · First image is the cover
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

        {/* ─── Stock ─── */}
        <div>
          <label className="block text-xs font-semibold text-on-surface-variant mb-1.5 tracking-wide uppercase">
            Available Stock
          </label>
          <input
            name="stock"
            type="number"
            min="0"
            step="any"
            value={form.stock}
            onChange={handleChange}
            placeholder={`e.g. 50 (in ${form.unit})`}
            className={inputClass}
          />
          <p className="text-xs text-on-surface-variant mt-1">
            Leave blank or 0 if currently out of stock.
          </p>
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
        {uploading && uploadProgress > 0 && uploadProgress < 100 && (
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

        {/* ─── Submit & Actions ─── */}
        <div className="pt-4 flex flex-col gap-3">
          <Button type="submit" variant="primary" size="lg" className="w-full" disabled={uploading}>
            {uploading ? (
              <>
                <div className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
                {isEditMode ? 'Saving Changes…' : 'Creating Listing…'}
              </>
            ) : (
              <>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                  {isEditMode ? 'save' : 'publish'}
                </span>
                {isEditMode ? 'Save Changes' : 'List Product on Marketplace'}
              </>
            )}
          </Button>

          {isEditMode && (
            <button
              type="button"
              onClick={handleDeleteProduct}
              disabled={uploading}
              className="w-full py-3 px-4 flex items-center justify-center gap-2 text-error font-semibold hover:bg-error-container/30 rounded-xl transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>delete_forever</span>
              Delete Product Completely
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
