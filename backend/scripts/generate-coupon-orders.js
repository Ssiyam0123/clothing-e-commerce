import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ObjectId } from 'mongodb';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const couponsPath = path.join(__dirname, '../jsons/e-commerce-z.coupons.json');
const ordersPath = path.join(__dirname, '../jsons/e-commerce-z.orders.updated.json');
const outputPath = path.join(__dirname, '../jsons/e-commerce-z.orders.updated.json');

async function generateCouponOrders() {
    console.log('Reading data files...');
    const coupons = JSON.parse(fs.readFileSync(couponsPath, 'utf8'));
    const orders = JSON.parse(fs.readFileSync(ordersPath, 'utf8'));

    console.log(`Loaded ${coupons.length} coupons and ${orders.length} existing orders.`);

    const newOrdersCount = 3000;
    const newOrders = [];

    for (let i = 0; i < newOrdersCount; i++) {
        // Pick a template order
        const template = orders[Math.floor(Math.random() * orders.length)];
        
        // Pick a coupon
        const coupon = coupons[Math.floor(Math.random() * coupons.length)];
        
        // Clone template
        const newOrder = JSON.parse(JSON.stringify(template));
        
        // New ID
        newOrder._id = { "$oid": new ObjectId().toString() };
        
        // New transaction ID
        newOrder.paymentResult.transactionId = 'TXN-' + Math.random().toString(36).toUpperCase().substr(2, 8);
        
        // Apply coupon
        newOrder.couponCode = coupon.code;
        
        let discount = 0;
        if (coupon.discountType === 'percentage') {
            discount = (newOrder.itemsPrice * coupon.discountValue) / 100;
        } else {
            discount = coupon.discountValue;
        }
        
        // Ensure discount doesn't exceed items price
        discount = Math.min(discount, newOrder.itemsPrice);
        
        newOrder.discountAmount = discount;
        newOrder.totalPrice = (newOrder.itemsPrice + newOrder.shippingPrice) - discount;
        
        // Set a random date in the last year
        const date = new Date();
        date.setMonth(date.getMonth() - Math.floor(Math.random() * 12));
        date.setDate(Math.floor(Math.random() * 28) + 1);
        
        newOrder.createdAt = { "$date": date.toISOString() };
        newOrder.updatedAt = { "$date": date.toISOString() };
        
        newOrders.push(newOrder);
        
        if (i % 500 === 0 && i > 0) console.log(`Generated ${i} orders...`);
    }

    console.log(`Generated ${newOrdersCount} orders. Appending to list...`);
    const finalOrders = orders.concat(newOrders);

    console.log(`Writing ${finalOrders.length} total orders to ${outputPath}...`);
    fs.writeFileSync(outputPath, JSON.stringify(finalOrders, null, 2));
    
    console.log('Done! Script finished successfully.');
}

generateCouponOrders().catch(console.error);
