import { useState, useRef, useEffect } from 'react';

export default function LazyImage({ src, alt, className = '', ...props }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && imgRef.current) {
          imgRef.current.src = src;
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    if (imgRef.current) observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, [src]);

  if (error) {
    return (
      <div className={`bg-surface-container flex items-center justify-center ${className}`} {...props}>
        <span className="material-symbols-outlined text-outline text-3xl">image_not_supported</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`} {...props}>
      {!loaded && (
        <div className="absolute inset-0 bg-surface-container animate-pulse" />
      )}
      <img
        ref={imgRef}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`w-full h-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
}
