'use client';

import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useAdminProducts } from '@/hooks/useAdminProducts';
import { useCategories } from '@/hooks/useCategories';
import { useSubcategories } from '@/hooks/useSubcategories';
import { useSizes } from '@/hooks/useSizes';
import Loader from '@/components/common/Loader';
import { getImageUrl } from '@/utils/imageUtils';
import { swalToast, swalError } from '@/utils/swal';
import Link from 'next/link';

export default function ProductForm() {
  const { id } = useParams();
  const router = useRouter();
  const isEdit = id !== 'new';

  const { products, createProduct, updateProduct } = useAdminProducts();
  const { categories } = useCategories();
  const { subcategories } = useSubcategories();
  const { sizes } = useSizes();

  const [loading, setLoading] = useState(isEdit);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredSizes, setFilteredSizes] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);      // File objects (new uploads)
  const [existingImages, setExistingImages] = useState([]);    // URLs of already uploaded images
  const [imagePreviews, setImagePreviews] = useState([]);      // All previews (existing + new)

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();
  const watchedCategory = watch('category');

  // Filter sizes based on selected category
  useEffect(() => {
    if (watchedCategory && sizes) {
      const filtered = sizes.filter(size => size.category?._id === watchedCategory || size.category === watchedCategory);
      setFilteredSizes(filtered);
      setSelectedCategory(watchedCategory);
    } else {
      setFilteredSizes([]);
    }
  }, [watchedCategory, sizes]);

  // Load existing product data for edit mode
  useEffect(() => {
    if (isEdit && products && products.length > 0) {
      const product = products.find((p) => p._id === id);
      if (product) {
        setValue('name', product.name);
        setValue('slug', product.slug);
        setValue('description', product.description || '');
        setValue('price', product.price);
        setValue('discount', product.discount || 0);
        setValue('category', product.category._id);
        setValue('subcategory', product.subcategory?._id || '');
        setValue('tags', product.tags?.join(', ') || '');
        setValue('isActive', product.isActive);
        
        // Store existing images as URLs
        setExistingImages(product.images || []);
        setImagePreviews(product.images?.map(img => getImageUrl(img)) || []);
        setSelectedFiles([]); // no new files yet

        const sizesObj = {};
        product.sizes?.forEach((item) => {
          const sizeId = item.size._id || item.size;
          sizesObj[sizeId] = item.stock;
        });
        setValue('sizes', sizesObj);
        setSelectedCategory(product.category._id);
        setLoading(false);
      } else if (products) setLoading(false);
    } else {
      setLoading(false);
    }
  }, [isEdit, id, products, setValue]);

  // Handle new image selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const totalImages = existingImages.length + selectedFiles.length + files.length;
    if (totalImages > 5) {
      return swalError('Limit Exceeded', 'Maximum 5 images allowed per product.');
    }
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setSelectedFiles(prev => [...prev, ...files]);
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  // Remove an image (either existing or newly added)
  const removeLocalImage = (index) => {
    const isExisting = index < existingImages.length;
    if (isExisting) {
      // Remove from existingImages array
      const newExisting = [...existingImages];
      newExisting.splice(index, 1);
      setExistingImages(newExisting);
    } else {
      // Remove from new files
      const newFiles = [...selectedFiles];
      const fileIndex = index - existingImages.length;
      newFiles.splice(fileIndex, 1);
      setSelectedFiles(newFiles);
    }
    // Remove preview
    const newPreviews = [...imagePreviews];
    if (newPreviews[index].startsWith('blob:')) URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    
    // Basic fields
    formData.append('name', data.name.trim());
    formData.append('slug', data.slug.trim());
    if (data.description) formData.append('description', data.description);
    formData.append('price', Number(data.price));
    if (data.discount) formData.append('discount', Number(data.discount));
    formData.append('category', data.category);
    if (data.subcategory) formData.append('subcategory', data.subcategory);
    
    // Tags
    if (data.tags) {
      const tagsArray = data.tags.split(',').map(t => t.trim()).filter(t => t !== '');
      formData.append('tags', JSON.stringify(tagsArray));
    }
    
    // Active status
    formData.append('isActive', data.isActive === 'on' || data.isActive === true);
    
    // Sizes
    if (data.sizes && typeof data.sizes === 'object') {
      const sizesArray = [];
      for (const [sizeId, stock] of Object.entries(data.sizes)) {
        if (stock !== undefined && stock !== '' && filteredSizes.some(s => s._id === sizeId)) {
          sizesArray.push({ size: sizeId, stock: parseInt(stock) || 0 });
        }
      }
      if (sizesArray.length > 0) {
        formData.append('sizes', JSON.stringify(sizesArray));
      }
    }
    
    // Images: send existing image URLs as a JSON string under 'images' field
    // and new files under 'images' field (multer will handle both)
    // BUT: The backend expects 'images' to be either an array of URLs (when editing)
    // or files. The easiest is to send existing URLs as JSON string and new files as separate fields.
    // However, the backend controller `updateProduct` parses 'images' from req.body.images.
    // For create, it only uses uploaded files. So we need to be careful.
    // Let's follow the backend logic: for create, only send files; for edit, send existing URLs as JSON.
    
    if (isEdit) {
      // Send existing image URLs as a JSON string
      if (existingImages.length > 0) {
        formData.append('images', JSON.stringify(existingImages));
      }
    }
    
    // Append new image files (always for both create and edit)
    selectedFiles.forEach((file) => {
      formData.append('images', file);
    });
    
    try {
      if (isEdit) {
        await updateProduct({ id, data: formData });
        swalToast('Product updated successfully', 'success');
      } else {
        await createProduct(formData);
        swalToast('Product created successfully', 'success');
      }
      setTimeout(() => router.push('/admin/products'), 1500);
    } catch (err) {
      // Log full error for debugging
      console.error('Product submission error:', err);
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.message || err.message || 'Error processing request.';
      swalError('Sync Failed', msg);
    }
  };

  if (loading) return <div className="p-20"><Loader /></div>;

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white dark:bg-[#0a0a0a] p-8 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase mb-2">
            {isEdit ? 'Configuration' : 'Initialize Product'}
          </h1>
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">Vault Inventory Protocol</p>
        </div>
        <Link href="/admin/products" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">← Cancel & Return</Link>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Core Identity */}
        <div className="bg-white dark:bg-[#0a0a0a] rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 p-8 md:p-12 shadow-sm">
          <h2 className="text-xs font-black text-zinc-400 uppercase tracking-[0.3em] mb-8">Core Identity</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-3">Product Title *</label>
              <input type="text" {...register('name', { required: true })} className="w-full bg-zinc-50 dark:bg-[#111] border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 outline-none font-bold text-zinc-900 dark:text-zinc-100 focus:border-zinc-900 dark:focus:border-white transition-all" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-3">URL Slug *</label>
              <input type="text" {...register('slug', { required: true, pattern: /^[a-z0-9-]+$/ })} className="w-full bg-zinc-50 dark:bg-[#111] border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 outline-none font-bold text-zinc-900 dark:text-zinc-100 focus:border-zinc-900 dark:focus:border-white transition-all" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-3">Description</label>
              <textarea rows="4" {...register('description')} className="w-full bg-zinc-50 dark:bg-[#111] border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 outline-none font-medium text-zinc-900 dark:text-zinc-100 focus:border-zinc-900 dark:focus:border-white transition-all resize-none" />
            </div>
          </div>
        </div>

        {/* Pricing & Classification */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-[#0a0a0a] rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 p-8 md:p-12 shadow-sm">
            <h2 className="text-xs font-black text-zinc-400 uppercase tracking-[0.3em] mb-8">Financials</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-3">Base Price (৳) *</label>
                <input type="number" step="0.01" {...register('price', { required: true, valueAsNumber: true })} className="w-full bg-zinc-50 dark:bg-[#111] border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 outline-none font-black text-2xl text-zinc-900 dark:text-zinc-100 focus:border-zinc-900 dark:focus:border-white transition-all" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-3">Discount (%)</label>
                <input type="number" {...register('discount', { valueAsNumber: true })} className="w-full bg-zinc-50 dark:bg-[#111] border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 outline-none font-black text-2xl text-rose-500 focus:border-rose-500 transition-all" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#0a0a0a] rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 p-8 md:p-12 shadow-sm">
            <h2 className="text-xs font-black text-zinc-400 uppercase tracking-[0.3em] mb-8">Classification</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-3">Department *</label>
                <select {...register('category', { required: true })} className="w-full bg-zinc-50 dark:bg-[#111] border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 outline-none font-bold text-zinc-900 dark:text-zinc-100 focus:border-zinc-900 dark:focus:border-white transition-all cursor-pointer">
                  <option value="">Select Category</option>
                  {categories?.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-3">Sub-Department</label>
                <select {...register('subcategory')} className="w-full bg-zinc-50 dark:bg-[#111] border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 outline-none font-bold text-zinc-900 dark:text-zinc-100 focus:border-zinc-900 dark:focus:border-white transition-all cursor-pointer">
                  <option value="">Select Subcategory</option>
                  {subcategories?.filter(s => s.category?._id === selectedCategory).map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Media & Inventory */}
        <div className="bg-white dark:bg-[#0a0a0a] rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 p-8 md:p-12 shadow-sm">
          <h2 className="text-xs font-black text-zinc-400 uppercase tracking-[0.3em] mb-8">Vault & Media</h2>
          
          {/* Image Upload */}
          <div className="mb-12">
            <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-6">Product Media ({imagePreviews.length}/5)</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {imagePreviews.map((img, idx) => (
                <div key={idx} className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 group shadow-sm bg-zinc-50 dark:bg-[#111]">
                  <img src={img} alt="Preview" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                  <button type="button" onClick={() => removeLocalImage(idx)} className="absolute top-2 right-2 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:scale-110">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>
                </div>
              ))}
              {imagePreviews.length < 5 && (
                <label className="relative aspect-[3/4] rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-800 flex flex-col items-center justify-center cursor-pointer hover:border-zinc-900 dark:hover:border-white hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-all group">
                  <span className="text-2xl mb-2 grayscale opacity-40 group-hover:opacity-100 transition-opacity">📸</span>
                  <span className="text-[8px] font-black uppercase text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white tracking-widest text-center px-2">Add Photo</span>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" multiple />
                </label>
              )}
            </div>
          </div>

          {/* Stock Allocation */}
          <div className="mb-8">
            <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-6">Stock Allocation</label>
            {!selectedCategory ? (
              <div className="bg-zinc-50 dark:bg-[#111] p-6 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 text-center text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Select category to map sizes</div>
            ) : filteredSizes.length === 0 ? (
              <div className="bg-amber-50 dark:bg-amber-900/10 p-6 rounded-2xl border border-amber-200 dark:border-amber-900/30 text-center text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">No size templates found for this department</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {filteredSizes.map(size => (
                  <div key={size._id} className="bg-zinc-50 dark:bg-[#111] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 transition-all hover:border-zinc-400 dark:hover:border-zinc-600 flex flex-col gap-2">
                    <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">{size.name}</span>
                    <input type="number" min="0" defaultValue={0} {...register(`sizes.${size._id}`, { valueAsNumber: true })} className="w-full bg-white dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 outline-none font-black text-zinc-900 dark:text-zinc-100 text-center focus:border-zinc-900 dark:focus:border-white" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Actions */}
          <div className="pt-10 border-t border-zinc-100 dark:border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-6">
            <label className="flex items-center gap-4 cursor-pointer group">
              <input type="checkbox" {...register('isActive')} className="w-6 h-6 rounded-lg bg-zinc-100 border-zinc-300 text-zinc-900 focus:ring-0 dark:bg-zinc-800 dark:border-zinc-700 dark:checked:bg-white cursor-pointer transition-all" />
              <div>
                <p className="text-xs font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-widest">Active Status</p>
                <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">Make product visible in storefront.</p>
              </div>
            </label>
            <button type="submit" className="w-full md:w-auto bg-zinc-900 dark:bg-white text-white dark:text-black px-12 py-5 rounded-full font-black uppercase tracking-[0.2em] text-[10px] hover:scale-105 active:scale-95 transition-all shadow-2xl">
              {isEdit ? 'Sync Protocol Data' : 'Launch Product Protocol'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}