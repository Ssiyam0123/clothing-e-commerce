import HomeLayout from './homeLayout.model.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';

// Get current active layout
export const getActiveLayout = asyncHandler(async (req, res) => {
  let layout = await HomeLayout.findOne({ isActive: true });
  
  // Fallback to default if none exists
  if (!layout) {
    layout = {
      sections: [
        { id: 'hero-default', type: 'HERO', isVisible: true, title: '', subtitle: '', imageUrl: '', actionLink: '', config: {} },
        { id: 'usp-default', type: 'USP', isVisible: true, title: '', subtitle: '', imageUrl: '', actionLink: '', config: {} },
        { id: 'grid-default', type: 'CATEGORY_GRID', isVisible: true, title: '', subtitle: '', imageUrl: '', actionLink: '', config: {} },
        { id: 'new-default', type: 'NEW_ARRIVALS', isVisible: true, title: '', subtitle: '', imageUrl: '', actionLink: '', config: {} },
      ]
    };
  }
  
  res.json(layout);
});

// Update or Create layout
export const updateLayout = asyncHandler(async (req, res) => {
  const { sections } = req.body;
  
  let layout = await HomeLayout.findOne({ isActive: true });
  
  if (layout) {
    layout.sections = sections;
    await layout.save();
  } else {
    layout = await HomeLayout.create({
      sections,
      isActive: true
    });
  }
  
  res.json(layout);
});

// Get all layouts (for versioning support)
export const getAllLayouts = asyncHandler(async (req, res) => {
  const layouts = await HomeLayout.find().sort('-createdAt');
  res.json(layouts);
});

// Create new version
export const createNewVersion = asyncHandler(async (req, res) => {
  const { name, sections } = req.body;
  
  // Deactivate others
  await HomeLayout.updateMany({}, { isActive: false });
  
  const layout = await HomeLayout.create({
    name: name || `Layout ${new Date().toLocaleDateString()}`,
    sections,
    isActive: true
  });
  
  res.status(201).json(layout);
});
