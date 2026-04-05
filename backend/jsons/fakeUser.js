import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/modules/user/user.model.js'; // তোর মডেল পাথ অনুযায়ী ঠিক করিস

dotenv.config();

export const firstNames = [
  "Arif", "Siyam", "Tanvir", "Nabil", "Fahim", "Sakib", "Tamim", "Anika", "Maliha", "Sumaiya",
  "Rokib", "Zahid", "Mahmud", "Jannat", "Farhana", "Nasrin", "Abir", "Emon", "Sabbir", "Rifat",
  "Shuvo", "Joy", "Akash", "Mim", "Niloy", "Sadia", "Habiba", "Tisha", "Sumon", "Rakib",
  "Mehedi", "Hasan", "Imran", "Kabir", "Jamil", "Monir", "Selim", "Atik", "Rubel", "Biplob",
  "Faisal", "Rasel", "Parvez", "Shipon", "Liton", "Sujon", "Sohel", "Rana", "Mamun", "Manik",
  "Raju", "Sagor", "Badal", "Kamal", "Jamal", "Abul", "Kashem", "Kader", "Latif", "Aziz",
  "Salam", "Barkat", "Rafiq", "Jabbar", "Shafi", "Mofiz", "Idris", "Yunus", "Elias", "Ishaq",
  "Musa", "Harun", "Daud", "Sulaiman", "Yahya", "Zakaria", "Ayub", "Shoaib", "Lut", "Nuh",
  "Hud", "Saleh", "Adam", "Ibrahim", "Ismail", "Yaqub", "Yusuf", "Zulkifl", "Ilyas", "Al-Yasa",
  "Isa", "Afsana", "Ruksana", "Khadija", "Fatima", "Ayesha", "Zainab", "Mariam", "Safia", "Hana"
];

export const lastNames = [
  "Ahmed", "Khan", "Hossain", "Uddin", "Akter", "Islam", "Rahman", "Sultana", "Begum", "Ahmmed",
  "Chowdhury", "Miah", "Sheikh", "Talukdar", "Bhuiyan", "Patwary", "Munshi", "Molla", "Sarkar", "Dewan",
  "Haque", "Ali", "Gazi", "Shikder", "Prodhan", "Mondal", "Bhowmik", "Das", "Sen", "Gupta",
  "Roy", "Majumder", "Gain", "Halder", "Barua", "Chakma", "Tripura", "Marma", "Kanti", "Nath",
  "Deb", "Balam", "Mirdha", "Lasker", "Kazi", "Mir", "Syed", "Khandaker", "Faruk", "Mahmud",
  "Siddique", "Azad", "Zaman", "Noor", "Alam", "Kabir", "Pasha", "Mirza", "Baig", "Qureshi",
  "Ansari", "Malik", "Shah", "Ray", "Dhar", "Banik", "Saha", "Kundu", "Paul", "Ghosh",
  "Kar", "Adhikary", "Bhattacharya", "Mukherjee", "Chatterjee", "Banerjee", "Ganguly", "Sanyal", "Bagchi", "Maitra",
  "Lahiri", "Bhaduri", "Joardar", "Howlader", "Matubbar", "Pradhan", "Sarder", "Kha", "Pathan", "Khanam",
  "Parvin", "Afroze", "Sharmin", "Ferdous", "Nargis", "Shirin", "Laila", "Hasina", "Khaleda", "Tareq"
];
const generateFakeUsers = (count) => {
  const users = [];
  const now = new Date();
  const threeYearsInMs = 3 * 365 * 24 * 60 * 60 * 1000;

  for (let i = 0; i < count; i++) {
    const fName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const joinDate = new Date(now.getTime() - Math.floor(Math.random() * threeYearsInMs));

    users.push({
      name: `${fName} ${lName}`,
      email: `${fName.toLowerCase()}.${lName.toLowerCase()}.${Date.now() + i}@vanguard.test`,
      password: "password123", // 🚀 মডেলের pre-save হুক এটাকে হ্যাশ করে দিবে
      role: "customer",
      phone: `01${Math.floor(Math.random() * 3) + 7}${Math.floor(10000000 + Math.random() * 90000000)}`,
      isEmailVerified: true,
      createdAt: joinDate
    });
  }
  return users;
};

const seedUsers = async () => {
  try {
    console.log('📡 Connecting to Syndicate Vault...');
    await mongoose.connect('mongodb+srv://yt:MNuNg1eKCoTi9cau@cluster0.kgw4w.mongodb.net/e-commerce-z?appName=Cluster0');
    console.log('✅ Connection Established.');

    const usersToInsert = generateFakeUsers(900);
    console.log(`🚀 Injecting 300 identities into the system...`);

    // 🕵️ লজিক: User.create() ইউজ করলে pre-save হুক রান করে
    // অনেক ডেটা হলে Promise.all দিয়ে হ্যান্ডেল করা ভালো
    await User.create(usersToInsert);

    console.log('✨ Mission Accomplished! 300 users seeded with hashed passwords.');
    process.exit(0);
  } catch (error) {
    console.error('🚨 Critical Failure:', error);
    process.exit(1);
  }
};

seedUsers();