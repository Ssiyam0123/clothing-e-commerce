import { asyncHandler } from '../../middleware/asyncHandler.js';
import Order from '../order/order.model.js';
import Product from '../product/product.model.js';
import User from '../user/user.model.js';
import mongoose from 'mongoose';

export const getDashboardData = asyncHandler(async (req, res) => {
    const { year, month } = req.query;
    const targetYear = year ? parseInt(year) : new Date().getFullYear();
    const targetMonth = month && month !== 'all' ? parseInt(month) : null;

    let startDate, endDate, groupByFormat;

    if (targetMonth) {
        // 📅 যদি নির্দিষ্ট মাস সিলেক্ট করা থাকে (Show Daily)
        startDate = new Date(targetYear, targetMonth - 1, 1);
        endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59, 999);
        groupByFormat = "%Y-%m-%d"; // প্রতিদিনের ডাটা
    } else {
        // 📅 যদি শুধু বছর সিলেক্ট থাকে (Show Monthly)
        startDate = new Date(targetYear, 0, 1);
        endDate = new Date(targetYear, 11, 31, 23, 59, 59, 999);
        groupByFormat = "%Y-%m"; // প্রতি মাসের ডাটা
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const statsResult = await Order.aggregate([
        {
            $facet: {
                totalStats: [
                    { $match: { 'paymentResult.status': { $in: ['Completed', 'COD'] } } },
                    {
                        $group: {
                            _id: null,
                            revenue: { $sum: { $toDouble: '$totalPrice' } },
                            count: { $sum: 1 },
                            avgTicketSize: { $avg: { $toDouble: '$totalPrice' } }
                        }
                    }
                ],
                todayStats: [
                    { $addFields: { convertedDate: { $toDate: "$createdAt" } } },
                    { $match: { convertedDate: { $gte: today }, 'paymentResult.status': { $in: ['Completed', 'COD'] } } },
                    { $group: { _id: null, revenue: { $sum: { $toDouble: '$totalPrice' } }, count: { $sum: 1 } } }
                ],
                monthlyTrend: [
                    { $addFields: { convertedDate: { $toDate: "$createdAt" } } },
                    { 
                        $match: { 
                            convertedDate: { $gte: startDate, $lte: endDate },
                            'paymentResult.status': { $in: ['Completed', 'COD'] } 
                        } 
                    },
                    {
                        $group: {
                            _id: { $dateToString: { format: groupByFormat, date: "$convertedDate" } },
                            revenue: { $sum: { $toDouble: "$totalPrice" } }
                        }
                    },
                    { $sort: { "_id": 1 } }
                ]
            }
        }
    ], { allowDiskUse: true }); // 🚀 Memory limit fix

    const stats = statsResult[0] || {};

    // 📦 Inventory, Categories, User Stats (Keep existing logic)
    const inventoryStats = await Product.aggregate([
        { $project: { name: 1, totalStock: { $sum: "$sizes.stock" } } },
        { $group: { _id: null, totalProducts: { $sum: 1 }, outOfStockCount: { $sum: { $cond: [{ $eq: ["$totalStock", 0] }, 1, 0] } }, lowStockCount: { $sum: { $cond: [{ $and: [{ $gt: ["$totalStock", 0] }, { $lt: ["$totalStock", 10] }] }, 1, 0] } }, criticalItems: { $push: { $cond: [{ $lt: ["$totalStock", 10] }, { name: "$name", stock: "$totalStock", status: { $cond: [{ $eq: ["$totalStock", 0] }, "OUT", "LOW"] } }, "$$REMOVE"] } } } }
    ]);

    const categoryStats = await Product.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'catInfo' } },
        { $unwind: { path: "$catInfo", preserveNullAndEmptyArrays: true } },
        { $project: { name: { $ifNull: ["$catInfo.name", "Uncategorized"] }, count: 1 } }
    ]);

    const recentOrdersRaw = await Order.find({}).sort('-createdAt').limit(5).lean();
    const userIds = recentOrdersRaw.map(o => o.user).filter(uid => uid != null); 
    const users = await User.find({ _id: { $in: userIds } }).select('name email avatar').lean();
    const userMap = users.reduce((acc, u) => { acc[String(u._id)] = u; return acc; }, {});

    const enrichedOrders = recentOrdersRaw.map(order => ({
        ...order,
        user: order.user ? userMap[String(order.user)] : { name: order.shippingAddress?.name || 'Guest User' }
    }));

    res.json({
        revenue: {
            total: stats.totalStats?.[0]?.revenue || 0,
            avgOrder: stats.totalStats?.[0]?.avgTicketSize || 0,
            today: stats.todayStats?.[0]?.revenue || 0,
            trend: stats.monthlyTrend || []
        },
        inventory: {
            totalProducts: inventoryStats[0]?.totalProducts || 0,
            outOfStock: inventoryStats[0]?.outOfStockCount || 0,
            criticalItems: inventoryStats[0]?.criticalItems?.slice(0, 5) || []
        },
        categories: categoryStats,
        customers: {
            total: await User.countDocuments({ role: 'customer' }),
            newThisMonth: await User.countDocuments({ role: 'customer', createdAt: { $gte: new Date(today.getFullYear(), today.getMonth(), 1) } })
        },
        recentOrders: enrichedOrders
    });
});