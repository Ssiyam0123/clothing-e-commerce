import Banner from './banner.model.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { uploadImage, deleteImage } from '../../services/imageUploadService.js';

// Get all active banners (public)
export const getActiveBanners = asyncHandler(async (req, res) => {
  const banners = await Banner.find({ isActive: true }).sort('order createdAt');
  res.json(banners);
});

// Admin: get all banners
export const getAllBanners = asyncHandler(async (req, res) => {
  const banners = await Banner.find({}).sort('-createdAt');
  res.json(banners);
});

// Admin: create banner (with image upload)
export const createBanner = asyncHandler(async (req, res) => {
  let imageUrl;
  if (req.file) {
    imageUrl = await uploadImage(req.file, 'banners');
  } else {
    return res.status(400).json({ message: 'Image is required' });
  }

  const banner = await Banner.create({
    title: req.body.title,
    subtitle: req.body.subtitle,
    image: imageUrl,
    link: req.body.link,
    order: req.body.order ? parseInt(req.body.order) : 0,
    isActive: req.body.isActive === 'true' || req.body.isActive === true,
  });
  res.status(201).json(banner);
});

// Admin: update banner
export const updateBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findById(req.params.id);
  if (!banner) return res.status(404).json({ message: 'Banner not found' });

  let imageUrl = banner.image;
  if (req.file) {
    imageUrl = await uploadImage(req.file, 'banners', banner.image);
  }

  const updatedBanner = await Banner.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      subtitle: req.body.subtitle,
      image: imageUrl,
      link: req.body.link,
      order: req.body.order ? parseInt(req.body.order) : 0,
      isActive: req.body.isActive === 'true' || req.body.isActive === true,
    },
    { new: true, runValidators: true }
  );
  res.json(updatedBanner);
});

// Admin: delete banner
export const deleteBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findById(req.params.id);
  if (!banner) return res.status(404).json({ message: 'Banner not found' });

  if (banner.image) {
    await deleteImage(banner.image);
  }
  await banner.deleteOne();
  res.json({ message: 'Banner deleted' });
});
