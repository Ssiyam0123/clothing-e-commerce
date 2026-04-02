'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useReviews } from '@/hooks/useReviews';
import { useRouter } from 'next/navigation';
import StarRating from './StarRating';
import Loader from '../common/Loader';
import { getImageUrl } from '@/utils/imageUtils';
import { swalConfirm, swalToast, swalError } from '@/utils/swal';
import { useAppStore } from '@/store/appStore';
import { motion, AnimatePresence } from 'framer-motion';

const DICTIONARY = {
  en: {
    title: 'Community Feedback',
    reviews: 'Reviews',
    writeBtn: 'Leave a Review',
    loginToReview: 'Sign in to share your experience',
    yourReview: 'Your Review',
    edited: 'Edited',
    editBtn: 'Edit',
    deleteBtn: 'Delete',
    editTitle: 'Update Your Experience',
    writeTitle: 'Share Your Experience',
    ratingLabel: 'Your Rating',
    reviewLabel: 'Your Review',
    placeholder: 'Describe your aesthetic and comfort experience...',
    addPhotos: 'Add Visuals (Max 5)',
    photoLimit: 'JPG, PNG, WebP up to 5MB.',
    submitBtn: 'Publish Feedback',
    updateBtn: 'Update Feedback',
    cancelBtn: 'Cancel',
    saving: 'Processing...',
    noReviews: 'No feedback yet. Be the vanguard.',
    success: 'Feedback published successfully!',
    error: 'Action failed. Please try again.',
    confirmDelete: 'Remove this feedback permanently?'
  },
  bn: {
    title: 'কমিউনিটি ফিডব্যাক',
    reviews: 'টি রিভিউ',
    writeBtn: 'রিভিউ লিখুন',
    loginToReview: 'রিভিউ লিখতে লগইন করুন',
    yourReview: 'আপনার রিভিউ',
    edited: 'এডিটেড',
    editBtn: 'এডিট',
    deleteBtn: 'ডিলিট',
    editTitle: 'আপনার অভিজ্ঞতা আপডেট করুন',
    writeTitle: 'আপনার অভিজ্ঞতা শেয়ার করুন',
    ratingLabel: 'আপনার রেটিং',
    reviewLabel: 'মতামত',
    placeholder: 'এই প্রোডাক্টটি সম্পর্কে আপনার অভিজ্ঞতা লিখুন...',
    addPhotos: 'ছবি যোগ করুন (সর্বোচ্চ ৫টি)',
    photoLimit: 'সর্বোচ্চ ৫ মেগাবাইট। JPG, PNG, WebP.',
    submitBtn: 'পাবলিশ করুন',
    updateBtn: 'আপডেট করুন',
    cancelBtn: 'বাতিল করুন',
    saving: 'প্রসেসিং হচ্ছে...',
    noReviews: 'কোনো ফিডব্যাক নেই। আপনিই প্রথম রিভিউ দিন!',
    success: 'ফিডব্যাক সফলভাবে পাবলিশ হয়েছে!',
    error: 'দুঃখিত, আবার চেষ্টা করুন।',
    confirmDelete: 'এই রিভিউটি কি মুছে ফেলতে চান?'
  }
};

export default function ReviewSection({ productId, onReviewChange }) {
  const router = useRouter();
  const { user } = useAuth();
  const { 
    reviews, 
    userReview,
    averageRating,
    totalReviews,
    loading, 
    createReview, 
    updateReview, 
    deleteReview 
  } = useReviews(productId);
  
  const { lang } = useAppStore();
  const ui = useMemo(() => DICTIONARY[lang] || DICTIONARY['en'], [lang]);
  const isBn = lang === 'bn';

  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imagesToRemove, setImagesToRemove] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (userReview && isEditing) {
      setRating(userReview.rating || 5);
      setComment(userReview.comment || '');
      if (userReview.images) setImagePreviews(userReview.images.map(img => getImageUrl(img.url)));
    }
  }, [userReview, isEditing]);

  const handleEdit = () => { setIsEditing(true); setShowForm(true); };
  const handleCancel = () => {
    setShowForm(false); setIsEditing(false); setRating(5); setComment('');
    setImages([]); setImagePreviews([]); setImagesToRemove([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 5) {
      return swalError('Limit Exceeded', 'Maximum 5 images allowed per review.');
    }
    setImages(prev => [...prev, ...files]);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
    e.target.value = '';
  };

  const removeImage = (index, isExisting = false, existingUrl = null) => {
    if (isExisting && existingUrl) {
      setImagesToRemove(prev => [...prev, existingUrl]);
    } else {
      setImages(prev => prev.filter((_, i) => i !== index));
    }
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return swalError('Missing Comment', 'Please write a brief description of your experience.');
    
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('productId', productId);
    formData.append('rating', Number(rating));
    formData.append('comment', comment.trim());
    images.forEach(image => formData.append('images', image));
    if (imagesToRemove.length > 0) formData.append('removeImages', JSON.stringify(imagesToRemove));
    
    try {
      if (userReview && isEditing) {
        await updateReview({ reviewId: userReview._id, data: formData });
        swalToast('Feedback Updated', 'success');
      } else {
        await createReview(formData);
        swalToast('Feedback Published', 'success');
      }
      handleCancel();
      if (onReviewChange) onReviewChange();
    } catch (error) {
      swalError('Publication Failed', error.response?.data?.message || ui.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = await swalConfirm(ui.confirmDelete, 'This action is irreversible.');
    if (confirmed) {
      try {
        await deleteReview(userReview._id);
        swalToast('Feedback Removed', 'success');
        if (onReviewChange) onReviewChange();
      } catch (error) {
        swalError('Delete Error', 'Could not remove the feedback.');
      }
    }
  };

  if (loading) return <div className="py-10"><Loader /></div>;

  return (
    <div className="space-y-16 relative">
      
      {/* Header & Summary */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-zinc-100 dark:border-white/5 pb-10">
        <div>
          <h3 className={`text-3xl md:text-5xl font-black tracking-tighter uppercase text-zinc-900 dark:text-white mb-4 leading-none ${isBn ? 'font-sans' : ''}`}>
            {ui.title}
          </h3>
          <div className="flex items-center gap-4">
            <StarRating rating={averageRating || 0} size="medium" />
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">
              {totalReviews || 0} {ui.reviews}
            </span>
          </div>
        </div>
        {!userReview && !showForm && (
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => user ? setShowForm(true) : router.push('/login')}
            className="bg-zinc-900 dark:bg-white text-white dark:text-black px-10 py-4 rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl"
          >
            {user ? ui.writeBtn : ui.loginToReview}
          </motion.button>
        )}
      </div>

      {/* User's Review Display */}
      {userReview && !showForm && (
        <div className="p-10 rounded-[2.5rem] bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 shadow-inner relative overflow-hidden group animate-in fade-in zoom-in-95 duration-500">
          <div className="absolute top-0 left-0 w-1 h-full bg-zinc-900 dark:bg-white"></div>
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <StarRating rating={userReview.rating} size="small" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-900 dark:text-zinc-100">{ui.yourReview}</span>
                {userReview.isEdited && <span className="text-[8px] font-bold text-zinc-400 bg-zinc-200 dark:bg-zinc-800 px-2 py-1 rounded-md uppercase tracking-widest">{ui.edited}</span>}
              </div>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium mb-6">"{userReview.comment}"</p>
              {userReview.images?.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-6">
                  {userReview.images.map((img, idx) => (
                    <img key={idx} src={getImageUrl(img.url)} className="h-20 w-20 object-cover rounded-2xl border border-zinc-200 dark:border-zinc-800 grayscale hover:grayscale-0 transition-all cursor-pointer hover:scale-105" onClick={() => window.open(getImageUrl(img.url), '_blank')} alt="Review" />
                  ))}
                </div>
              )}
              <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">{new Date(userReview.createdAt).toDateString()}</p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <button onClick={handleEdit} className="flex-1 md:flex-none bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-zinc-100 transition-colors">{ui.editBtn}</button>
              <button onClick={handleDelete} className="flex-1 md:flex-none bg-rose-50 dark:bg-rose-950/30 text-rose-600 border border-rose-100 dark:border-rose-900 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-colors">{ui.deleteBtn}</button>
            </div>
          </div>
        </div>
      )}

      {/* Review Form */}
      <AnimatePresence mode="wait">
        {showForm && (
          <motion.form 
            key="reviewForm"
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20, transition: { duration: 0.3 } }}
            onSubmit={handleSubmit} 
            className="p-10 rounded-[3rem] bg-white dark:bg-[#050505] border border-zinc-200 dark:border-white/5 shadow-2xl overflow-hidden"
          >
            <h3 className="text-2xl font-black uppercase tracking-tighter text-zinc-900 dark:text-white mb-10 border-b border-zinc-100 dark:border-white/5 pb-6">
              {userReview && isEditing ? ui.editTitle : ui.writeTitle}
            </h3>
            <div className="space-y-8">
              <div>
                <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-4">{ui.ratingLabel}</label>
                <div className="bg-zinc-50 dark:bg-[#080808] border border-zinc-200 dark:border-white/5 inline-block px-4 py-2 rounded-2xl shadow-inner">
                  <StarRating rating={rating} onChange={setRating} editable size="large" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-4">{ui.reviewLabel}</label>
                <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows="5" className="w-full bg-zinc-50 dark:bg-[#080808] border-2 border-transparent focus:border-zinc-900 dark:focus:border-white rounded-[2rem] p-6 outline-none text-zinc-900 dark:text-zinc-100 font-medium transition-all shadow-inner resize-none" placeholder={ui.placeholder} required />
              </div>
              <div>
                <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-4">{ui.addPhotos}</label>
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="relative w-24 h-24 rounded-[1.5rem] border-2 border-dashed border-zinc-300 dark:border-zinc-700 flex flex-col items-center justify-center hover:border-zinc-900 dark:hover:border-white transition-colors cursor-pointer bg-zinc-50 dark:bg-[#080808] overflow-hidden">
                    <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                    <span className="text-2xl text-zinc-400 mb-1">+</span>
                    <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Upload</span>
                  </div>
                  {imagePreviews.map((preview, idx) => {
                    const isExistingImage = userReview?.images?.some(img => getImageUrl(img.url) === preview);
                    const existingUrl = userReview?.images?.find(img => getImageUrl(img.url) === preview)?.url;
                    return (
                      <div key={idx} className="relative w-24 h-24 rounded-[1.5rem] border border-zinc-200 dark:border-zinc-800 group overflow-hidden shadow-sm">
                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeImage(idx, isExistingImage, existingUrl)} className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all font-black text-xl">✕</button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-12 pt-8 border-t border-zinc-100 dark:border-white/5">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={isSubmitting} className="flex-1 bg-black dark:bg-white text-white dark:text-black py-5 rounded-full font-black uppercase tracking-[0.2em] text-[10px] shadow-xl disabled:opacity-50">
                {isSubmitting ? ui.saving : (userReview && isEditing ? ui.updateBtn : ui.submitBtn)}
              </motion.button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="button" onClick={handleCancel} className="flex-1 bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white py-5 rounded-full font-black uppercase tracking-[0.2em] text-[10px]">
                {ui.cancelBtn}
              </motion.button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Others' Reviews */}
      {!userReview && reviews.length === 0 && !showForm ? (
        <div className="text-center py-20 bg-zinc-50 dark:bg-zinc-900/30 rounded-[3rem] border border-dashed border-zinc-200 dark:border-zinc-800">
          <span className="text-5xl mb-6 block grayscale opacity-30">💭</span>
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">{ui.noReviews}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reviews.filter(r => !userReview || r._id !== userReview._id).map((review, index) => (
            <motion.div 
              key={review._id} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-8 rounded-[2.5rem] bg-white dark:bg-[#080808] border border-zinc-100 dark:border-white/5 hover:border-zinc-300 dark:hover:border-white/20 transition-colors duration-500 shadow-sm"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-zinc-200 dark:bg-zinc-800">
                  <img src={review.user?.avatar ? getImageUrl(review.user.avatar) : 'https://cdn-icons-png.flaticon.com/512/149/149071.png'} className="w-full h-full object-cover grayscale" alt="user" />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-zinc-900 dark:text-zinc-100">{review.user?.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <StarRating rating={review.rating} size="small" />
                    <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">• {new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-6 font-medium">"{review.comment}"</p>
              {review.images?.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {review.images.map((img, i) => (
                    <img key={i} src={getImageUrl(img.url)} className="w-16 h-16 object-cover rounded-2xl border border-zinc-200 dark:border-zinc-800 grayscale hover:grayscale-0 transition-all cursor-zoom-in hover:scale-110" onClick={() => window.open(getImageUrl(img.url), '_blank')} alt="Review" />
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}