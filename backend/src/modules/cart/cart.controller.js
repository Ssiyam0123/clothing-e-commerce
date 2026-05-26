import Cart from './cart.model.js';
import Product from '../product/product.model.js';
import Size from '../size/size.model.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';

const calculateCartTotals = (cart) => {
  let totalItems = 0;
  let totalPrice = 0;

  if (cart.items && cart.items.length > 0) {
    cart.items.forEach(item => {
      if (!item.product || item.product.isActive === false) return;
      
      const price = item.product.discount > 0 
        ? item.product.price - (item.product.price * item.product.discount / 100)
        : item.product.price;
      
      totalItems += item.quantity;
      totalPrice += price * item.quantity;
    });
  }

  return { totalItems, totalPrice };
};

export const getCart = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.json({ items: [], totalItems: 0, totalPrice: 0 });
  }
  const userId = req.user.id || req.user._id;


  let cart = await Cart.findOne({ user: userId })
    .populate('items.product', 'name price discount images slug isActive')
    .populate('items.size', 'name');
  
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
    return res.json({ ...cart.toObject(), totalItems: 0, totalPrice: 0 });
  }
  
  // FIX Issue 12: Filter inactive items and save, then rely on the already-populated data
  const activeItems = cart.items.filter(item => item.product && item.product.isActive !== false);
  
  if (activeItems.length !== cart.items.length) {
    // Save cleaned items (use ObjectId refs)
    cart.items = activeItems
      .filter(item => item.product && item.size)
      .map(item => ({
        product: item.product._id || item.product,
        size: item.size._id || item.size,
        quantity: item.quantity
      }));
    await cart.save();
    
    // Re-populate once after saving
    await cart.populate('items.product', 'name price discount images slug isActive');
    await cart.populate('items.size', 'name');
  }
  
  const { totalItems, totalPrice } = calculateCartTotals(cart);
  
  res.json({
    ...cart.toObject(),
    totalItems,
    totalPrice
  });
});

export const addToCart = asyncHandler(async (req, res) => {
  const { productId, sizeId, quantity } = req.body;
  const userId = req.user.id || req.user._id;
  
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  
  const size = await Size.findById(sizeId);
  if (!size) return res.status(404).json({ message: 'Size not found' });
  
  const sizeStock = product.sizes.find(s => s.size.toString() === sizeId);
  if (!sizeStock || sizeStock.stock < quantity) {
    return res.status(400).json({ message: 'Insufficient stock' });
  }
  
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  
  const existingItem = cart.items.find(
    item => item.product.toString() === productId && item.size.toString() === sizeId
  );
  
  if (existingItem) {
    // FIX Bug 2: Check cumulative quantity against stock
    const newQuantity = existingItem.quantity + quantity;
    if (sizeStock.stock < newQuantity) {
      return res.status(400).json({ 
        message: `Only ${sizeStock.stock} units available. You already have ${existingItem.quantity} in cart.` 
      });
    }
    existingItem.quantity = newQuantity;
  } else {
    cart.items.push({ product: productId, size: sizeId, quantity });
  }
  
  await cart.save();
  
  await cart.populate('items.product', 'name price discount images slug isActive');
  await cart.populate('items.size', 'name');
  
  const { totalItems, totalPrice } = calculateCartTotals(cart);
  
  res.json({
    ...cart.toObject(),
    totalItems,
    totalPrice
  });
});

export const updateCartItem = asyncHandler(async (req, res) => {
  const { productId, sizeId, quantity } = req.body;
  const userId = req.user.id || req.user._id;
  
  const cart = await Cart.findOne({ user: userId });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });
  
  // FIX Bug 1: Inline remove instead of calling removeFromCart (which reads req.params)
  if (quantity < 1) {
    cart.items = cart.items.filter(
      item => !(item.product.toString() === productId && item.size.toString() === sizeId)
    );
    await cart.save();
    await cart.populate('items.product', 'name price discount images slug isActive');
    await cart.populate('items.size', 'name');
    const { totalItems, totalPrice } = calculateCartTotals(cart);
    return res.json({ ...cart.toObject(), totalItems, totalPrice });
  }
  
  const item = cart.items.find(
    item => item.product.toString() === productId && item.size.toString() === sizeId
  );
  
  if (!item) return res.status(404).json({ message: 'Item not found in cart' });
  
  const product = await Product.findById(productId);
  const sizeStock = product?.sizes.find(s => s.size.toString() === sizeId);
  if (sizeStock && sizeStock.stock < quantity) {
    return res.status(400).json({ message: `Insufficient stock. Only ${sizeStock.stock} available.` });
  }
  
  item.quantity = quantity;
  await cart.save();
  
  await cart.populate('items.product', 'name price discount images slug isActive');
  await cart.populate('items.size', 'name');
  
  const { totalItems, totalPrice } = calculateCartTotals(cart);
  
  res.json({
    ...cart.toObject(),
    totalItems,
    totalPrice
  });
});

export const removeFromCart = asyncHandler(async (req, res) => {
  const { productId, sizeId } = req.params;
  const userId = req.user.id || req.user._id;
  
  const cart = await Cart.findOne({ user: userId });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });
  
  cart.items = cart.items.filter(
    item => !(item.product.toString() === productId && item.size.toString() === sizeId)
  );
  
  await cart.save();
  
  await cart.populate('items.product', 'name price discount images slug isActive');
  await cart.populate('items.size', 'name');
  
  const { totalItems, totalPrice } = calculateCartTotals(cart);
  
  res.json({
    ...cart.toObject(),
    totalItems,
    totalPrice
  });
});

export const changeSize = asyncHandler(async (req, res) => {
  const { productId, oldSizeId, newSizeId } = req.body;
  const userId = req.user.id || req.user._id;

  const cart = await Cart.findOne({ user: userId });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });

  const itemIndex = cart.items.findIndex(
    item => item.product.toString() === productId && item.size.toString() === oldSizeId
  );
  if (itemIndex === -1) return res.status(404).json({ message: 'Item not found in cart' });

  const quantity = cart.items[itemIndex].quantity;

  // Check stock for new size
  const product = await Product.findById(productId);
  const sizeStock = product?.sizes.find(s => s.size.toString() === newSizeId);
  if (!sizeStock || sizeStock.stock < quantity) {
    return res.status(400).json({ message: 'Insufficient stock for new size' });
  }

  // Check if new size already exists in cart
  const targetItemIndex = cart.items.findIndex(
    item => item.product.toString() === productId && item.size.toString() === newSizeId
  );

  if (targetItemIndex !== -1) {
    // Merge: check combined quantity against stock
    const combinedQty = cart.items[targetItemIndex].quantity + quantity;
    if (sizeStock.stock < combinedQty) {
      return res.status(400).json({ 
        message: `Insufficient stock. Only ${sizeStock.stock} available for this size.` 
      });
    }
    cart.items[targetItemIndex].quantity = combinedQty;
    cart.items.splice(itemIndex, 1);
  } else {
    cart.items[itemIndex].size = newSizeId;
  }

  await cart.save();
  
  await cart.populate('items.product', 'name price discount images slug isActive');
  await cart.populate('items.size', 'name');
  
  const { totalItems, totalPrice } = calculateCartTotals(cart);
  
  res.json({
    ...cart.toObject(),
    totalItems,
    totalPrice
  });
});

export const clearCart = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user._id;
  const cart = await Cart.findOne({ user: userId });
  if (cart) {
    cart.items = [];
    await cart.save();
  }
  res.json({ message: 'Cart cleared', items: [], totalItems: 0, totalPrice: 0 });
});

export const bulkAddCart = asyncHandler(async (req, res) => {
  const { items } = req.body; 
  const userId = req.user.id || req.user._id;

  if (!Array.isArray(items)) {
    return res.status(400).json({ message: "Items must be an array" });
  }

  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = new Cart({ user: userId, items: [] });
  }

  for (const newItem of items) {
    const existingItemIndex = cart.items.findIndex(
      (item) => 
        item.product.toString() === newItem.productId && 
        item.size.toString() === newItem.sizeId
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += newItem.quantity;
    } else {
      cart.items.push({
        product: newItem.productId,
        size: newItem.sizeId,
        quantity: newItem.quantity
      });
    }
  }

  await cart.save();
  
  await cart.populate('items.product', 'name price discount images slug isActive');
  await cart.populate('items.size', 'name');
  
  const { totalItems, totalPrice } = calculateCartTotals(cart);
  res.status(200).json({ ...cart.toObject(), totalItems, totalPrice });
});