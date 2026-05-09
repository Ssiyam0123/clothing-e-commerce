import Product from "../product/product.model.js";
import Coupon from "../coupon/coupon.model.js";
import Cart from "../cart/cart.model.js";

export const calculateValidatedOrder = async (orderItems, couponCode, cityId) => {
    let itemsPrice = 0;
    const validatedItems = [];
    for (const item of orderItems) {
        const product = await Product.findById(item.product);
        if (!product || !product.isActive) throw new Error(`Product unavailable`);
        const sizeStock = product.sizes.find(s => s.size.toString() === item.size.toString());
        if (!sizeStock || sizeStock.stock < item.quantity) throw new Error(`Insufficient stock for ${product.name}`);
        const unitPrice = product.discount > 0 ? product.price * (1 - product.discount / 100) : product.price;
        itemsPrice += unitPrice * item.quantity;
        validatedItems.push({
            product: product._id,
            name: product.name,
            size: item.size,
            quantity: item.quantity,
            price: Number(unitPrice.toFixed(2)),
            image: product.images?.[0] || "",
        });
    }
    const shippingPrice = Number(cityId) === 1 ? 60 : 120;
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
        shippingPrice,
        totalPrice: Number((itemsPrice - discountAmount + shippingPrice).toFixed(2)),
        validatedItems,
        couponCode: finalCoupon
    };
};

export const normalizeShippingAddress = (addr) => ({
    name: addr.name, email: addr.email, phone: addr.phone,
    street: addr.street, city: addr.city, state: addr.state || "N/A",
    zip: addr.zip || "1000", country: addr.country || "Bangladesh",
    pathao_city_id: addr.pathao_city_id, pathao_zone_id: addr.pathao_zone_id, pathao_area_id: addr.pathao_area_id,
});

export const finalizeOrderProcessing = async (order) => {
    const bulkOps = order.orderItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product, "sizes.size": item.size },
        update: { $inc: { "sizes.$.stock": -item.quantity } },
      },
    }));
    
    if (bulkOps.length > 0) await Product.bulkWrite(bulkOps);
    
    if (order.couponCode) {
      await Coupon.findOneAndUpdate(
        { code: order.couponCode },
        { $inc: { usedCount: 1 } }
      );
    }
  
    if (!order.isDirectBuy && order.user) {
      await Cart.findOneAndUpdate({ user: order.user }, { $set: { items: [] } });
    }
};