import { asyncHandler } from '../../middleware/asyncHandler.js';
import Order from '../order/order.model.js';
import Product from '../product/product.model.js';
import mongoose from 'mongoose';

export const getDashboardData = asyncHandler(async (req, res) => {
    const db = mongoose.connection.db;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. Unified Aggregation for Financials & Inventory
    // 💡 টিপ: ইনভেন্টরি লজিক মেমোরিতে না করে ডাটাবেসেই এগ্রিগেট করা হচ্ছে।
    const [stats] = await Order.aggregate([
        {
            $facet: {
                totalStats: [
                    { $match: { 'paymentResult.status': 'Completed' } },
                    {
                        $group: {
                            _id: null,
                            revenue: { $sum: '$totalPrice' },
                            count: { $sum: 1 },
                            avgTicketSize: { $avg: '$totalPrice' }
                        }
                    }
                ],
                todayStats: [
                    { $match: { createdAt: { $gte: today }, 'paymentResult.status': 'Completed' } },
                    { $group: { _id: null, revenue: { $sum: '$totalPrice' }, count: { $sum: 1 } } }
                ],
                monthlyTrend: [
                    { $match: { 'paymentResult.status': 'Completed' } },
                    {
                        $group: {
                            _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                            revenue: { $sum: "$totalPrice" }
                        }
                    },
                    { $sort: { "_id": 1 } },
                    { $limit: 12 }
                ]
            }
        }
    ]);

    // 2. Optimized Inventory Aggregation
    // 💡 টিপ: হাজার হাজার প্রোডাক্ট থাকলেও মেমোরি বিন্দুমাত্র লোড হবে না।
    const inventoryStats = await Product.aggregate([
        {
            $project: {
                name: 1,
                totalStock: { $sum: "$sizes.stock" }
            }
        },
        {
            $group: {
                _id: null,
                totalProducts: { $sum: 1 },
                outOfStockCount: {
                    $sum: { $cond: [{ $eq: ["$totalStock", 0] }, 1, 0] }
                },
                lowStockCount: {
                    $sum: { $cond: [{ $and: [{ $gt: ["$totalStock", 0] }, { $lt: ["$totalStock", 10] }] }, 1, 0] }
                },
                criticalItems: {
                    $push: {
                        $cond: [
                            { $lt: ["$totalStock", 10] },
                            { name: "$name", stock: "$totalStock", status: { $cond: [{ $eq: ["$totalStock", 0] }, "OUT", "LOW"] } },
                            "$$REMOVE"
                        ]
                    }
                }
            }
        }
    ]);

    // 3. Category Distribution
    const categoryStats = await Product.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'catInfo' } },
        { $unwind: "$catInfo" },
        { $project: { name: "$catInfo.name", count: 1 } }
    ]);

    // 4. Logistics Funnel
    const logisticsStats = await Order.aggregate([
        { $group: { _id: "$orderStatus", count: { $sum: 1 } } }
    ]);

    // 5. Customer Insights (Better Auth Optimized)
    const customerStats = {
        total: await db.collection('users').countDocuments({ role: 'customer' }),
        newThisMonth: await db.collection('users').countDocuments({
            role: 'customer',
            createdAt: { $gte: new Date(today.getFullYear(), today.getMonth(), 1) }
        })
    };

    // 6. Recent Orders (Bulk User Mapping - NO LOOP AWAIT)
    // 💡 টিপ: এখানে ১টা কুয়েরিতে ৫টা ইউজারের ডাটা নিয়ে আসা হচ্ছে।
    const recentOrdersRaw = await Order.find({}).sort('-createdAt').limit(5).lean();
    const userIds = recentOrdersRaw.map(o => o.user);
    
    const users = await db.collection('users').find({
        $or: [
            { _id: { $in: userIds } },
            { id: { $in: userIds } }
        ]
    }).toArray();

    const userMap = users.reduce((acc, u) => {
        acc[u.id || u._id.toString()] = { name: u.name, email: u.email };
        return acc;
    }, {});

    const enrichedOrders = recentOrdersRaw.map(order => ({
        ...order,
        user: userMap[order.user.toString()] || { name: 'Guest User', email: 'N/A' }
    }));

    // Response
    res.json({
        revenue: {
            total: stats.totalStats[0]?.revenue || 0,
            avgOrder: stats.totalStats[0]?.avgTicketSize || 0,
            today: stats.todayStats[0]?.revenue || 0,
            todayCount: stats.todayStats[0]?.count || 0,
            trend: stats.monthlyTrend
        },
        inventory: {
            totalProducts: inventoryStats[0]?.totalProducts || 0,
            lowStock: inventoryStats[0]?.lowStockCount || 0,
            outOfStock: inventoryStats[0]?.outOfStockCount || 0,
            criticalItems: inventoryStats[0]?.criticalItems.slice(0, 5) || []
        },
        logistics: logisticsStats,
        categories: categoryStats,
        customers: customerStats,
        recentOrders: enrichedOrders
    });
});