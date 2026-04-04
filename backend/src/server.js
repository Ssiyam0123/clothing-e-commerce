import 'dotenv/config';
import mongoose from 'mongoose';

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ Vanguard DB Linked');



    const { default: app } = await import('./app.js');
    app.listen(PORT, () => console.log(`🚀 System Live: ${PORT}`));
  });