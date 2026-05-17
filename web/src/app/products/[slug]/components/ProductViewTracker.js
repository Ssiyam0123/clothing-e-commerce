'use client';

import { useEffect } from 'react';
import { useTrackingStore } from '@/store/trackingStore';

export default function ProductViewTracker({ product }) {
  const trackViewContent = useTrackingStore((state) => state.trackViewContent);

  useEffect(() => {
    if (product) {
      const discountedPrice = product.price - (product.price * (product.discount || 0)) / 100;
      trackViewContent(
        product._id,
        product.name,
        discountedPrice,
        product.category?.name || 'General'
      );
    }
  }, [product, trackViewContent]);

  return null;
}
