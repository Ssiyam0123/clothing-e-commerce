import BannerCampaign from './bannerCampaign.model.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { uploadImage, deleteImage, uploadMultipleImages } from '../../services/imageUploadService.js';

const parseSlidesData = (slidesString) => {
  try {
    return slidesString ? JSON.parse(slidesString) : [];
  } catch (e) {
    console.error("Error parsing slides JSON:", e);
    return [];
  }
};

export const getActiveCampaign = asyncHandler(async (req, res) => {
  const campaign = await BannerCampaign.findOne({ isActive: true }).sort('-createdAt');
  res.json(campaign);
});

export const getPublicCampaignById = asyncHandler(async (req, res) => {
  const campaign = await BannerCampaign.findById(req.params.id);
  if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
  res.json(campaign);
});

export const getAllCampaigns = asyncHandler(async (req, res) => {
  const { page = 1, limit = 30 } = req.query;
  const total = await BannerCampaign.countDocuments({});
  const campaigns = await BannerCampaign.find({})
    .sort('-createdAt')
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json({
    campaigns,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit)
  });
});

export const createCampaign = asyncHandler(async (req, res) => {
  const { name, description, slides: slidesString, isActive } = req.body;
  
  let finalSlides = parseSlidesData(slidesString);

  if (req.files && req.files.length) {
    const uploadedImageUrls = await uploadMultipleImages(req.files, 'banners');
    
    // Map uploaded files to slides based on a temporary fileId
    let fileIndex = 0;
    finalSlides = finalSlides.map(slide => {
      if (slide.fileId) { // fileId is a temporary key from the frontend
        return { ...slide, image: uploadedImageUrls[fileIndex++], fileId: undefined };
      }
      return slide;
    });
  }

  const campaign = await BannerCampaign.create({
    name,
    description,
    slides: finalSlides,
    isActive: isActive === 'true' || isActive === true,
  });
  res.status(201).json(campaign);
});

export const updateCampaign = asyncHandler(async (req, res) => {
  const campaign = await BannerCampaign.findById(req.params.id);
  if (!campaign) return res.status(404).json({ message: 'Campaign not found' });

  const { name, description, slides: slidesString, isActive } = req.body;
  let updatedSlides = parseSlidesData(slidesString);

  // Identify images to delete
  const oldImageUrls = campaign.slides.map(s => s.image).filter(Boolean);
  const keptImageUrls = updatedSlides.map(s => s.image).filter(Boolean);
  const imagesToDelete = oldImageUrls.filter(url => !keptImageUrls.includes(url));

  for (const url of imagesToDelete) {
    await deleteImage(url);
  }

  // Handle new file uploads
  if (req.files && req.files.length) {
    const newImageUrls = await uploadMultipleImages(req.files, 'banners');
    
    let fileIndex = 0;
    updatedSlides = updatedSlides.map(slide => {
      if (slide.fileId) {
        return { ...slide, image: newImageUrls[fileIndex++], fileId: undefined };
      }
      return slide;
    });
  }
  
  campaign.name = name;
  campaign.description = description;
  campaign.slides = updatedSlides;
  if (isActive !== undefined) campaign.isActive = isActive === 'true' || isActive === true;
  
  await campaign.save();
  res.json(campaign);
});

export const deleteCampaign = asyncHandler(async (req, res) => {
  const campaign = await BannerCampaign.findById(req.params.id);
  if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
  
  for (const slide of campaign.slides) {
    if (slide.image) {
      await deleteImage(slide.image);
    }
  }
  
  await campaign.deleteOne();
  res.json({ message: 'Campaign and its assets deleted' });
});

export const toggleActive = asyncHandler(async (req, res) => {
  const campaign = await BannerCampaign.findById(req.params.id);
  if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
  campaign.isActive = !campaign.isActive;
  await campaign.save();
  res.json(campaign);
});
