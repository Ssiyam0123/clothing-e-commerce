import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

async function fixCouponCounts() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const Coupon = mongoose.model('Coupon', new mongoose.Schema({
            code: String,
            usedCount: Number
        }, { collection: 'coupons' }));

        const Order = mongoose.model('Order', new mongoose.Schema({
            couponCode: String
        }, { collection: 'orders' }));

        const coupons = await Coupon.find({});
        console.log(`Found ${coupons.length} coupons to update.`);

        for (const coupon of coupons) {
            const count = await Order.countDocuments({ couponCode: coupon.code });
            console.log(`Coupon ${coupon.code}: ${count} usages found.`);
            await Coupon.updateOne({ _id: coupon._id }, { usedCount: count });
        }

        console.log('Update complete!');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

fixCouponCounts();
