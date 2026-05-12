import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const ordersPath = path.join(__dirname, '../jsons/e-commerce-z.orders.updated.json');

async function syncOrders() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/clothing-e-commerce');
        console.log('Connected!');

        console.log('Reading orders from JSON...');
        const orders = JSON.parse(fs.readFileSync(ordersPath, 'utf8'));
        console.log(`Loaded ${orders.length} orders.`);

        // Define a simple Order schema for syncing
        const orderSchema = new mongoose.Schema({}, { strict: false, collection: 'orders' });
        const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

        console.log('Clearing existing orders in database...');
        await Order.deleteMany({});
        
        console.log('Inserting orders into database (this may take a while)...');
        
        // Convert $oid and $date to proper MongoDB types
        const processedOrders = orders.map(order => {
            const processed = { ...order };
            if (processed._id && processed._id.$oid) processed._id = new mongoose.Types.ObjectId(processed._id.$oid);
            if (processed.user && processed.user.$oid) processed.user = new mongoose.Types.ObjectId(processed.user.$oid);
            
            if (processed.orderItems) {
                processed.orderItems = processed.orderItems.map(item => ({
                    ...item,
                    product: item.product && item.product.$oid ? new mongoose.Types.ObjectId(item.product.$oid) : item.product,
                    size: item.size && item.size.$oid ? new mongoose.Types.ObjectId(item.size.$oid) : item.size
                }));
            }
            
            if (processed.createdAt && processed.createdAt.$date) processed.createdAt = new Date(processed.createdAt.$date);
            if (processed.updatedAt && processed.updatedAt.$date) processed.updatedAt = new Date(processed.updatedAt.$date);
            
            return processed;
        });

        // Batch insert
        const batchSize = 1000;
        for (let i = 0; i < processedOrders.length; i += batchSize) {
            const batch = processedOrders.slice(i, i + batchSize);
            await Order.insertMany(batch);
            console.log(`Inserted ${i + batch.length} orders...`);
        }

        console.log('Sync complete!');
        process.exit(0);
    } catch (error) {
        console.error('Sync failed:', error);
        process.exit(1);
    }
}

syncOrders();
