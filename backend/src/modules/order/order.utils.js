import Product from "../product/product.model.js";
import Coupon from "../coupon/coupon.model.js";
import Cart from "../cart/cart.model.js";
import PageSetting from "../settings/settings.model.js";
import { sendOrderConfirmationEmail } from "../../services/email.service.js";

export const calculateValidatedOrder = async (orderItems, couponCode, shippingPrice, deliveryZone) => {
    const settings = await PageSetting.findOne();
    const defaultInside = settings?.shipping?.insideDhaka || 60;
    const defaultOutside = settings?.shipping?.outsideDhaka || 120;
    let itemsPrice = 0;
    const validatedItems = [];
    
    // 🚀 SENIOR OPTIMIZATION: Avoid N+1 queries by pre-fetching all products
    const productIds = orderItems.map(item => item.product);
    const products = await Product.find({ _id: { $in: productIds } });
    const productMap = products.reduce((acc, p) => {
        acc[p._id.toString()] = p;
        return acc;
    }, {});

    for (const item of orderItems) {
        const product = productMap[item.product.toString()];
        if (!product || !product.isActive) throw new Error(`Artifact unavailable or offline.`);
        
        const requestedSizeId = item.size?._id || item.size;
        
        if (product.sizes && product.sizes.length > 0) {
            if (!requestedSizeId) {
                throw new Error(`Size specification required for ${product.name}`);
            }

            const sizeStock = product.sizes.find(s => 
                s.size.toString() === requestedSizeId.toString()
            );
            
            if (!sizeStock || sizeStock.stock < item.quantity) {
                throw new Error(`Insufficient stock for ${product.name} (Requested size: ${requestedSizeId})`);
            }
        }
        const unitPrice = product.discount > 0 ? product.price * (1 - product.discount / 100) : product.price;
        itemsPrice += unitPrice * item.quantity;
        validatedItems.push({
            product: product._id,
            name: product.name,
            size: requestedSizeId,
            quantity: item.quantity,
            price: Number(unitPrice.toFixed(2)),
            image: product.images?.[0] || "",
        });
    }
    // Use provided shipping price or calculate from settings based on zone
    let finalShippingPrice;
    if (deliveryZone) {
        finalShippingPrice = deliveryZone === "dhaka" ? defaultInside : defaultOutside;
    } else {
        finalShippingPrice = Number(shippingPrice) || defaultInside;
    }

    let discountAmount = 0, finalCoupon = null;
    if (couponCode) {
        const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
        const now = new Date();
        if (coupon && coupon.startDate <= now && (!coupon.endDate || coupon.endDate >= now) && itemsPrice >= coupon.minOrderAmount) {
            finalCoupon = coupon.code;
            discountAmount = coupon.discountType === "percentage"
                ? Math.min((itemsPrice * coupon.discountValue) / 100, coupon.maxDiscount || Infinity)
                : coupon.discountValue;
        }
    }
    return {
        itemsPrice: Number(itemsPrice.toFixed(2)),
        discountAmount: Number(discountAmount.toFixed(2)),
        shippingPrice: finalShippingPrice,
        totalPrice: Number((itemsPrice - discountAmount + finalShippingPrice).toFixed(2)),
        validatedItems,
        couponCode: finalCoupon
    };
};

export const normalizeShippingAddress = (addr) => ({
    name: addr.name, 
    email: addr.email, 
    phone: addr.phone,
    address: addr.address || [addr.street, addr.city].filter(Boolean).join(", ")
});

export const finalizeOrderProcessing = async (order, session = null) => {
    // 🚀 ATOMIC STOCK DECREMENT: Ensures no negative stock during concurrent load
    const bulkOps = order.orderItems.map((item) => ({
      updateOne: {
        filter: { 
            _id: item.product, 
            "sizes.size": item.size,
            "sizes.stock": { $gte: item.quantity } // Safety check
        },
        update: { $inc: { "sizes.$.stock": -item.quantity } },
      },
    }));
    
    if (bulkOps.length > 0) {
        const result = await Product.bulkWrite(bulkOps, { session });
        if (result.matchedCount < bulkOps.length) {
            console.error("❌ CONCURRENCY ERROR: Stock depletion between validation and finalization");
            // In a real scenario, this might need more complex handling if payment was already made
        }
    }
    
    if (order.couponCode) {
      await Coupon.findOneAndUpdate(
        { code: order.couponCode },
        { $inc: { usedCount: 1 } },
        { session }
      );
    }
  
    if (!order.isDirectBuy && order.user) {
      await Cart.findOneAndUpdate(
        { user: order.user }, 
        { $set: { items: [] } },
        { session }
      );
    }

    // 🚀 AUTOMATED ORDER CONFIRMATION EMAIL
    try {
        await sendOrderConfirmationEmail(order);
        console.log(`📧 Order confirmation email sent to ${order.shippingAddress.email}`);
    } catch (error) {
        console.error("❌ Failed to send order confirmation email:", error);
    }
};