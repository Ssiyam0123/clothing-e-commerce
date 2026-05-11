import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './src/modules/user/user.model.js';

const MONGO_URI = process.env.MONGO_URI;
const USER_COUNT = parseInt(70000);

async function seedUsers() {
  try {
    if (!MONGO_URI) {
      throw new Error("MONGO_URI is not defined in .env");
    }

    await mongoose.connect(MONGO_URI);
    console.log('✅ Vanguard Database Linked');

    const users = [];
    const password = await bcrypt.hash('password123', 10);

    const now = new Date();
    const threeYearsAgo = new Date(now.getFullYear() - 3, now.getMonth(), now.getDate());

    const firstNames = [
      "James", "Mary", "Robert", "Patricia", "John", "Jennifer", "Michael", "Linda", "David", "Elizabeth",
      "William", "Barbara", "Richard", "Susan", "Joseph", "Jessica", "Thomas", "Sarah", "Christopher", "Karen",
      "Charles", "Lisa", "Christopher", "Nancy", "Daniel", "Betty", "Matthew", "Margaret", "Anthony", "Sandra",
      "Mark", "Ashley", "Donald", "Dorothy", "Steven", "Kimberly", "Andrew", "Emily", "Paul", "Donna",
      "Joshua", "Michelle", "Kenneth", "Carol", "Kevin", "Amanda", "Brian", "Melissa", "Timothy", "Deborah",
      "Ronald", "Stephanie", "George", "Rebecca", "Jason", "Sharon", "Edward", "Laura", "Jeffrey", "Cynthia",
      "Ryan", "Kathleen", "Jacob", "Amy", "Nicholas", "Shirley", "Gary", "Angela", "Eric", "Helen",
      "Jonathan", "Anna", "Stephen", "Brenda", "Larry", "Pamela", "Justin", "Nicole", "Scott", "Emma",
      "Brandon", "Samantha", "Benjamin", "Katherine", "Samuel", "Christine", "Gregory", "Debra", "Alexander", "Rachel",
      "Frank", "Catherine", "Patrick", "Carolyn", "Raymond", "Janet", "Jack", "Ruth", "Dennis", "Maria",
      "Jerry", "Heather", "Tyler", "Diane", "Aaron", "Virginia", "Jose", "Julie", "Adam", "Joyce",
      "Nathan", "Victoria", "Henry", "Olivia", "Douglas", "Kelly", "Zachary", "Christina", "Peter", "Lauren",
      "Kyle", "Joan", "Ethan", "Evelyn", "Walter", "Judith", "Harold", "Megan", "Jeremy", "Cheryl",
      "Christian", "Andrea", "Keith", "Hannah", "Roger", "Martha", "Noah", "Jacqueline", "Gerald", "Frances",
      "Terry", "Gloria", "Lawrence", "Ann", "Sean", "Teresa", "Albert", "Kathryn", "Joe", "Sara",
      "Christian", "Janice", "Austin", "Jean", "Willie", "Alice", "Jesse", "Madison", "Billy", "Doris",
      "Bryan", "Abigail", "Bruce", "Julia", "Jordan", "Judy", "Ralph", "Grace", "Bryan", "Denise",
      "Abigail", "Amber", "Bruce", "Marilyn", "Jordan", "Beverly", "Ralph", "Danielle", "Eugene", "Theresa",
      "Wayne", "Sophia", "Louis", "Marie", "Dylan", "Diana", "Alan", "Brittany", "Juan", "Natalie",
      "Noah", "Isabella", "Liam", "Sophia", "Mason", "Charlotte", "Jacob", "Mia", "William", "Amelia",
      "Ethan", "Harper", "Michael", "Evelyn", "Alexander", "Abigail", "James", "Emily", "Elijah", "Elizabeth",
      "Benjamin", "Mila", "Daniel", "Ella", "Matthew", "Avery", "Aiden", "Sofia", "Henry", "Camila",
      "Joseph", "Aria", "Jackson", "Scarlett", "Samuel", "Victoria", "Sebastian", "Madison", "David", "Luna",
      "Carter", "Grace", "Wyatt", "Chloe", "Jayden", "Penelope", "John", "Layla", "Owen", "Riley",
      "Dylan", "Zoey", "Luke", "Nora", "Gabriel", "Lily", "Anthony", "Eleanor", "Isaac", "Hannah",
      "Grayson", "Lillian", "Jack", "Addison", "Julian", "Aubrey", "Levi", "Ellie", "Christopher", "Stella",
      "Joshua", "Natalie", "Andrew", "Zoe", "Lincoln", "Leah", "Mateo", "Hazel", "Ryan", "Violet",
      "Jaxon", "Aurora", "Nathan", "Savannah", "Aaron", "Audrey", "Isaiah", "Brooklyn", "Thomas", "Bella",
      "Charles", "Claire", "Caleb", "Skylar", "Josiah", "Lucy", "Christian", "Paisley", "Hunter", "Everly",
      "Eli", "Anna", "Jonathan", "Caroline", "Connor", "Nova", "Landon", "Genesis", "Adrian", "Emilia",
      "Asher", "Kennedy", "Cameron", "Samantha", "Leo", "Maya", "Theodore", "Willow", "Jeremiah", "Kinsley",
      "Hudson", "Naomi", "Robert", "Aaliyah", "Easton", "Elena", "Nolan", "Sarah", "Nicholas", "Ariana",
      "Ezra", "Allison", "Colton", "Gabriella", "Angel", "Alice", "Brayden", "Madelyn", "Jordan", "Cora",
      "Dominic", "Ruby", "Austin", "Eva", "Ian", "Serenity", "Adam", "Autumn", "Elias", "Adeline",
      "Jaxson", "Hailey", "Greyson", "Gianna", "Jose", "Valentina", "Ezekiel", "Isla", "Carson", "Eliana",
      "Evan", "Quinn", "Maverick", "Nevaeh", "Bryson", "Ivy", "Jace", "Sadie", "Cooper", "Piper",
      "Xavier", "Lydia", "Parker", "Alexa", "Roman", "Josephine", "Jason", "Emery", "Santiago", "Julia",
      "Chase", "Delilah", "Sawyer", "Arianna", "Gavin", "Vivian", "Leonardo", "Kaylee", "Kayden", "Sophie",
      "Ayden", "Brielle", "Jameson", "Madeline", "Kevin", "Peyton", "Bentley", "Rylee", "Zachary", "Clara",
      "Everett", "Hadley", "Axel", "Melanie", "Tyler", "Mackenzie", "Micah", "Reagan", "Vincent", "Adalynn",
      "Miles", "Aubree", "Wesley", "Jade", "Nathaniel", "Katherine", "Harrison", "Isabelle", "Brandon", "Natalia",
      "Cole", "Raelynn", "Declan", "Maria", "Tristan", "Athena", "Luis", "Ximena", "Braxton", "Arya",
      "Damian", "Leilani", "Silas", "Kayla", "Tristan", "Alexis", "Ryder", "Alice", "Bennett", "Eliza",
      "George", "Nadia", "Justin", "Lyla", "Max", "Sloane", "Ashton", "Tessa", "Milo", "Vera",
      "Arjun", "Ananya", "Rohan", "Saanvi", "Ishaan", "Diya", "Kabir", "Zara", "Advait", "Kyra",
      "Zayan", "Amara", "Reyansh", "Inaya", "Vihaan", "Aria", "Aryan", "Myra", "Aavya", "Kiara",
      "Kabir", "Zoya", "Arnav", "Sana", "Vivaan", "Riya", "Aditya", "Isha", "Shaurya", "Pari",
      "Sarthak", "Prisha", "Aayush", "Anika", "Tanmay", "Shanaya", "Dev", "Ira", "Rishaan", "Avni",
      "Daksh", "Navya", "Atharv", "Kaira", "Yuvraj", "Siya", "Rudransh", "Anvi", "Shivaansh", "Manya",
      "Krish", "Sara", "Aarav", "Aanya", "Ishaan", "Jhiya", "Aaryan", "Naira", "Arjun", "Vanya"
    ];

    const lastNames = [
      "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
      "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin",
      "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson",
      "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores",
      "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts",
      "Gomez", "Phillips", "Evans", "Turner", "Diaz", "Parker", "Cruz", "Edwards", "Collins", "Reyes",
      "Stewart", "Morris", "Morales", "Murphy", "Cook", "Rogers", "Gutierrez", "Morgan", "Ortiz", "Cooper",
      "Peterson", "Bailey", "Reed", "Kelly", "Howard", "Ramos", "Kim", "Cox", "Ward", "Richardson",
      "Watson", "Brooks", "Chavez", "Wood", "James", "Bennett", "Gray", "Mendoza", "Ruiz", "Hughes",
      "Price", "Alvarez", "Castillo", "Sanders", "Patel", "Myers", "Long", "Ross", "Foster", "Jimenez",
      "Powell", "Jenkins", "Perry", "Russell", "Sullivan", "Bell", "Coleman", "Butler", "Henderson", "Barnes",
      "Gonzales", "Fisher", "Vasquez", "Simmons", "Romero", "Jordan", "Patterson", "Alexander", "Hamilton", "Graham",
      "Reynolds", "Griffin", "Wallace", "Moreno", "West", "Cole", "Hayes", "Bryant", "Herrera", "Gibson",
      "Ellis", "Tran", "Medina", "Aguilar", "Stevens", "Murray", "Ford", "Castro", "Marshall", "Owens",
      "Harrison", "Fernandez", "McDonald", "Woods", "Washington", "Kennedy", "Wells", "Vargas", "Henry", "Chen",
      "Freeman", "Webb", "Tucker", "Guzman", "Burns", "Khanna", "Mehta", "Sharma", "Gupta", "Kapoor",
      "Singh", "Chopra", "Malhotra", "Joshi", "Verma", "Trivedi", "Shah", "Patil", "Deshmukh", "Kulkarni",
      "Bose", "Chatterjee", "Banerjee", "Mukherjee", "Das", "Dutta", "Sen", "Roy", "Ghosh", "Sarkar",
      "Reddy", "Nair", "Iyer", "Iyengar", "Menon", "Pillai", "Rao", "Hegde", "Shetty", "Naik",
      "Khan", "Ahmed", "Ali", "Syed", "Hussain", "Rahman", "Malik", "Iqbal", "Farooq", "Sheikh",
      "Abbas", "Baig", "Mirza", "Hashmi", "Qureshi", "Siddiqui", "Ansari", "Zaman", "Akhtar", "Dar",
      "Vanguard", "Matrix", "Nexus", "Void", "Flux", "Ghost", "Stellar", "Pulse", "Cipher", "Zenith",
      "Arias", "Beltran", "Cabrera", "Duarte", "Escobar", "Franco", "Gaitan", "Hoyos", "Ibarra", "Jara",
      "Lara", "Mora", "Nieto", "Olmos", "Pinto", "Quinto", "Rivas", "Soto", "Toro", "Uribe",
      "Vega", "Yara", "Zuluaga", "Blackwood", "Sterling", "Hawthorne", "Raven", "Winter", "Frost", "Stone",
      "Rivers", "Wolfe", "Fox", "Hunter", "Swift", "Bright", "Cloud", "Shadow", "Night", "Day",
      "Ash", "Oak", "Pine", "Birch", "Maple", "Cedar", "Willow", "Bloom", "Thorne", "Rose",
      "Drake", "Wyvern", "Griffin", "Phoenix", "Falcon", "Eagle", "Hawk", "Sparrow", "Lark", "Wren",
      "Bolt", "Flash", "Thunder", "Storm", "Gale", "Breeze", "Mist", "Fog", "Rain", "Snow",
      "Iron", "Steel", "Gold", "Silver", "Copper", "Bronze", "Jade", "Ruby", "Pearl", "Onyx",
      "Tesla", "Edison", "Newton", "Darwin", "Curie", "Einstein", "Hawking", "Turing", "Lovelace", "Hopper",
      "Aris", "Bato", "Cane", "Davy", "Eder", "Finn", "Gale", "Hale", "Ives", "Judd",
      "Kade", "Lyle", "Mace", "Nash", "Otis", "Pike", "Quay", "Reid", "Seth", "Tate",
      "Uren", "Vane", "Wade", "Xade", "Yule", "Zane", "Acker", "Beck", "Case", "Dunn",
      "Edge", "Fisk", "Gunn", "Hurd", "Isom", "Joss", "Kemp", "Lenz", "Mott", "Noon",
      "Oakes", "Page", "Quig", "Rudd", "Sams", "Todd", "Utter", "Voss", "Webb", "Xavier",
      "Yapp", "Zinn", "Abbott", "Barlow", "Carey", "Devon", "Eaton", "Finch", "Gable", "Hicks",
      "Irwin", "Jarvis", "Keats", "Loman", "Merton", "Nixon", "Ogden", "Paine", "Quarry", "Russo",
      "Sloan", "Tyler", "Upton", "Vance", "Waller", "Yates", "Zales", "Archer", "Blair", "Colt",
      "Dixon", "Elliot", "Foster", "Grant", "Holt", "Ingram", "Judd", "Knox", "Lane", "Mercer",
      "Nash", "Owen", "Pierce", "Quinn", "Rhodes", "Shaw", "Trent", "Usher", "Vince", "Wyatt",
      "York", "Zale", "Avery", "Brooks", "Clay", "Dale", "Eyre", "Ford", "Giles", "Heath",
      "Innes", "Jewel", "Kirk", "Lyle", "Moss", "Noble", "Orion", "Pratt", "Quill", "Read",
      "Saber", "Trask", "Umber", "Vale", "Ward", "Xylon", "Yeard", "Zephyr", "Astra", "Bell"
    ];

    for (let i = 0; i < USER_COUNT; i++) {
      const randomDate = new Date(threeYearsAgo.getTime() + Math.random() * (now.getTime() - threeYearsAgo.getTime()));
      
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

      users.push({
        name: `${firstName} ${lastName} ${i + 1}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${Date.now()}.${i}@vanguard.sys`,
        password,
        role: 'customer',
        phone: `017${Math.floor(10000000 + Math.random() * 90000000)}`,
        isEmailVerified: true,
        createdAt: randomDate,
        updatedAt: randomDate
      });
    }

    console.log(`🚀 Injecting data into cluster...`);
    await User.insertMany(users);
    console.log(`✅ ${USER_COUNT} users successfully synchronized.`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Operation Aborted:', error.message);
    process.exit(1);
  }
}

seedUsers();
