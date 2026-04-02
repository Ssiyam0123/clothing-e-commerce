import 'dotenv/config';
import mongoose from 'mongoose';

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ Vanguard DB Linked');

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();

    // // 🧹 singular 'user' কালেকশন থাকলে মুছে দাও
    // if (collections.some(c => c.name === 'user')) {
    //   await db.collection('user').drop();
    //   console.log('⚠️ Singular user table purged.');
    // }

    const { default: app } = await import('./app.js');
    app.listen(PORT, () => console.log(`🚀 System Live: ${PORT}`));
  });