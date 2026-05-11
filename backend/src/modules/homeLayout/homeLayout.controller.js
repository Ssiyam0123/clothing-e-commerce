import HomeLayout from './homeLayout.model.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';

// Get all layout architectures
export const getAllLayouts = asyncHandler(async (req, res) => {
  let layouts = await HomeLayout.find().sort({ createdAt: -1 });
  
  if (layouts.length === 0) {
    const defaultLayout = await HomeLayout.create({
      name: 'Architecture 1',
      isActive: true,
      sections: [
        { id: 'hero-default', type: 'HERO', isVisible: true, title: 'VANGUARD', subtitle: 'PREMIUM ARTIFACTS' },
        { id: 'usp-default', type: 'USP', isVisible: true }
      ]
    });
    layouts = [defaultLayout];
  }
  
  res.json(layouts);
});

// Get the active layout for storefront
export const getActiveLayout = asyncHandler(async (req, res) => {
  let layout = await HomeLayout.findOne({ isActive: true });
  
  if (!layout) {
    // If no active layout, take the first one or create a default
    layout = await HomeLayout.findOne();
  }

  if (!layout) {
    layout = await HomeLayout.create({
      name: 'Architecture 1',
      isActive: true,
      sections: [
        { id: 'hero-default', type: 'HERO', isVisible: true, title: 'VANGUARD', subtitle: 'PREMIUM ARTIFACTS' },
        { id: 'usp-default', type: 'USP', isVisible: true }
      ]
    });
  }
  
  res.json({ sections: layout.sections });
});

// Create a new layout architecture
export const createLayout = asyncHandler(async (req, res) => {
  const { name } = req.body;
  
  // Clone sections from current active layout if it exists
  const activeLayout = await HomeLayout.findOne({ isActive: true });
  const sections = activeLayout ? activeLayout.sections : [];

  const layout = await HomeLayout.create({
    name: name || `Architecture ${Date.now()}`,
    sections,
    isActive: false // New layouts are inactive by default
  });

  res.status(201).json(layout);
});

// Update a specific layout
export const updateLayout = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { sections, name } = req.body;
  
  const layout = await HomeLayout.findByIdAndUpdate(
    id,
    { $set: { sections, name } },
    { new: true }
  );

  if (!layout) return res.status(404).json({ message: "Layout not found" });
  
  res.json(layout);
});

// Switch active architecture
export const switchLayout = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Deactivate all
  await HomeLayout.updateMany({}, { isActive: false });

  // Activate selected
  const layout = await HomeLayout.findByIdAndUpdate(
    id,
    { isActive: true },
    { new: true }
  );

  if (!layout) return res.status(404).json({ message: "Layout not found" });
  
  res.json({ message: `${layout.name} is now active.`, layout });
});

// Delete architecture
export const deleteLayout = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const layout = await HomeLayout.findById(id);
    
    if (!layout) return res.status(404).json({ message: "Layout not found" });
    if (layout.isActive) return res.status(400).json({ message: "Cannot delete active architecture." });

    await layout.deleteOne();
    res.json({ message: "Architecture removed." });
});
