import fs from 'fs'
// Provided Users from your context
const users =[{
  "_id": {
    "$oid": "69d0c20f3df91c4df3eb4abc"
  },
  "name": "eshtiyak ahmmed siyam",
  "email": "ssiyam563@gmail.com",
  "password": "$2b$10$tAhdVg7YwnoItD.9/nvSx.4ot3YhBUkhW9QN9XE/l4zcfGZp/C70C",
  "avatar": "",
  "role": "admin",
  "phone": "",
  "bio": "",
  "addresses": [],
  "isEmailVerified": false,
  "emailVerificationToken": "1a26b03c53f13538d76d47931658b3659fb03ce16dbb1c4e46d9590a900acbcf",
  "createdAt": {
    "$date": "2026-04-04T07:47:27.174Z"
  },
  "updatedAt": {
    "$date": "2026-04-04T07:47:27.174Z"
  },
  "__v": 0
},
{
  "_id": {
    "$oid": "69d171d519953b7130bf1b4e"
  },
  "name": "Rahim Ahmed",
  "email": "rahim.ahmed1@example.com",
  "password": "password123",
  "avatar": "",
  "role": "customer",
  "phone": "01710000001",
  "bio": "Tech enthusiast and fashion lover.",
  "addresses": [],
  "isEmailVerified": true,
  "emailVerificationToken": null,
  "passwordResetToken": null,
  "passwordResetExpires": null
},
{
  "_id": {
    "$oid": "69d171d519953b7130bf1b4f"
  },
  "name": "Karim Uddin",
  "email": "karim.uddin2@example.com",
  "password": "password123",
  "avatar": "",
  "role": "customer",
  "phone": "01710000002",
  "bio": "Always on the lookout for trendy clothes.",
  "addresses": [],
  "isEmailVerified": true,
  "emailVerificationToken": null,
  "passwordResetToken": null,
  "passwordResetExpires": null
},
{
  "_id": {
    "$oid": "69d171d519953b7130bf1b50"
  },
  "name": "Fatema Begum",
  "email": "fatema.begum3@example.com",
  "password": "password123",
  "avatar": "",
  "role": "customer",
  "phone": "01710000003",
  "bio": "Love shopping for my family.",
  "addresses": [],
  "isEmailVerified": true,
  "emailVerificationToken": null,
  "passwordResetToken": null,
  "passwordResetExpires": null
},
{
  "_id": {
    "$oid": "69d171d519953b7130bf1b51"
  },
  "name": "Nurul Islam",
  "email": "nurul.islam4@example.com",
  "password": "password123",
  "avatar": "",
  "role": "customer",
  "phone": "01710000004",
  "bio": "Casual and comfortable is my style.",
  "addresses": [],
  "isEmailVerified": true,
  "emailVerificationToken": null,
  "passwordResetToken": null,
  "passwordResetExpires": null
},
{
  "_id": {
    "$oid": "69d171d519953b7130bf1b52"
  },
  "name": "Shahida Akter",
  "email": "shahida.akter5@example.com",
  "password": "password123",
  "avatar": "",
  "role": "customer",
  "phone": "01710000005",
  "bio": "Fashion blogger and influencer.",
  "addresses": [],
  "isEmailVerified": true,
  "emailVerificationToken": null,
  "passwordResetToken": null,
  "passwordResetExpires": null
},
{
  "_id": {
    "$oid": "69d171d519953b7130bf1b53"
  },
  "name": "Mizanur Rahman",
  "email": "mizanur.rahman6@example.com",
  "password": "password123",
  "avatar": "",
  "role": "customer",
  "phone": "01710000006",
  "bio": "Like to stay updated with latest trends.",
  "addresses": [],
  "isEmailVerified": true,
  "emailVerificationToken": null,
  "passwordResetToken": null,
  "passwordResetExpires": null
},
{
  "_id": {
    "$oid": "69d171d519953b7130bf1b54"
  },
  "name": "Nasrin Sultana",
  "email": "nasrin.sultana7@example.com",
  "password": "password123",
  "avatar": "",
  "role": "customer",
  "phone": "01710000007",
  "bio": "Shopping is my therapy.",
  "addresses": [],
  "isEmailVerified": true,
  "emailVerificationToken": null,
  "passwordResetToken": null,
  "passwordResetExpires": null
},
{
  "_id": {
    "$oid": "69d171d519953b7130bf1b55"
  },
  "name": "Jahangir Alam",
  "email": "jahangir.alam8@example.com",
  "password": "password123",
  "avatar": "",
  "role": "customer",
  "phone": "01710000008",
  "bio": "Looking for quality and style.",
  "addresses": [],
  "isEmailVerified": true,
  "emailVerificationToken": null,
  "passwordResetToken": null,
  "passwordResetExpires": null
},
{
  "_id": {
    "$oid": "69d171d519953b7130bf1b56"
  },
  "name": "Farida Khanam",
  "email": "farida.khanam9@example.com",
  "password": "password123",
  "avatar": "",
  "role": "customer",
  "phone": "01710000009",
  "bio": "Love to dress up for any occasion.",
  "addresses": [],
  "isEmailVerified": true,
  "emailVerificationToken": null,
  "passwordResetToken": null,
  "passwordResetExpires": null
},
{
  "_id": {
    "$oid": "69d171d519953b7130bf1b57"
  },
  "name": "Shamsul Haque",
  "email": "shamsul.haque10@example.com",
  "password": "password123",
  "avatar": "",
  "role": "customer",
  "phone": "01710000010",
  "bio": "Simple and elegant choices.",
  "addresses": [],
  "isEmailVerified": true,
  "emailVerificationToken": null,
  "passwordResetToken": null,
  "passwordResetExpires": null
},
{
  "_id": {
    "$oid": "69d171d519953b7130bf1b58"
  },
  "name": "Laila Akhter",
  "email": "laila.akhter11@example.com",
  "password": "password123",
  "avatar": "",
  "role": "customer",
  "phone": "01710000011",
  "bio": "Passionate about sustainable fashion.",
  "addresses": [],
  "isEmailVerified": true,
  "emailVerificationToken": null,
  "passwordResetToken": null,
  "passwordResetExpires": null
},
{
  "_id": {
    "$oid": "69d171d519953b7130bf1b59"
  },
  "name": "Kamal Hossain",
  "email": "kamal.hossain12@example.com",
  "password": "password123",
  "avatar": "",
  "role": "customer",
  "phone": "01710000012",
  "bio": "Buying gifts for loved ones.",
  "addresses": [],
  "isEmailVerified": true,
  "emailVerificationToken": null,
  "passwordResetToken": null,
  "passwordResetExpires": null
},
{
  "_id": {
    "$oid": "69d171d519953b7130bf1b5a"
  },
  "name": "Salma Khatun",
  "email": "salma.khatun13@example.com",
  "password": "password123",
  "avatar": "",
  "role": "customer",
  "phone": "01710000013",
  "bio": "Fashionista at heart.",
  "addresses": [],
  "isEmailVerified": true,
  "emailVerificationToken": null,
  "passwordResetToken": null,
  "passwordResetExpires": null
},
{
  "_id": {
    "$oid": "69d171d519953b7130bf1b5b"
  },
  "name": "Rafiqul Islam",
  "email": "rafiqul.islam14@example.com",
  "password": "password123",
  "avatar": "",
  "role": "customer",
  "phone": "01710000014",
  "bio": "Appreciates quality over quantity.",
  "addresses": [],
  "isEmailVerified": true,
  "emailVerificationToken": null,
  "passwordResetToken": null,
  "passwordResetExpires": null
},
{
  "_id": {
    "$oid": "69d171d519953b7130bf1b5c"
  },
  "name": "Tahmina Begum",
  "email": "tahmina.begum15@example.com",
  "password": "password123",
  "avatar": "",
  "role": "customer",
  "phone": "01710000015",
  "bio": "Loves to explore new styles.",
  "addresses": [],
  "isEmailVerified": true,
  "emailVerificationToken": null,
  "passwordResetToken": null,
  "passwordResetExpires": null
},
{
  "_id": {
    "$oid": "69d171d519953b7130bf1b5d"
  },
  "name": "Aminul Haque",
  "email": "aminul.haque16@example.com",
  "password": "password123",
  "avatar": "",
  "role": "customer",
  "phone": "01710000016",
  "bio": "Budget conscious shopper.",
  "addresses": [],
  "isEmailVerified": true,
  "emailVerificationToken": null,
  "passwordResetToken": null,
  "passwordResetExpires": null
},
{
  "_id": {
    "$oid": "69d171d519953b7130bf1b5e"
  },
  "name": "Rokeya Begum",
  "email": "rokeya.begum17@example.com",
  "password": "password123",
  "avatar": "",
  "role": "customer",
  "phone": "01710000017",
  "bio": "Mother of two, loves kids' fashion.",
  "addresses": [],
  "isEmailVerified": true,
  "emailVerificationToken": null,
  "passwordResetToken": null,
  "passwordResetExpires": null
},
{
  "_id": {
    "$oid": "69d171d519953b7130bf1b5f"
  },
  "name": "Mahbub Alam",
  "email": "mahbub.alam18@example.com",
  "password": "password123",
  "avatar": "",
  "role": "customer",
  "phone": "01710000018",
  "bio": "Sporty and active lifestyle.",
  "addresses": [],
  "isEmailVerified": true,
  "emailVerificationToken": null,
  "passwordResetToken": null,
  "passwordResetExpires": null
},
{
  "_id": {
    "$oid": "69d171d519953b7130bf1b60"
  },
  "name": "Sultana Razia",
  "email": "sultana.razia19@example.com",
  "password": "password123",
  "avatar": "",
  "role": "customer",
  "phone": "01710000019",
  "bio": "Elegant and sophisticated.",
  "addresses": [],
  "isEmailVerified": true,
  "emailVerificationToken": null,
  "passwordResetToken": null,
  "passwordResetExpires": null
},
{
  "_id": {
    "$oid": "69d171d519953b7130bf1b61"
  },
  "name": "Habibur Rahman",
  "email": "habibur.rahman20@example.com",
  "password": "password123",
  "avatar": "",
  "role": "customer",
  "phone": "01710000020",
  "bio": "Enjoys online shopping deals.",
  "addresses": [],
  "isEmailVerified": true,
  "emailVerificationToken": null,
  "passwordResetToken": null,
  "passwordResetExpires": null
},
{
  "_id": {
    "$oid": "69d171d519953b7130bf1b62"
  },
  "name": "Nargis Akter",
  "email": "nargis.akter21@example.com",
  "password": "password123",
  "avatar": "",
  "role": "customer",
  "phone": "01710000021",
  "bio": "Fashion is my passion.",
  "addresses": [],
  "isEmailVerified": true,
  "emailVerificationToken": null,
  "passwordResetToken": null,
  "passwordResetExpires": null
},
{
  "_id": {
    "$oid": "69d171d519953b7130bf1b63"
  },
  "name": "Zahid Hasan",
  "email": "zahid.hasan22@example.com",
  "password": "password123",
  "avatar": "",
  "role": "customer",
  "phone": "01710000022",
  "bio": "Looking for classic pieces.",
  "addresses": [],
  "isEmailVerified": true,
  "emailVerificationToken": null,
  "passwordResetToken": null,
  "passwordResetExpires": null
},
{
  "_id": {
    "$oid": "69d171d519953b7130bf1b64"
  },
  "name": "Jasmine Begum",
  "email": "jasmine.begum23@example.com",
  "password": "password123",
  "avatar": "",
  "role": "customer",
  "phone": "01710000023",
  "bio": "Always on trend.",
  "addresses": [],
  "isEmailVerified": true,
  "emailVerificationToken": null,
  "passwordResetToken": null,
  "passwordResetExpires": null
},
{
  "_id": {
    "$oid": "69d171d519953b7130bf1b65"
  },
  "name": "Shafiqul Islam",
  "email": "shafiqul.islam24@example.com",
  "password": "password123",
  "avatar": "",
  "role": "customer",
  "phone": "01710000024",
  "bio": "Shoes and accessories lover.",
  "addresses": [],
  "isEmailVerified": true,
  "emailVerificationToken": null,
  "passwordResetToken": null,
  "passwordResetExpires": null
},
{
  "_id": {
    "$oid": "69d171d519953b7130bf1b66"
  },
  "name": "Rina Begum",
  "email": "rina.begum25@example.com",
  "password": "password123",
  "avatar": "",
  "role": "customer",
  "phone": "01710000025",
  "bio": "Believes in comfortable style.",
  "addresses": [],
  "isEmailVerified": true,
  "emailVerificationToken": null,
  "passwordResetToken": null,
  "passwordResetExpires": null
},
{
  "_id": {
    "$oid": "69d171d519953b7130bf1b67"
  },
  "name": "Moshiur Rahman",
  "email": "moshiur.rahman26@example.com",
  "password": "password123",
  "avatar": "",
  "role": "customer",
  "phone": "01710000026",
  "bio": "Minimalist fashion enthusiast.",
  "addresses": [],
  "isEmailVerified": true,
  "emailVerificationToken": null,
  "passwordResetToken": null,
  "passwordResetExpires": null
},
{
  "_id": {
    "$oid": "69d171d519953b7130bf1b68"
  },
  "name": "Sharmin Sultana",
  "email": "sharmin.sultana27@example.com",
  "password": "password123",
  "avatar": "",
  "role": "customer",
  "phone": "01710000027",
  "bio": "Loves vibrant colors.",
  "addresses": [],
  "isEmailVerified": true,
  "emailVerificationToken": null,
  "passwordResetToken": null,
  "passwordResetExpires": null
},
{
  "_id": {
    "$oid": "69d171d519953b7130bf1b69"
  },
  "name": "Tariqul Islam",
  "email": "tariqul.islam28@example.com",
  "password": "password123",
  "avatar": "",
  "role": "customer",
  "phone": "01710000028",
  "bio": "Saving for the perfect outfit.",
  "addresses": [],
  "isEmailVerified": true,
  "emailVerificationToken": null,
  "passwordResetToken": null,
  "passwordResetExpires": null
},
{
  "_id": {
    "$oid": "69d171d519953b7130bf1b6a"
  },
  "name": "Jahanara Begum",
  "email": "jahanara.begum29@example.com",
  "password": "password123",
  "avatar": "",
  "role": "customer",
  "phone": "01710000029",
  "bio": "Traditional and modern fusion.",
  "addresses": [],
  "isEmailVerified": true,
  "emailVerificationToken": null,
  "passwordResetToken": null,
  "passwordResetExpires": null
},
{
  "_id": {
    "$oid": "69d171d519953b7130bf1b6b"
  },
  "name": "Anwar Hossain",
  "email": "anwar.hossain30@example.com",
  "password": "password123",
  "avatar": "",
  "role": "customer",
  "phone": "01710000030",
  "bio": "Prefers organic and ethical brands.",
  "addresses": [],
  "isEmailVerified": true,
  "emailVerificationToken": null,
  "passwordResetToken": null,
  "passwordResetExpires": null
},
{
  "_id": {
    "$oid": "69d171d519953b7130bf1b6c"
  },
  "name": "Nasima Akter",
  "email": "nasima.akter31@example.com",
  "password": "password123",
  "avatar": "",
  "role": "customer",
  "phone": "01710000031",
  "bio": "Shopaholic alert!",
  "addresses": [],
  "isEmailVerified": true,
  "emailVerificationToken": null,
  "passwordResetToken": null,
  "passwordResetExpires": null
},
{
  "_id": {
    "$oid": "69d171d519953b7130bf1b6d"
  },
  "name": "Shahjahan Miah",
  "email": "shahjahan.miah32@example.com",
  "password": "password123",
  "avatar": "",
  "role": "customer",
  "phone": "01710000032",
  "bio": "Collector of unique items.",
  "addresses": [],
  "isEmailVerified": true,
  "emailVerificationToken": null,
  "passwordResetToken": null,
  "passwordResetExpires": null
},
{
  "_id": {
    "$oid": "69d171d519953b7130bf1b6e"
  },
  "name": "Parvin Sultana",
  "email": "parvin.sultana33@example.com",
  "password": "password123",
  "avatar": "",
  "role": "customer",
  "phone": "01710000033",
  "bio": "Loves seasonal collections.",
  "addresses": [],
  "isEmailVerified": true,
  "emailVerificationToken": null,
  "passwordResetToken": null,
  "passwordResetExpires": null
},
{
  "_id": {
    "$oid": "69d171d519953b7130bf1b6f"
  },
  "name": "Fazlur Rahman",
  "email": "fazlur.rahman34@example.com",
  "password": "password123",
  "avatar": "",
  "role": "customer",
  "phone": "01710000034",
  "bio": "Practical and stylish.",
  "addresses": [],
  "isEmailVerified": true,
  "emailVerificationToken": null,
  "passwordResetToken": null,
  "passwordResetExpires": null
},
{
  "_id": {
    "$oid": "69d171d519953b7130bf1b70"
  },
  "name": "Maksuda Begum",
  "email": "maksuda.begum35@example.com",
  "password": "password123",
  "avatar": "",
  "role": "customer",
  "phone": "01710000035",
  "bio": "Fashion forward.",
  "addresses": [],
  "isEmailVerified": true,
  "emailVerificationToken": null,
  "passwordResetToken": null,
  "passwordResetExpires": null
},
{
  "_id": {
    "$oid": "69d171d519953b7130bf1b71"
  },
  "name": "Hafizur Rahman",
  "email": "hafizur.rahman36@example.com",
  "password": "password123",
  "avatar": "",
  "role": "customer",
  "phone": "01710000036",
  "bio": "Likes to mix and match.",
  "addresses": [],
  "isEmailVerified": true,
  "emailVerificationToken": null,
  "passwordResetToken": null,
  "passwordResetExpires": null
},
{
  "_id": {
    "$oid": "69d171d519953b7130bf1b72"
  },
  "name": "Sabina Yeasmin",
  "email": "sabina.yeasmin37@example.com",
  "password": "password123",
  "avatar": "",
  "role": "customer",
  "phone": "01710000037",
  "bio": "Adventurous in style.",
  "addresses": [],
  "isEmailVerified": true,
  "emailVerificationToken": null,
  "passwordResetToken": null,
  "passwordResetExpires": null
},
{
  "_id": {
    "$oid": "69d171d519953b7130bf1b73"
  },
  "name": "Ruhul Amin",
  "email": "ruhul.amin38@example.com",
  "password": "password123",
  "avatar": "",
  "role": "customer",
  "phone": "01710000038",
  "bio": "Quality over price.",
  "addresses": [],
  "isEmailVerified": true,
  "emailVerificationToken": null,
  "passwordResetToken": null,
  "passwordResetExpires": null
},
{
  "_id": {
    "$oid": "69d171d519953b7130bf1b74"
  },
  "name": "Taslima Akter",
  "email": "taslima.akter39@example.com",
  "password": "password123",
  "avatar": "",
  "role": "customer",
  "phone": "01710000039",
  "bio": "Always looking for best deals.",
  "addresses": [],
  "isEmailVerified": true,
  "emailVerificationToken": null,
  "passwordResetToken": null,
  "passwordResetExpires": null
},
{
  "_id": {
    "$oid": "69d171d519953b7130bf1b75"
  },
  "name": "Shahadat Hossain",
  "email": "shahadat.hossain40@example.com",
  "password": "password123",
  "avatar": "",
  "role": "customer",
  "phone": "01710000040",
  "bio": "Street style enthusiast.",
  "addresses": [],
  "isEmailVerified": true,
  "emailVerificationToken": null,
  "passwordResetToken": null,
  "passwordResetExpires": null
},
{
  "_id": {
    "$oid": "69d171d519953b7130bf1b76"
  },
  "name": "Nasrin Jahan",
  "email": "nasrin.jahan41@example.com",
  "password": "password123",
  "avatar": "",
  "role": "customer",
  "phone": "01710000041",
  "bio": "Eco-conscious shopper.",
  "addresses": [],
  "isEmailVerified": true,
  "emailVerificationToken": null,
  "passwordResetToken": null,
  "passwordResetExpires": null
},
{
  "_id": {
    "$oid": "69d171d519953b7130bf1b77"
  },
  "name": "Alamgir Hossain",
  "email": "alamgir.hossain42@example.com",
  "password": "password123",
  "avatar": "",
  "role": "customer",
  "phone": "01710000042",
  "bio": "Prefers premium fabrics.",
  "addresses": [],
  "isEmailVerified": true,
  "emailVerificationToken": null,
  "passwordResetToken": null,
  "passwordResetExpires": null
},
{
  "_id": {
    "$oid": "69d171d519953b7130bf1b78"
  },
  "name": "Sonia Akter",
  "email": "sonia.akter43@example.com",
  "password": "password123",
  "avatar": "",
  "role": "customer",
  "phone": "01710000043",
  "bio": "Loves to accessorize.",
  "addresses": [],
  "isEmailVerified": true,
  "emailVerificationToken": null,
  "passwordResetToken": null,
  "passwordResetExpires": null
},
{
  "_id": {
    "$oid": "69d171d519953b7130bf1b79"
  },
  "name": "Khaled Hasan",
  "email": "khaled.hasan44@example.com",
  "password": "password123",
  "avatar": "",
  "role": "customer",
  "phone": "01710000044",
  "bio": "Trendy and affordable.",
  "addresses": [],
  "isEmailVerified": true,
  "emailVerificationToken": null,
  "passwordResetToken": null,
  "passwordResetExpires": null
},
{
  "_id": {
    "$oid": "69d171d519953b7130bf1b7a"
  },
  "name": "Farzana Akhter",
  "email": "farzana.akhter45@example.com",
  "password": "password123",
  "avatar": "",
  "role": "customer",
  "phone": "01710000045",
  "bio": "Shop for all seasons.",
  "addresses": [],
  "isEmailVerified": true,
  "emailVerificationToken": null,
  "passwordResetToken": null,
  "passwordResetExpires": null
},
{
  "_id": {
    "$oid": "69d171d519953b7130bf1b7b"
  },
  "name": "Saiful Islam",
  "email": "saiful.islam46@example.com",
  "password": "password123",
  "avatar": "",
  "role": "customer",
  "phone": "01710000046",
  "bio": "Fitness and style go together.",
  "addresses": [],
  "isEmailVerified": true,
  "emailVerificationToken": null,
  "passwordResetToken": null,
  "passwordResetExpires": null
},
{
  "_id": {
    "$oid": "69d171d519953b7130bf1b7c"
  },
  "name": "Shamima Sultana",
  "email": "shamima.sultana47@example.com",
  "password": "password123",
  "avatar": "",
  "role": "customer",
  "phone": "01710000047",
  "bio": "Classic elegance.",
  "addresses": [],
  "isEmailVerified": true,
  "emailVerificationToken": null,
  "passwordResetToken": null,
  "passwordResetExpires": null
},
{
  "_id": {
    "$oid": "69d171d519953b7130bf1b7d"
  },
  "name": "Mofizur Rahman",
  "email": "mofizur.rahman48@example.com",
  "password": "password123",
  "avatar": "",
  "role": "customer",
  "phone": "01710000048",
  "bio": "Likes to stay cozy.",
  "addresses": [],
  "isEmailVerified": true,
  "emailVerificationToken": null,
  "passwordResetToken": null,
  "passwordResetExpires": null
},
{
  "_id": {
    "$oid": "69d171d519953b7130bf1b7e"
  },
  "name": "Razia Sultana",
  "email": "razia.sultana49@example.com",
  "password": "password123",
  "avatar": "",
  "role": "customer",
  "phone": "01710000049",
  "bio": "Impulse buyer!",
  "addresses": [],
  "isEmailVerified": true,
  "emailVerificationToken": null,
  "passwordResetToken": null,
  "passwordResetExpires": null
},
{
  "_id": {
    "$oid": "69d171d519953b7130bf1b7f"
  },
  "name": "Abul Kalam",
  "email": "abul.kalam50@example.com",
  "password": "password123",
  "avatar": "",
  "role": "customer",
  "phone": "01710000050",
  "bio": "Brand conscious.",
  "addresses": [],
  "isEmailVerified": true,
  "emailVerificationToken": null,
  "passwordResetToken": null,
  "passwordResetExpires": null
},
{
  "_id": {
    "$oid": "69d171d519953b7130bf1b80"
  },
  "name": "Mumtaz Begum",
  "email": "mumtaz.begum51@example.com",
  "password": "password123",
  "avatar": "",
  "role": "customer",
  "phone": "01710000051",
  "bio": "Loves handmade items.",
  "addresses": [],
  "isEmailVerified": true,
  "emailVerificationToken": null,
  "passwordResetToken": null,
  "passwordResetExpires": null
},
{
  "_id": {
    "$oid": "69d171d519953b7130bf1b81"
  },
  "name": "Shahinur Rahman",
  "email": "shahinur.rahman52@example.com",
  "password": "password123",
  "avatar": "",
  "role": "customer",
  "phone": "01710000052",
  "bio": "Sneakerhead.",
  "addresses": [],
  "isEmailVerified": true,
  "emailVerificationToken": null,
  "passwordResetToken": null,
  "passwordResetExpires": null
},
{
  "_id": {
    "$oid": "69d171d519953b7130bf1b82"
  },
  "name": "Shahana Akter",
  "email": "shahana.akter53@example.com",
  "password": "password123",
  "avatar": "",
  "role": "customer",
  "phone": "01710000053",
  "bio": "Loves bright and bold.",
  "addresses": [],
  "isEmailVerified": true,
  "emailVerificationToken": null,
  "passwordResetToken": null,
  "passwordResetExpires": null
},
{
  "_id": {
    "$oid": "69d171d519953b7130bf1b83"
  },
  "name": "Nazrul Islam",
  "email": "nazrul.islam54@example.com",
  "password": "password123",
  "avatar": "",
  "role": "customer",
  "phone": "01710000054",
  "bio": "Minimalist.",
  "addresses": [],
  "isEmailVerified": true,
  "emailVerificationToken": null,
  "passwordResetToken": null,
  "passwordResetExpires": null
},
{
  "_id": {
    "$oid": "69d171d519953b7130bf1b84"
  },
  "name": "Sultana Jahan",
  "email": "sultana.jahan55@example.com",
  "password": "password123",
  "avatar": "",
  "role": "customer",
  "phone": "01710000055",
  "bio": "Loves to gift fashion.",
  "addresses": [],
  "isEmailVerified": true,
  "emailVerificationToken": null,
  "passwordResetToken": null,
  "passwordResetExpires": null
},
{
  "_id": {
    "$oid": "69d171d519953b7130bf1b85"
  },
  "name": "Mukul Hossain",
  "email": "mukul.hossain56@example.com",
  "password": "password123",
  "avatar": "",
  "role": "customer",
  "phone": "01710000056",
  "bio": "Tech and fashion blend.",
  "addresses": [],
  "isEmailVerified": true,
  "emailVerificationToken": null,
  "passwordResetToken": null,
  "passwordResetExpires": null
},
{
  "_id": {
    "$oid": "69d171d519953b7130bf1b86"
  },
  "name": "Tania Akter",
  "email": "tania.akter57@example.com",
  "password": "password123",
  "avatar": "",
  "role": "customer",
  "phone": "01710000057",
  "bio": "Fashion student.",
  "addresses": [],
  "isEmailVerified": true,
  "emailVerificationToken": null,
  "passwordResetToken": null,
  "passwordResetExpires": null
},
{
  "_id": {
    "$oid": "69d171d519953b7130bf1b87"
  },
  "name": "Ratan Mia",
  "email": "ratan.mia58@example.com",
  "password": "password123",
  "avatar": "",
  "role": "customer",
  "phone": "01710000058",
  "bio": "Likes to keep it simple.",
  "addresses": [],
  "isEmailVerified": true,
  "emailVerificationToken": null,
  "passwordResetToken": null,
  "passwordResetExpires": null
},
{
  "_id": {
    "$oid": "69d171d519953b7130bf1b88"
  },
  "name": "Dilruba Begum",
  "email": "dilruba.begum59@example.com",
  "password": "password123",
  "avatar": "",
  "role": "customer",
  "phone": "01710000059",
  "bio": "Traditional wear lover.",
  "addresses": [],
  "isEmailVerified": true,
  "emailVerificationToken": null,
  "passwordResetToken": null,
  "passwordResetExpires": null
},
{
  "_id": {
    "$oid": "69d171d519953b7130bf1b89"
  },
  "name": "Kamrun Nahar",
  "email": "kamrun.nahar60@example.com",
  "password": "password123",
  "avatar": "",
  "role": "customer",
  "phone": "01710000060",
  "bio": "Collects unique jewelry.",
  "addresses": [],
  "isEmailVerified": true,
  "emailVerificationToken": null,
  "passwordResetToken": null,
  "passwordResetExpires": null
},
{
  "_id": {
    "$oid": "69d171d519953b7130bf1b8a"
  },
  "name": "Habibul Islam",
  "email": "habibul.islam61@example.com",
  "password": "password123",
  "avatar": "",
  "role": "customer",
  "phone": "01710000061",
  "bio": "Outdoor and sporty.",
  "addresses": [],
  "isEmailVerified": true,
  "emailVerificationToken": null,
  "passwordResetToken": null,
  "passwordResetExpires": null
},
{
  "_id": {
    "$oid": "69d171d519953b7130bf1b8b"
  },
  "name": "Hasina Begum",
  "email": "hasina.begum62@example.com",
  "password": "password123",
  "avatar": "",
  "role": "customer",
  "phone": "01710000062",
  "bio": "Loves ethnic wear.",
  "addresses": [],
  "isEmailVerified": true,
  "emailVerificationToken": null,
  "passwordResetToken": null,
  "passwordResetExpires": null
},
{
  "_id": {
    "$oid": "69d171d519953b7130bf1b8c"
  },
  "name": "Ferdous Ahmed",
  "email": "ferdous.ahmed63@example.com",
  "password": "password123",
  "avatar": "",
  "role": "customer",
  "phone": "01710000063",
  "bio": "Prefers comfortable fabrics.",
  "addresses": [],
  "isEmailVerified": true,
  "emailVerificationToken": null,
  "passwordResetToken": null,
  "passwordResetExpires": null
},
{
  "_id": {
    "$oid": "69d171d519953b7130bf1b8d"
  },
  "name": "Rasheda Akter",
  "email": "rasheda.akter64@example.com",
  "password": "password123",
  "avatar": "",
  "role": "customer",
  "phone": "01710000064",
  "bio": "Fashion for all occasions.",
  "addresses": [],
  "isEmailVerified": true,
  "emailVerificationToken": null,
  "passwordResetToken": null,
  "passwordResetExpires": null
},
{
  "_id": {
    "$oid": "69d171d519953b7130bf1b8e"
  },
  "name": "Mahfuzur Rahman",
  "email": "mahfuzur.rahman65@example.com",
  "password": "password123",
  "avatar": "",
  "role": "customer",
  "phone": "01710000065",
  "bio": "Budget savvy shopper.",
  "addresses": [],
  "isEmailVerified": true,
  "emailVerificationToken": null,
  "passwordResetToken": null,
  "passwordResetExpires": null
},
{
  "_id": {
    "$oid": "69d171d519953b7130bf1b8f"
  },
  "name": "Jesmin Akter",
  "email": "jesmin.akter66@example.com",
  "password": "password123",
  "avatar": "",
  "role": "customer",
  "phone": "01710000066",
  "bio": "Loves to follow trends.",
  "addresses": [],
  "isEmailVerified": true,
  "emailVerificationToken": null,
  "passwordResetToken": null,
  "passwordResetExpires": null
},
{
  "_id": {
    "$oid": "69d171d519953b7130bf1b90"
  },
  "name": "Sabbir Hossain",
  "email": "sabbir.hossain67@example.com",
  "password": "password123",
  "avatar": "",
  "role": "customer",
  "phone": "01710000067",
  "bio": "Sneakers and streetwear.",
  "addresses": [],
  "isEmailVerified": true,
  "emailVerificationToken": null,
  "passwordResetToken": null,
  "passwordResetExpires": null
},
{
  "_id": {
    "$oid": "69d171d519953b7130bf1b91"
  },
  "name": "Nasreen Sultana",
  "email": "nasreen.sultana68@example.com",
  "password": "password123",
  "avatar": "",
  "role": "customer",
  "phone": "01710000068",
  "bio": "Elegant and sophisticated.",
  "addresses": [],
  "isEmailVerified": true,
  "emailVerificationToken": null,
  "passwordResetToken": null,
  "passwordResetExpires": null
},
{
  "_id": {
    "$oid": "69d171d519953b7130bf1b92"
  },
  "name": "Sirajul Islam",
  "email": "sirajul.islam69@example.com",
  "password": "password123",
  "avatar": "",
  "role": "customer",
  "phone": "01710000069",
  "bio": "Classic style.",
  "addresses": [],
  "isEmailVerified": true,
  "emailVerificationToken": null,
  "passwordResetToken": null,
  "passwordResetExpires": null
},
{
  "_id": {
    "$oid": "69d171d519953b7130bf1b93"
  },
  "name": "Mafruha Akter",
  "email": "mafruha.akter70@example.com",
  "password": "password123",
  "avatar": "",
  "role": "customer",
  "phone": "01710000070",
  "bio": "Fashion enthusiast.",
  "addresses": [],
  "isEmailVerified": true,
  "emailVerificationToken": null,
  "passwordResetToken": null,
  "passwordResetExpires": null
},
{
  "_id": {
    "$oid": "69d171d519953b7130bf1b94"
  },
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "admin123",
  "avatar": "",
  "role": "admin",
  "phone": "01710000999",
  "bio": "Super admin of the store.",
  "addresses": [],
  "isEmailVerified": true,
  "emailVerificationToken": null,
  "passwordResetToken": null,
  "passwordResetExpires": null
},
{
  "_id": {
    "$oid": "69d171d519953b7130bf1b95"
  },
  "name": "Staff One",
  "email": "staff1@example.com",
  "password": "staff123",
  "avatar": "",
  "role": "admin",
  "phone": "01710000998",
  "bio": "Store manager.",
  "addresses": [],
  "isEmailVerified": true,
  "emailVerificationToken": null,
  "passwordResetToken": null,
  "passwordResetExpires": null
},
{
  "_id": {
    "$oid": "69d171d519953b7130bf1b96"
  },
  "name": "Staff Two",
  "email": "staff2@example.com",
  "password": "staff123",
  "avatar": "",
  "role": "admin",
  "phone": "01710000997",
  "bio": "Customer support lead.",
  "addresses": [],
  "isEmailVerified": true,
  "emailVerificationToken": null,
  "passwordResetToken": null,
  "passwordResetExpires": null
}]

// Provided Products from your context
const products = [{
  "_id": {
    "$oid": "69c797f6dd74230ef1720c9d"
  },
  "name": "Men's Oversized T-Shirt 5",
  "slug": "mens-oversized-t-shirt-5",
  "description": "Trendy oversized fit for a relaxed style.",
  "price": 890,
  "discount": 5,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775164/ecowear/products/mens-oversized-t-shirt-5_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775164/ecowear/products/mens-oversized-t-shirt-5_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775164/ecowear/products/mens-oversized-t-shirt-5_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775164/ecowear/products/mens-oversized-t-shirt-5_4.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa565"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 30
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 40
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 50
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 45
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 25
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 12
    }
  ],
  "tags": [
    "t-shirt",
    "oversized",
    "men",
    "casual"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c797f6dd74230ef1720ca1"
  },
  "name": "Men's Long Sleeve T-Shirt 9",
  "slug": "mens-long-sleeve-t-shirt-9",
  "description": "Long sleeve for cooler weather.",
  "price": 890,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774774799/ecowear/products/mens-long-sleeve-t-shirt-9_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774774799/ecowear/products/mens-long-sleeve-t-shirt-9_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774774799/ecowear/products/mens-long-sleeve-t-shirt-9_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774774799/ecowear/products/mens-long-sleeve-t-shirt-9_1.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa565"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 28
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 38
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 48
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 42
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 24
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 12
    }
  ],
  "tags": [
    "t-shirt",
    "long-sleeve",
    "men",
    "basic"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c797f6dd74230ef1720ca3"
  },
  "name": "Men's Slim Fit Jeans 1",
  "slug": "mens-slim-fit-jeans-1",
  "description": "Classic slim fit denim jeans.",
  "price": 1890,
  "discount": 10,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775212/ecowear/products/mens-slim-fit-jeans-1_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775212/ecowear/products/mens-slim-fit-jeans-1_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775212/ecowear/products/mens-slim-fit-jeans-1_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775212/ecowear/products/mens-slim-fit-jeans-1_3.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa566"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 18
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 30
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 40
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 35
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 20
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 10
    }
  ],
  "tags": [
    "jeans",
    "slim-fit",
    "denim",
    "men"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0,
  "updatedAt": {
    "$date": "2026-04-04T16:27:09.926Z"
  }
},
{
  "_id": {
    "$oid": "69c797f6dd74230ef1720cb4"
  },
  "name": "Women's Silk Camisole 8",
  "slug": "womens-silk-camisole-8",
  "description": "Luxurious silk camisole for layering.",
  "price": 1790,
  "discount": 10,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775345/ecowear/products/womens-silk-camisole-8_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775345/ecowear/products/womens-silk-camisole-8_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775345/ecowear/products/womens-silk-camisole-8_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775345/ecowear/products/womens-silk-camisole-8_3.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55d"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa569"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c74"
      },
      "stock": 20
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c75"
      },
      "stock": 30
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c76"
      },
      "stock": 40
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c77"
      },
      "stock": 35
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c78"
      },
      "stock": 20
    }
  ],
  "tags": [
    "camisole",
    "silk",
    "women",
    "lingerie"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c797f6dd74230ef1720ccb"
  },
  "name": "Baby Hooded Towel 3",
  "slug": "baby-hooded-towel-3",
  "description": "Soft hooded towel for bath time.",
  "price": 790,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773060/ecowear/products/baby-hooded-towel-3_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773060/ecowear/products/baby-hooded-towel-3_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773060/ecowear/products/baby-hooded-towel-3_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773060/ecowear/products/baby-hooded-towel-3_4.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55e"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa56e"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c79"
      },
      "stock": 40
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7a"
      },
      "stock": 45
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7b"
      },
      "stock": 50
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7c"
      },
      "stock": 45
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7d"
      },
      "stock": 35
    }
  ],
  "tags": [
    "baby",
    "towel",
    "hooded"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c797f6dd74230ef1720cd7"
  },
  "name": "Women's Fashion Sneakers 2",
  "slug": "womens-fashion-sneakers-2",
  "description": "Stylish sneakers for everyday wear.",
  "price": 2190,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775291/ecowear/products/womens-fashion-sneakers-2_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775291/ecowear/products/womens-fashion-sneakers-2_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775292/ecowear/products/womens-fashion-sneakers-2_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775292/ecowear/products/womens-fashion-sneakers-2_1.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa560"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa573"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7f"
      },
      "stock": 18
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c80"
      },
      "stock": 22
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c81"
      },
      "stock": 28
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c82"
      },
      "stock": 28
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c83"
      },
      "stock": 22
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c84"
      },
      "stock": 18
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c85"
      },
      "stock": 12
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c86"
      },
      "stock": 8
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c87"
      },
      "stock": 5
    }
  ],
  "tags": [
    "sneakers",
    "fashion",
    "women"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c797f6dd74230ef1720ca9"
  },
  "name": "Men's Wool Blend Overcoat 7",
  "slug": "mens-wool-blend-overcoat-7",
  "description": "Elegant overcoat for winter.",
  "price": 4490,
  "discount": 20,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775245/ecowear/products/mens-wool-blend-overcoat-7_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775245/ecowear/products/mens-wool-blend-overcoat-7_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775245/ecowear/products/mens-wool-blend-overcoat-7_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775245/ecowear/products/mens-wool-blend-overcoat-7_1.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa567"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 8
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 18
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 25
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 22
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 12
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 5
    }
  ],
  "tags": [
    "overcoat",
    "wool",
    "winter",
    "men"
  ],
  "isActive": true,
  "isFeatured": true,
  "featuredOrder": 7,
  "updatedAt": {
    "$date": "2026-04-01T18:56:25.157Z"
  }
},
{
  "_id": {
    "$oid": "69c797f6dd74230ef1720cc5"
  },
  "name": "Girls' Floral Dress 1",
  "slug": "girls-floral-dress-1",
  "description": "Beautiful floral print dress for girls.",
  "price": 890,
  "discount": 10,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773113/ecowear/products/girls-floral-dress-1_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773113/ecowear/products/girls-floral-dress-1_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773113/ecowear/products/girls-floral-dress-1_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773113/ecowear/products/girls-floral-dress-1_4.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55e"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa56d"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c79"
      },
      "stock": 28
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7a"
      },
      "stock": 33
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7b"
      },
      "stock": 38
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7c"
      },
      "stock": 33
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7d"
      },
      "stock": 23
    }
  ],
  "tags": [
    "dress",
    "floral",
    "girls"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c797f6dd74230ef1720cc7"
  },
  "name": "Girls' Tutu Skirt 3",
  "slug": "girls-tutu-skirt-3",
  "description": "Fun and fluffy tutu skirt.",
  "price": 690,
  "discount": 5,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773120/ecowear/products/girls-tutu-skirt-3_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773120/ecowear/products/girls-tutu-skirt-3_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773121/ecowear/products/girls-tutu-skirt-3_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773120/ecowear/products/girls-tutu-skirt-3_1.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55e"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa56d"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c79"
      },
      "stock": 40
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7a"
      },
      "stock": 45
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7b"
      },
      "stock": 50
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7c"
      },
      "stock": 45
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7d"
      },
      "stock": 35
    }
  ],
  "tags": [
    "skirt",
    "tutu",
    "girls"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c797f6dd74230ef1720ccc"
  },
  "name": "Baby Bodysuit Pack 4",
  "slug": "baby-bodysuit-pack-4",
  "description": "Pack of 3 organic cotton bodysuits.",
  "price": 990,
  "discount": 10,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774772975/ecowear/products/baby-bodysuit-pack-4_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774772975/ecowear/products/baby-bodysuit-pack-4_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774772975/ecowear/products/baby-bodysuit-pack-4_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774772975/ecowear/products/baby-bodysuit-pack-4_4.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55e"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa56e"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c79"
      },
      "stock": 35
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7a"
      },
      "stock": 40
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7b"
      },
      "stock": 45
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7c"
      },
      "stock": 40
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7d"
      },
      "stock": 30
    }
  ],
  "tags": [
    "baby",
    "bodysuit",
    "pack"
  ],
  "isActive": true,
  "isFeatured": true,
  "featuredOrder": 15
},
{
  "_id": {
    "$oid": "69c797f6dd74230ef1720cb0"
  },
  "name": "Women's Casual T-Shirt Dress 4",
  "slug": "womens-casual-t-shirt-dress-4",
  "description": "Comfortable t-shirt dress for everyday.",
  "price": 1490,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775264/ecowear/products/womens-casual-t-shirt-dress-4_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775264/ecowear/products/womens-casual-t-shirt-dress-4_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775264/ecowear/products/womens-casual-t-shirt-dress-4_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775264/ecowear/products/womens-casual-t-shirt-dress-4_1.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55d"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa568"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c74"
      },
      "stock": 25
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c75"
      },
      "stock": 35
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c76"
      },
      "stock": 45
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c77"
      },
      "stock": 40
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c78"
      },
      "stock": 25
    }
  ],
  "tags": [
    "dress",
    "t-shirt",
    "casual",
    "women"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0,
  "averageRating": 5,
  "totalReviews": 1,
  "updatedAt": {
    "$date": "2026-04-04T13:12:39.739Z"
  },
  "views": 0
},
{
  "_id": {
    "$oid": "69c797f6dd74230ef1720cb1"
  },
  "name": "Women's Evening Gown 5",
  "slug": "womens-evening-gown-5",
  "description": "Stunning evening gown for special events.",
  "price": 4990,
  "discount": 20,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775287/ecowear/products/womens-evening-gown-5_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775287/ecowear/products/womens-evening-gown-5_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775287/ecowear/products/womens-evening-gown-5_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775287/ecowear/products/womens-evening-gown-5_3.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55d"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa568"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c74"
      },
      "stock": 8
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c75"
      },
      "stock": 11
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c76"
      },
      "stock": 16
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c77"
      },
      "stock": 15
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c78"
      },
      "stock": 8
    }
  ],
  "tags": [
    "gown",
    "evening",
    "formal",
    "women"
  ],
  "isActive": true,
  "isFeatured": true,
  "featuredOrder": 9,
  "updatedAt": {
    "$date": "2026-04-04T16:27:09.926Z"
  }
},
{
  "_id": {
    "$oid": "69c797f6dd74230ef1720cd0"
  },
  "name": "Leather Belt 4",
  "slug": "leather-belt-4",
  "description": "Genuine leather belt with metal buckle.",
  "price": 890,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773128/ecowear/products/leather-belt-4_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773128/ecowear/products/leather-belt-4_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773128/ecowear/products/leather-belt-4_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773128/ecowear/products/leather-belt-4_3.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55f"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa570"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7e"
      },
      "stock": 50
    }
  ],
  "tags": [
    "belt",
    "leather",
    "accessory"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c797f6dd74230ef1720cdc"
  },
  "name": "Men's Hiking Boots 7",
  "slug": "mens-hiking-boots-7",
  "description": "Durable waterproof hiking boots.",
  "price": 3990,
  "discount": 15,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775146/ecowear/products/mens-hiking-boots-7_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775146/ecowear/products/mens-hiking-boots-7_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775146/ecowear/products/mens-hiking-boots-7_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775147/ecowear/products/mens-hiking-boots-7_1.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa560"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa576"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7f"
      },
      "stock": 4
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c80"
      },
      "stock": 14
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c81"
      },
      "stock": 16
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c82"
      },
      "stock": 18
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c83"
      },
      "stock": 14
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c84"
      },
      "stock": 10
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c85"
      },
      "stock": 8
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c86"
      },
      "stock": 6
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c87"
      },
      "stock": 3
    }
  ],
  "tags": [
    "boots",
    "hiking",
    "outdoor",
    "men"
  ],
  "isActive": true,
  "isFeatured": true,
  "featuredOrder": 18,
  "updatedAt": {
    "$date": "2026-04-04T13:31:56.242Z"
  }
},
{
  "_id": {
    "$oid": "69c797f6dd74230ef1720c95"
  },
  "name": "Men's Checkered Casual Shirt 7",
  "slug": "mens-checkered-casual-shirt-7",
  "description": "Checkered pattern for a relaxed weekend look.",
  "price": 1390,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773155/ecowear/products/mens-checkered-casual-shirt-7_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773155/ecowear/products/mens-checkered-casual-shirt-7_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773155/ecowear/products/mens-checkered-casual-shirt-7_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773155/ecowear/products/mens-checkered-casual-shirt-7_2.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa564"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 16
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 28
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 35
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 30
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 18
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 8
    }
  ],
  "tags": [
    "shirt",
    "checkered",
    "men",
    "casual"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0,
  "updatedAt": {
    "$date": "2026-04-04T13:52:55.458Z"
  }
},
{
  "_id": {
    "$oid": "69c797f6dd74230ef1720c96"
  },
  "name": "Men's Flannel Winter Shirt 8",
  "slug": "mens-flannel-winter-shirt-8",
  "description": "Warm flannel shirt for chilly days.",
  "price": 1790,
  "discount": 10,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773180/ecowear/products/mens-flannel-winter-shirt-8_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773179/ecowear/products/mens-flannel-winter-shirt-8_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773179/ecowear/products/mens-flannel-winter-shirt-8_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773180/ecowear/products/mens-flannel-winter-shirt-8_2.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa564"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 15
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 22
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 30
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 25
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 12
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 5
    }
  ],
  "tags": [
    "shirt",
    "flannel",
    "winter",
    "men"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c797f6dd74230ef1720cbc"
  },
  "name": "Women's Wide Leg Pants 16",
  "slug": "womens-wide-leg-pants-16",
  "description": "Flowy wide leg pants in crepe.",
  "price": 1890,
  "discount": 10,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775366/ecowear/products/womens-wide-leg-pants-16_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775366/ecowear/products/womens-wide-leg-pants-16_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775366/ecowear/products/womens-wide-leg-pants-16_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775366/ecowear/products/womens-wide-leg-pants-16_4.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55d"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa56b"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c74"
      },
      "stock": 23
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c75"
      },
      "stock": 35
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c76"
      },
      "stock": 45
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c77"
      },
      "stock": 40
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c78"
      },
      "stock": 25
    }
  ],
  "tags": [
    "pants",
    "wide-leg",
    "women",
    "casual"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0,
  "updatedAt": {
    "$date": "2026-04-04T13:31:56.242Z"
  }
},
{
  "_id": {
    "$oid": "69c797f6dd74230ef1720cc8"
  },
  "name": "Girls' Leggings 4",
  "slug": "girls-leggings-4",
  "description": "Soft stretch leggings for everyday.",
  "price": 490,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773117/ecowear/products/girls-leggings-4_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773117/ecowear/products/girls-leggings-4_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773117/ecowear/products/girls-leggings-4_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773117/ecowear/products/girls-leggings-4_3.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55e"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa56d"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c79"
      },
      "stock": 48
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7a"
      },
      "stock": 55
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7b"
      },
      "stock": 60
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7c"
      },
      "stock": 55
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7d"
      },
      "stock": 45
    }
  ],
  "tags": [
    "leggings",
    "girls",
    "basics"
  ],
  "isActive": true,
  "isFeatured": true,
  "featuredOrder": 14,
  "updatedAt": {
    "$date": "2026-03-31T09:58:55.886Z"
  }
},
{
  "_id": {
    "$oid": "69c797f6dd74230ef1720cd8"
  },
  "name": "Men's Oxford Shoes 3",
  "slug": "mens-oxford-shoes-3",
  "description": "Classic leather oxford shoes for formal wear.",
  "price": 3290,
  "discount": 10,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775175/ecowear/products/mens-oxford-shoes-3_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775175/ecowear/products/mens-oxford-shoes-3_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775175/ecowear/products/mens-oxford-shoes-3_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775175/ecowear/products/mens-oxford-shoes-3_1.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa560"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa574"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7f"
      },
      "stock": 12
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c80"
      },
      "stock": 16
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c81"
      },
      "stock": 20
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c82"
      },
      "stock": 20
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c83"
      },
      "stock": 16
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c84"
      },
      "stock": 12
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c85"
      },
      "stock": 8
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c86"
      },
      "stock": 6
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c87"
      },
      "stock": 3
    }
  ],
  "tags": [
    "shoes",
    "oxford",
    "formal",
    "men"
  ],
  "isActive": true,
  "isFeatured": true,
  "featuredOrder": 17,
  "updatedAt": {
    "$date": "2026-03-31T13:23:13.218Z"
  }
},
{
  "_id": {
    "$oid": "69c797f6dd74230ef1720cdd"
  },
  "name": "Women's Ankle Boots 8",
  "slug": "womens-ankle-boots-8",
  "description": "Trendy ankle boots with block heel.",
  "price": 2790,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775260/ecowear/products/womens-ankle-boots-8_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775260/ecowear/products/womens-ankle-boots-8_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775260/ecowear/products/womens-ankle-boots-8_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775260/ecowear/products/womens-ankle-boots-8_4.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa560"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa576"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7f"
      },
      "stock": 15
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c80"
      },
      "stock": 20
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c81"
      },
      "stock": 25
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c82"
      },
      "stock": 25
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c83"
      },
      "stock": 20
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c84"
      },
      "stock": 15
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c85"
      },
      "stock": 10
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c86"
      },
      "stock": 8
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c87"
      },
      "stock": 5
    }
  ],
  "tags": [
    "boots",
    "ankle",
    "women",
    "casual"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c797f6dd74230ef1720ce0"
  },
  "name": "Men's Training Shorts 3",
  "slug": "mens-training-shorts-3",
  "description": "Lightweight shorts with built-in liner.",
  "price": 1190,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775231/ecowear/products/mens-training-shorts-3_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775231/ecowear/products/mens-training-shorts-3_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775231/ecowear/products/mens-training-shorts-3_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775231/ecowear/products/mens-training-shorts-3_4.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa561"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa578"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c88"
      },
      "stock": 30
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c89"
      },
      "stock": 35
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c8a"
      },
      "stock": 40
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c8b"
      },
      "stock": 35
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c8c"
      },
      "stock": 25
    }
  ],
  "tags": [
    "shorts",
    "training",
    "men"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c797f6dd74230ef1720ce2"
  },
  "name": "Women's Sports Bra 5",
  "slug": "womens-sports-bra-5",
  "description": "Medium support sports bra for gym.",
  "price": 1290,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775359/ecowear/products/womens-sports-bra-5_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775359/ecowear/products/womens-sports-bra-5_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775359/ecowear/products/womens-sports-bra-5_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775359/ecowear/products/womens-sports-bra-5_2.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa561"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa579"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c88"
      },
      "stock": 35
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c89"
      },
      "stock": 40
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c8a"
      },
      "stock": 45
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c8b"
      },
      "stock": 40
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c8c"
      },
      "stock": 30
    }
  ],
  "tags": [
    "sports-bra",
    "activewear",
    "women"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c797f6dd74230ef1720cab"
  },
  "name": "Men's Raincoat 9",
  "slug": "mens-raincoat-9",
  "description": "Waterproof raincoat with hood.",
  "price": 2590,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775189/ecowear/products/mens-raincoat-9_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775189/ecowear/products/mens-raincoat-9_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775189/ecowear/products/mens-raincoat-9_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775189/ecowear/products/mens-raincoat-9_3.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa567"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 14
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 25
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 34
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 30
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 18
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 8
    }
  ],
  "tags": [
    "raincoat",
    "waterproof",
    "men",
    "outdoor"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0,
  "updatedAt": {
    "$date": "2026-04-04T16:27:09.926Z"
  }
},
{
  "_id": {
    "$oid": "69c797f6dd74230ef1720cbe"
  },
  "name": "Women's Jogger Pants 18",
  "slug": "womens-jogger-pants-18",
  "description": "Comfortable joggers with elastic waist.",
  "price": 1490,
  "discount": 5,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775312/ecowear/products/womens-jogger-pants-18_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775312/ecowear/products/womens-jogger-pants-18_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775312/ecowear/products/womens-jogger-pants-18_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775312/ecowear/products/womens-jogger-pants-18_2.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55d"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa56b"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c74"
      },
      "stock": 33
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c75"
      },
      "stock": 45
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c76"
      },
      "stock": 55
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c77"
      },
      "stock": 50
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c78"
      },
      "stock": 35
    }
  ],
  "tags": [
    "joggers",
    "casual",
    "women",
    "sporty"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0,
  "updatedAt": {
    "$date": "2026-04-04T13:31:56.242Z"
  }
},
{
  "_id": {
    "$oid": "69c797f6dd74230ef1720cd3"
  },
  "name": "Wool Beanie 7",
  "slug": "wool-beanie-7",
  "description": "Warm wool beanie for winter.",
  "price": 790,
  "discount": 5,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775377/ecowear/products/wool-beanie-7_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775377/ecowear/products/wool-beanie-7_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775377/ecowear/products/wool-beanie-7_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775377/ecowear/products/wool-beanie-7_1.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55f"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa571"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7e"
      },
      "stock": 45
    }
  ],
  "tags": [
    "beanie",
    "wool",
    "winter"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c797f6dd74230ef1720cdf"
  },
  "name": "Women's Racerback Tank 2",
  "slug": "womens-racerback-tank-2",
  "description": "Breathable racerback tank for yoga.",
  "price": 990,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775338/ecowear/products/womens-racerback-tank-2_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775338/ecowear/products/womens-racerback-tank-2_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775338/ecowear/products/womens-racerback-tank-2_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775339/ecowear/products/womens-racerback-tank-2_2.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa561"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa577"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c88"
      },
      "stock": 35
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c89"
      },
      "stock": 40
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c8a"
      },
      "stock": 45
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c8b"
      },
      "stock": 40
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c8c"
      },
      "stock": 30
    }
  ],
  "tags": [
    "activewear",
    "tank",
    "women"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c797f6dd74230ef1720c9a"
  },
  "name": "Men's Graphic Printed T-Shirt 2",
  "slug": "mens-graphic-printed-t-shirt-2",
  "description": "Trendy graphic print t-shirt.",
  "price": 790,
  "discount": 10,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775137/ecowear/products/mens-graphic-printed-t-shirt-2_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775137/ecowear/products/mens-graphic-printed-t-shirt-2_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775137/ecowear/products/mens-graphic-printed-t-shirt-2_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775137/ecowear/products/mens-graphic-printed-t-shirt-2_4.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa565"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 38
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 50
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 60
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 55
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 35
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 15
    }
  ],
  "tags": [
    "t-shirt",
    "graphic",
    "men",
    "casual"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0,
  "updatedAt": {
    "$date": "2026-03-30T20:12:41.638Z"
  }
},
{
  "_id": {
    "$oid": "69c797f6dd74230ef1720cc3"
  },
  "name": "Boys' Cargo Pants 4",
  "slug": "boys-cargo-pants-4",
  "description": "Utility cargo pants with multiple pockets.",
  "price": 1090,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773069/ecowear/products/boys-cargo-pants-4_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773069/ecowear/products/boys-cargo-pants-4_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773069/ecowear/products/boys-cargo-pants-4_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773069/ecowear/products/boys-cargo-pants-4_1.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55e"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa56c"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c79"
      },
      "stock": 21
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7a"
      },
      "stock": 27
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7b"
      },
      "stock": 32
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7c"
      },
      "stock": 27
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7d"
      },
      "stock": 18
    }
  ],
  "tags": [
    "cargo",
    "pants",
    "boys"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0,
  "updatedAt": {
    "$date": "2026-04-04T16:27:09.926Z"
  }
},
{
  "_id": {
    "$oid": "69c797f6dd74230ef1720cca"
  },
  "name": "Baby Footed Pajamas 2",
  "slug": "baby-footed-pajamas-2",
  "description": "Cozy footed pajamas with zipper.",
  "price": 690,
  "discount": 5,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774772976/ecowear/products/baby-footed-pajamas-2_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774772976/ecowear/products/baby-footed-pajamas-2_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774772976/ecowear/products/baby-footed-pajamas-2_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774772975/ecowear/products/baby-footed-pajamas-2_2.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55e"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa56e"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c79"
      },
      "stock": 28
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7a"
      },
      "stock": 33
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7b"
      },
      "stock": 38
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7c"
      },
      "stock": 33
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7d"
      },
      "stock": 23
    }
  ],
  "tags": [
    "baby",
    "pajamas",
    "footed"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c797f6dd74230ef1720cd4"
  },
  "name": "Cashmere Scarf 8",
  "slug": "cashmere-scarf-8",
  "description": "Luxurious cashmere blend scarf.",
  "price": 1290,
  "discount": 10,
  "images": [],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55f"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa572"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7e"
      },
      "stock": 30
    }
  ],
  "tags": [
    "scarf",
    "cashmere",
    "winter"
  ],
  "isActive": true,
  "isFeatured": true,
  "featuredOrder": 16
},
{
  "_id": {
    "$oid": "69c797f6dd74230ef1720c9e"
  },
  "name": "Men's Athletic T-Shirt 6",
  "slug": "mens-athletic-t-shirt-6",
  "description": "Moisture-wicking fabric for sports activities.",
  "price": 990,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773138/ecowear/products/mens-athletic-t-shirt-6_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773138/ecowear/products/mens-athletic-t-shirt-6_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773138/ecowear/products/mens-athletic-t-shirt-6_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773139/ecowear/products/mens-athletic-t-shirt-6_1.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa565"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 35
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 45
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 55
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 50
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 30
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 15
    }
  ],
  "tags": [
    "t-shirt",
    "athletic",
    "sport",
    "men"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c797f6dd74230ef1720ce4"
  },
  "name": "Women's Softshell Jacket 7",
  "slug": "womens-softshell-jacket-7",
  "description": "Windproof softshell jacket for hiking.",
  "price": 2790,
  "discount": 10,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775355/ecowear/products/womens-softshell-jacket-7_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775355/ecowear/products/womens-softshell-jacket-7_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775355/ecowear/products/womens-softshell-jacket-7_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775355/ecowear/products/womens-softshell-jacket-7_4.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa561"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa57a"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c88"
      },
      "stock": 20
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c89"
      },
      "stock": 25
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c8a"
      },
      "stock": 30
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c8b"
      },
      "stock": 28
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c8c"
      },
      "stock": 18
    }
  ],
  "tags": [
    "jacket",
    "softshell",
    "outdoor",
    "women"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c797f6dd74230ef1720c91"
  },
  "name": "Men's Oxford Button-Down Shirt 3",
  "slug": "mens-oxford-button-down-shirt-3",
  "description": "Classic Oxford shirt with button-down collar.",
  "price": 1590,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775169/ecowear/products/mens-oxford-button-down-shirt-3_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775169/ecowear/products/mens-oxford-button-down-shirt-3_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775169/ecowear/products/mens-oxford-button-down-shirt-3_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775169/ecowear/products/mens-oxford-button-down-shirt-3_4.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa564"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 7
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 18
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 22
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 20
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 12
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 6
    }
  ],
  "tags": [
    "shirt",
    "oxford",
    "men",
    "formal"
  ],
  "isActive": true,
  "isFeatured": true,
  "featuredOrder": 1,
  "updatedAt": {
    "$date": "2026-03-30T20:23:10.369Z"
  },
  "averageRating": 5,
  "totalReviews": 1,
  "views": 0
},
{
  "_id": {
    "$oid": "69c797f6dd74230ef1720c9f"
  },
  "name": "Men's Henley T-Shirt 7",
  "slug": "mens-henley-t-shirt-7",
  "description": "Classic henley neck style with button placket.",
  "price": 1090,
  "discount": 0,
  "images": [],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa565"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 20
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 30
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 40
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 35
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 20
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 8
    }
  ],
  "tags": [
    "t-shirt",
    "henley",
    "men",
    "casual"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0,
  "updatedAt": {
    "$date": "2026-03-31T07:06:05.317Z"
  }
},
{
  "_id": {
    "$oid": "69c797f6dd74230ef1720ca0"
  },
  "name": "Men's Ringer T-Shirt 8",
  "slug": "mens-ringer-t-shirt-8",
  "description": "Retro style with contrast collar and sleeve trim.",
  "price": 790,
  "discount": 0,
  "images": [],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa565"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 25
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 35
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 45
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 40
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 22
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 10
    }
  ],
  "tags": [
    "t-shirt",
    "ringer",
    "retro",
    "men"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c797f6dd74230ef1720cb6"
  },
  "name": "Women's Chiffon Blouse 10",
  "slug": "womens-chiffon-blouse-10",
  "description": "Elegant chiffon blouse with ruffles.",
  "price": 1690,
  "discount": 5,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775266/ecowear/products/womens-chiffon-blouse-10_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775266/ecowear/products/womens-chiffon-blouse-10_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775266/ecowear/products/womens-chiffon-blouse-10_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775266/ecowear/products/womens-chiffon-blouse-10_2.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55d"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa569"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c74"
      },
      "stock": 22
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c75"
      },
      "stock": 32
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c76"
      },
      "stock": 42
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c77"
      },
      "stock": 37
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c78"
      },
      "stock": 22
    }
  ],
  "tags": [
    "blouse",
    "chiffon",
    "women",
    "formal"
  ],
  "isActive": true,
  "isFeatured": true,
  "featuredOrder": 10
},
{
  "_id": {
    "$oid": "69c797f6dd74230ef1720cb8"
  },
  "name": "Women's Pleated Midi Skirt 12",
  "slug": "womens-pleated-midi-skirt-12",
  "description": "Elegant pleated midi skirt.",
  "price": 1890,
  "discount": 10,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775327/ecowear/products/womens-pleated-midi-skirt-12_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775327/ecowear/products/womens-pleated-midi-skirt-12_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775327/ecowear/products/womens-pleated-midi-skirt-12_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775327/ecowear/products/womens-pleated-midi-skirt-12_3.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55d"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa56a"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c74"
      },
      "stock": 20
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c75"
      },
      "stock": 30
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c76"
      },
      "stock": 40
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c77"
      },
      "stock": 35
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c78"
      },
      "stock": 20
    }
  ],
  "tags": [
    "skirt",
    "pleated",
    "midi",
    "women"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c797f6dd74230ef1720cac"
  },
  "name": "Men's Denim Jacket 10",
  "slug": "mens-denim-jacket-10",
  "description": "Classic denim jacket for everyday wear.",
  "price": 2790,
  "discount": 10,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773168/ecowear/products/mens-denim-jacket-10_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773168/ecowear/products/mens-denim-jacket-10_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773168/ecowear/products/mens-denim-jacket-10_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773168/ecowear/products/mens-denim-jacket-10_1.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa567"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 17
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 28
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 38
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 33
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 20
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 9
    }
  ],
  "tags": [
    "jacket",
    "denim",
    "men",
    "casual"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0,
  "updatedAt": {
    "$date": "2026-03-31T12:47:19.988Z"
  }
},
{
  "_id": {
    "$oid": "69c797f6dd74230ef1720cae"
  },
  "name": "Women's Little Black Dress 2",
  "slug": "womens-little-black-dress-2",
  "description": "Classic little black dress for any occasion.",
  "price": 2490,
  "discount": 0,
  "images": [],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55d"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa568"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c74"
      },
      "stock": 20
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c75"
      },
      "stock": 30
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c76"
      },
      "stock": 40
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c77"
      },
      "stock": 35
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c78"
      },
      "stock": 20
    }
  ],
  "tags": [
    "dress",
    "little-black-dress",
    "women",
    "formal"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c797f6dd74230ef1720cb2"
  },
  "name": "Women's High-Low Hem Dress 6",
  "slug": "womens-high-low-hem-dress-6",
  "description": "Trendy high-low hem dress.",
  "price": 1990,
  "discount": 5,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775302/ecowear/products/womens-high-low-hem-dress-6_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775302/ecowear/products/womens-high-low-hem-dress-6_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775302/ecowear/products/womens-high-low-hem-dress-6_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775302/ecowear/products/womens-high-low-hem-dress-6_3.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55d"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa568"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c74"
      },
      "stock": 22
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c75"
      },
      "stock": 32
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c76"
      },
      "stock": 42
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c77"
      },
      "stock": 37
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c78"
      },
      "stock": 22
    }
  ],
  "tags": [
    "dress",
    "high-low",
    "women",
    "casual"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c797f6dd74230ef1720ccd"
  },
  "name": "Leather Tote Bag 1",
  "slug": "leather-tote-bag-1",
  "description": "Elegant leather tote for daily use.",
  "price": 2990,
  "discount": 10,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773134/ecowear/products/leather-tote-bag-1_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773134/ecowear/products/leather-tote-bag-1_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773134/ecowear/products/leather-tote-bag-1_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773134/ecowear/products/leather-tote-bag-1_1.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55f"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa56f"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7e"
      },
      "stock": 20
    }
  ],
  "tags": [
    "bag",
    "tote",
    "leather"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c797f6dd74230ef1720ccf"
  },
  "name": "Crossbody Bag 3",
  "slug": "crossbody-bag-3",
  "description": "Compact crossbody bag with adjustable strap.",
  "price": 1490,
  "discount": 5,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773101/ecowear/products/crossbody-bag-3_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773101/ecowear/products/crossbody-bag-3_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773101/ecowear/products/crossbody-bag-3_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773101/ecowear/products/crossbody-bag-3_3.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55f"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa56f"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7e"
      },
      "stock": 40
    }
  ],
  "tags": [
    "bag",
    "crossbody",
    "casual"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0,
  "averageRating": 5,
  "totalReviews": 1,
  "updatedAt": {
    "$date": "2026-03-31T12:33:14.858Z"
  },
  "views": 0
},
{
  "_id": {
    "$oid": "69c797f6dd74230ef1720cd1"
  },
  "name": "Fabric Belt 5",
  "slug": "fabric-belt-5",
  "description": "Woven fabric belt with adjustable clip.",
  "price": 590,
  "discount": 10,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773107/ecowear/products/fabric-belt-5_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773107/ecowear/products/fabric-belt-5_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773106/ecowear/products/fabric-belt-5_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773107/ecowear/products/fabric-belt-5_1.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55f"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa570"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7e"
      },
      "stock": 60
    }
  ],
  "tags": [
    "belt",
    "fabric",
    "casual"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c797f6dd74230ef1720cd6"
  },
  "name": "Men's Running Sneakers 1",
  "slug": "mens-running-sneakers-1",
  "description": "Lightweight running sneakers with cushioning.",
  "price": 2490,
  "discount": 15,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775200/ecowear/products/mens-running-sneakers-1_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775200/ecowear/products/mens-running-sneakers-1_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775200/ecowear/products/mens-running-sneakers-1_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775200/ecowear/products/mens-running-sneakers-1_1.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa560"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa573"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7f"
      },
      "stock": 14
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c80"
      },
      "stock": 20
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c81"
      },
      "stock": 25
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c82"
      },
      "stock": 25
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c83"
      },
      "stock": 20
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c84"
      },
      "stock": 15
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c85"
      },
      "stock": 10
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c86"
      },
      "stock": 8
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c87"
      },
      "stock": 5
    }
  ],
  "tags": [
    "sneakers",
    "running",
    "men"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0,
  "updatedAt": {
    "$date": "2026-03-31T17:08:38.782Z"
  }
},
{
  "_id": {
    "$oid": "69c797f6dd74230ef1720c93"
  },
  "name": "Men's Casual Plaid Shirt 5",
  "slug": "mens-casual-plaid-shirt-5",
  "description": "Stylish plaid pattern for a rugged look.",
  "price": 1490,
  "discount": 5,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773151/ecowear/products/mens-casual-plaid-shirt-5_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773151/ecowear/products/mens-casual-plaid-shirt-5_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773151/ecowear/products/mens-casual-plaid-shirt-5_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773151/ecowear/products/mens-casual-plaid-shirt-5_1.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa564"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 8
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 22
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 30
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 28
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 15
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 7
    }
  ],
  "tags": [
    "shirt",
    "plaid",
    "men",
    "casual"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0,
  "averageRating": 5,
  "totalReviews": 0,
  "updatedAt": {
    "$date": "2026-04-01T19:48:44.719Z"
  },
  "views": 0
},
{
  "_id": {
    "$oid": "69c797f6dd74230ef1720c9b"
  },
  "name": "Men's V-Neck T-Shirt 3",
  "slug": "mens-v-neck-t-shirt-3",
  "description": "Classic V-neck t-shirt in various colors.",
  "price": 690,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775235/ecowear/products/mens-v-neck-t-shirt-3_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775235/ecowear/products/mens-v-neck-t-shirt-3_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775235/ecowear/products/mens-v-neck-t-shirt-3_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775236/ecowear/products/mens-v-neck-t-shirt-3_3.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa565"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 38
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 54
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 70
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 65
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 40
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 18
    }
  ],
  "tags": [
    "t-shirt",
    "v-neck",
    "men",
    "basic"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0,
  "updatedAt": {
    "$date": "2026-04-03T00:13:45.604Z"
  }
},
{
  "_id": {
    "$oid": "69c797f6dd74230ef1720cb3"
  },
  "name": "Women's Cotton Blouse 7",
  "slug": "womens-cotton-blouse-7",
  "description": "Lightweight cotton blouse with embroidery.",
  "price": 1290,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775274/ecowear/products/womens-cotton-blouse-7_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775274/ecowear/products/womens-cotton-blouse-7_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775274/ecowear/products/womens-cotton-blouse-7_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775274/ecowear/products/womens-cotton-blouse-7_3.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55d"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa569"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c74"
      },
      "stock": 30
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c75"
      },
      "stock": 40
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c76"
      },
      "stock": 50
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c77"
      },
      "stock": 45
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c78"
      },
      "stock": 30
    }
  ],
  "tags": [
    "blouse",
    "cotton",
    "women",
    "casual"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c797f6dd74230ef1720cc4"
  },
  "name": "Boys' Polo Shirt 5",
  "slug": "boys-polo-shirt-5",
  "description": "Classic polo shirt for school.",
  "price": 790,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773089/ecowear/products/boys-polo-shirt-5_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773088/ecowear/products/boys-polo-shirt-5_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773088/ecowear/products/boys-polo-shirt-5_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773088/ecowear/products/boys-polo-shirt-5_3.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55e"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa56c"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c79"
      },
      "stock": 35
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7a"
      },
      "stock": 40
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7b"
      },
      "stock": 45
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7c"
      },
      "stock": 40
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7d"
      },
      "stock": 30
    }
  ],
  "tags": [
    "polo",
    "boys",
    "shirt"
  ],
  "isActive": true,
  "isFeatured": true,
  "featuredOrder": 13
},
{
  "_id": {
    "$oid": "69c797f6dd74230ef1720cce"
  },
  "name": "Canvas Backpack 2",
  "slug": "canvas-backpack-2",
  "description": "Durable canvas backpack with laptop sleeve.",
  "price": 1890,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773093/ecowear/products/canvas-backpack-2_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773093/ecowear/products/canvas-backpack-2_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773093/ecowear/products/canvas-backpack-2_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773093/ecowear/products/canvas-backpack-2_1.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55f"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa56f"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7e"
      },
      "stock": 35
    }
  ],
  "tags": [
    "backpack",
    "canvas",
    "school"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c797f6dd74230ef1720cdb"
  },
  "name": "Women's Wedge Sandals 6",
  "slug": "womens-wedge-sandals-6",
  "description": "Stylish wedge sandals with ankle strap.",
  "price": 2090,
  "discount": 10,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775365/ecowear/products/womens-wedge-sandals-6_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775365/ecowear/products/womens-wedge-sandals-6_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775365/ecowear/products/womens-wedge-sandals-6_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775365/ecowear/products/womens-wedge-sandals-6_4.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa560"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa575"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7f"
      },
      "stock": 17
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c80"
      },
      "stock": 22
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c81"
      },
      "stock": 28
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c82"
      },
      "stock": 28
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c83"
      },
      "stock": 22
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c84"
      },
      "stock": 18
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c85"
      },
      "stock": 12
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c86"
      },
      "stock": 8
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c87"
      },
      "stock": 5
    }
  ],
  "tags": [
    "sandals",
    "wedge",
    "summer",
    "women"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0,
  "updatedAt": {
    "$date": "2026-03-31T17:08:38.782Z"
  }
},
{
  "_id": {
    "$oid": "69c797f6dd74230ef1720ca2"
  },
  "name": "Men's Slim Fit T-Shirt 10",
  "slug": "mens-slim-fit-t-shirt-10",
  "description": "Modern slim fit for a tailored look.",
  "price": 790,
  "discount": 5,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775214/ecowear/products/mens-slim-fit-t-shirt-10_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775214/ecowear/products/mens-slim-fit-t-shirt-10_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775214/ecowear/products/mens-slim-fit-t-shirt-10_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775214/ecowear/products/mens-slim-fit-t-shirt-10_3.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa565"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 32
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 42
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 52
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 47
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 28
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 14
    }
  ],
  "tags": [
    "t-shirt",
    "slim-fit",
    "men",
    "modern"
  ],
  "isActive": true,
  "isFeatured": true,
  "featuredOrder": 5
},
{
  "_id": {
    "$oid": "69c797f6dd74230ef1720ca4"
  },
  "name": "Men's Relaxed Fit Chinos 2",
  "slug": "mens-relaxed-fit-chinos-2",
  "description": "Comfortable chinos for casual wear.",
  "price": 1690,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775192/ecowear/products/mens-relaxed-fit-chinos-2_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775192/ecowear/products/mens-relaxed-fit-chinos-2_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775192/ecowear/products/mens-relaxed-fit-chinos-2_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775192/ecowear/products/mens-relaxed-fit-chinos-2_4.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa566"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 25
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 35
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 45
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 40
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 25
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 12
    }
  ],
  "tags": [
    "chinos",
    "relaxed-fit",
    "men",
    "casual"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c797f6dd74230ef1720cb9"
  },
  "name": "Women's Denim Skirt 13",
  "slug": "womens-denim-skirt-13",
  "description": "Casual denim skirt with button front.",
  "price": 1390,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775280/ecowear/products/womens-denim-skirt-13_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775281/ecowear/products/womens-denim-skirt-13_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775281/ecowear/products/womens-denim-skirt-13_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775281/ecowear/products/womens-denim-skirt-13_1.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55d"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa56a"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c74"
      },
      "stock": 30
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c75"
      },
      "stock": 40
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c76"
      },
      "stock": 50
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c77"
      },
      "stock": 45
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c78"
      },
      "stock": 30
    }
  ],
  "tags": [
    "skirt",
    "denim",
    "women",
    "casual"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c797f6dd74230ef1720cbb"
  },
  "name": "Women's High-Waisted Trousers 15",
  "slug": "womens-high-waisted-trousers-15",
  "description": "Tailored high-waisted trousers for office.",
  "price": 2090,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775308/ecowear/products/womens-high-waisted-trousers-15_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775308/ecowear/products/womens-high-waisted-trousers-15_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775308/ecowear/products/womens-high-waisted-trousers-15_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775308/ecowear/products/womens-high-waisted-trousers-15_4.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55d"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa56b"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c74"
      },
      "stock": 20
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c75"
      },
      "stock": 30
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c76"
      },
      "stock": 40
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c77"
      },
      "stock": 35
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c78"
      },
      "stock": 20
    }
  ],
  "tags": [
    "trousers",
    "high-waisted",
    "women",
    "formal"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c797f6dd74230ef1720cbf"
  },
  "name": "Women's Cotton Linen Pants 19",
  "slug": "womens-cotton-linen-pants-19",
  "description": "Breathable cotton-linen blend for summer.",
  "price": 1690,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775276/ecowear/products/womens-cotton-linen-pants-19_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775276/ecowear/products/womens-cotton-linen-pants-19_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775276/ecowear/products/womens-cotton-linen-pants-19_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775276/ecowear/products/womens-cotton-linen-pants-19_4.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55d"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa56b"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c74"
      },
      "stock": 28
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c75"
      },
      "stock": 38
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c76"
      },
      "stock": 48
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c77"
      },
      "stock": 42
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c78"
      },
      "stock": 28
    }
  ],
  "tags": [
    "pants",
    "linen",
    "summer",
    "women"
  ],
  "isActive": true,
  "isFeatured": true,
  "featuredOrder": 12
},
{
  "_id": {
    "$oid": "69c797f6dd74230ef1720cc9"
  },
  "name": "Baby Cotton Romper 1",
  "slug": "baby-cotton-romper-1",
  "description": "Soft cotton romper for babies.",
  "price": 590,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774772976/ecowear/products/baby-cotton-romper-1_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774772975/ecowear/products/baby-cotton-romper-1_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774772975/ecowear/products/baby-cotton-romper-1_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774772975/ecowear/products/baby-cotton-romper-1_3.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55e"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa56e"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c79"
      },
      "stock": 30
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7a"
      },
      "stock": 35
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7b"
      },
      "stock": 40
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7c"
      },
      "stock": 35
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7d"
      },
      "stock": 25
    }
  ],
  "tags": [
    "baby",
    "romper",
    "cotton"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c797f6dd74230ef1720cd9"
  },
  "name": "Women's Pumps 4",
  "slug": "womens-pumps-4",
  "description": "Elegant pumps with pointed toe.",
  "price": 2790,
  "discount": 5,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775334/ecowear/products/womens-pumps-4_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775334/ecowear/products/womens-pumps-4_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775334/ecowear/products/womens-pumps-4_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775334/ecowear/products/womens-pumps-4_3.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa560"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa574"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7f"
      },
      "stock": 14
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c80"
      },
      "stock": 18
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c81"
      },
      "stock": 22
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c82"
      },
      "stock": 22
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c83"
      },
      "stock": 18
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c84"
      },
      "stock": 14
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c85"
      },
      "stock": 10
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c86"
      },
      "stock": 8
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c87"
      },
      "stock": 5
    }
  ],
  "tags": [
    "pumps",
    "heels",
    "women",
    "formal"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c797f6dd74230ef1720ce1"
  },
  "name": "Women's High-Waisted Leggings 4",
  "slug": "womens-high-waisted-leggings-4",
  "description": "Squat-proof leggings with tummy control.",
  "price": 1490,
  "discount": 10,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775306/ecowear/products/womens-high-waisted-leggings-4_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775306/ecowear/products/womens-high-waisted-leggings-4_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775306/ecowear/products/womens-high-waisted-leggings-4_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775306/ecowear/products/womens-high-waisted-leggings-4_3.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa561"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa578"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c88"
      },
      "stock": 40
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c89"
      },
      "stock": 45
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c8a"
      },
      "stock": 50
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c8b"
      },
      "stock": 45
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c8c"
      },
      "stock": 35
    }
  ],
  "tags": [
    "leggings",
    "high-waisted",
    "women"
  ],
  "isActive": true,
  "isFeatured": true,
  "featuredOrder": 19
},
{
  "_id": {
    "$oid": "69c797f6dd74230ef1720c92"
  },
  "name": "Men's Linen Summer Shirt 4",
  "slug": "mens-linen-summer-shirt-4",
  "description": "Breathable linen shirt for hot weather.",
  "price": 1990,
  "discount": 20,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775155/ecowear/products/mens-linen-summer-shirt-4_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775155/ecowear/products/mens-linen-summer-shirt-4_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775155/ecowear/products/mens-linen-summer-shirt-4_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775155/ecowear/products/mens-linen-summer-shirt-4_4.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa564"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 4
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 15
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 25
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 20
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 9
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 4
    }
  ],
  "tags": [
    "shirt",
    "linen",
    "summer",
    "men"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0,
  "updatedAt": {
    "$date": "2026-04-02T07:34:37.579Z"
  }
},
{
  "_id": {
    "$oid": "69c797f6dd74230ef1720c94"
  },
  "name": "Men's Premium White Shirt 6",
  "slug": "mens-premium-white-shirt-6",
  "description": "Crisp white shirt made from premium Egyptian cotton.",
  "price": 2490,
  "discount": 25,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775184/ecowear/products/mens-premium-white-shirt-6_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775184/ecowear/products/mens-premium-white-shirt-6_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775184/ecowear/products/mens-premium-white-shirt-6_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775184/ecowear/products/mens-premium-white-shirt-6_2.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa564"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 0
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 10
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 20
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 18
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 7
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 3
    }
  ],
  "tags": [
    "shirt",
    "white",
    "premium",
    "men"
  ],
  "isActive": true,
  "isFeatured": true,
  "featuredOrder": 2,
  "averageRating": 5,
  "totalReviews": 0,
  "updatedAt": {
    "$date": "2026-04-02T19:07:42.525Z"
  },
  "views": 0
},
{
  "_id": {
    "$oid": "69c797f6dd74230ef1720c99"
  },
  "name": "Men's Cotton T-Shirt 1.5",
  "slug": "mens-cotton-t-shirt-1",
  "description": "Soft 100% cotton t-shirt for everyday wear.",
  "price": 599.99,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773166/ecowear/products/mens-cotton-t-shirt-1_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773166/ecowear/products/mens-cotton-t-shirt-1_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773166/ecowear/products/mens-cotton-t-shirt-1_1.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa565"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 50,
      "_id": {
        "$oid": "69cb72c2d5926cd33a2d5faf"
      }
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 60,
      "_id": {
        "$oid": "69cb72c2d5926cd33a2d5fb0"
      }
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 80,
      "_id": {
        "$oid": "69cb72c2d5926cd33a2d5fb1"
      }
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 70,
      "_id": {
        "$oid": "69cb72c2d5926cd33a2d5fb2"
      }
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 40,
      "_id": {
        "$oid": "69cb72c2d5926cd33a2d5fb3"
      }
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 20,
      "_id": {
        "$oid": "69cb72c2d5926cd33a2d5fb4"
      }
    }
  ],
  "tags": [
    "t-shirt",
    "cotton",
    "men",
    "basic"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0,
  "updatedAt": {
    "$date": "2026-03-31T07:07:46.683Z"
  }
},
{
  "_id": {
    "$oid": "69c797f6dd74230ef1720c9c"
  },
  "name": "Men's Premium Polo T-Shirt 4",
  "slug": "mens-premium-polo-t-shirt-4",
  "description": "High-quality polo shirt with embroidered logo.",
  "price": 1290,
  "discount": 15,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775180/ecowear/products/mens-premium-polo-t-shirt-4_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775180/ecowear/products/mens-premium-polo-t-shirt-4_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775180/ecowear/products/mens-premium-polo-t-shirt-4_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775180/ecowear/products/mens-premium-polo-t-shirt-4_2.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa565"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 18
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 30
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 40
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 35
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 20
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 8
    }
  ],
  "tags": [
    "polo",
    "t-shirt",
    "premium",
    "men"
  ],
  "isActive": true,
  "isFeatured": true,
  "featuredOrder": 4,
  "updatedAt": {
    "$date": "2026-04-02T07:23:00.399Z"
  }
},
{
  "_id": {
    "$oid": "69c797f6dd74230ef1720cba"
  },
  "name": "Women's Leather Skirt 14",
  "slug": "womens-leather-skirt-14",
  "description": "Edgy faux leather skirt.",
  "price": 2190,
  "discount": 15,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775316/ecowear/products/womens-leather-skirt-14_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775316/ecowear/products/womens-leather-skirt-14_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775316/ecowear/products/womens-leather-skirt-14_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775317/ecowear/products/womens-leather-skirt-14_2.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55d"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa56a"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c74"
      },
      "stock": 18
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c75"
      },
      "stock": 28
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c76"
      },
      "stock": 38
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c77"
      },
      "stock": 33
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c78"
      },
      "stock": 18
    }
  ],
  "tags": [
    "skirt",
    "leather",
    "women",
    "edgy"
  ],
  "isActive": true,
  "isFeatured": true,
  "featuredOrder": 11
},
{
  "_id": {
    "$oid": "69c797f6dd74230ef1720cbd"
  },
  "name": "Women's Skinny Jeans 17",
  "slug": "womens-skinny-jeans-17",
  "description": "Classic skinny fit jeans with stretch.",
  "price": 1790,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775346/ecowear/products/womens-skinny-jeans-17_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775346/ecowear/products/womens-skinny-jeans-17_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775346/ecowear/products/womens-skinny-jeans-17_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775346/ecowear/products/womens-skinny-jeans-17_4.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55d"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa56b"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c74"
      },
      "stock": 30
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c75"
      },
      "stock": 40
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c76"
      },
      "stock": 50
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c77"
      },
      "stock": 45
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c78"
      },
      "stock": 30
    }
  ],
  "tags": [
    "jeans",
    "skinny",
    "women",
    "denim"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c797f6dd74230ef1720cc0"
  },
  "name": "Boys' Graphic T-Shirt 1",
  "slug": "boys-graphic-t-shirt-1",
  "description": "Cool graphic t-shirt for boys.",
  "price": 590,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773079/ecowear/products/boys-graphic-t-shirt-1_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773079/ecowear/products/boys-graphic-t-shirt-1_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773079/ecowear/products/boys-graphic-t-shirt-1_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773079/ecowear/products/boys-graphic-t-shirt-1_4.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55e"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa56c"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c79"
      },
      "stock": 30
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7a"
      },
      "stock": 35
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7b"
      },
      "stock": 40
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7c"
      },
      "stock": 35
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7d"
      },
      "stock": 25
    }
  ],
  "tags": [
    "t-shirt",
    "boys",
    "graphic"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c797f6dd74230ef1720cc1"
  },
  "name": "Boys' Denim Jeans 2",
  "slug": "boys-denim-jeans-2",
  "description": "Sturdy denim jeans for active kids.",
  "price": 990,
  "discount": 10,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773073/ecowear/products/boys-denim-jeans-2_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773073/ecowear/products/boys-denim-jeans-2_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773073/ecowear/products/boys-denim-jeans-2_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773073/ecowear/products/boys-denim-jeans-2_4.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55e"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa56c"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c79"
      },
      "stock": 24
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7a"
      },
      "stock": 30
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7b"
      },
      "stock": 35
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7c"
      },
      "stock": 30
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7d"
      },
      "stock": 20
    }
  ],
  "tags": [
    "jeans",
    "boys",
    "denim"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0,
  "updatedAt": {
    "$date": "2026-04-04T16:27:09.926Z"
  }
},
{
  "_id": {
    "$oid": "69c797f6dd74230ef1720cd2"
  },
  "name": "Baseball Cap 6",
  "slug": "baseball-cap-6",
  "description": "Classic baseball cap with adjustable strap.",
  "price": 690,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773066/ecowear/products/baseball-cap-6_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773066/ecowear/products/baseball-cap-6_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773066/ecowear/products/baseball-cap-6_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773066/ecowear/products/baseball-cap-6_4.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55f"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa571"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7e"
      },
      "stock": 70
    }
  ],
  "tags": [
    "cap",
    "baseball",
    "hat"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c797f6dd74230ef1720cde"
  },
  "name": "Men's Compression Shirt 1",
  "slug": "mens-compression-shirt-1",
  "description": "Moisture-wicking compression top for workouts.",
  "price": 1290,
  "discount": 5,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773162/ecowear/products/mens-compression-shirt-1_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773162/ecowear/products/mens-compression-shirt-1_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773162/ecowear/products/mens-compression-shirt-1_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773162/ecowear/products/mens-compression-shirt-1_1.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa561"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa577"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c88"
      },
      "stock": 25
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c89"
      },
      "stock": 30
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c8a"
      },
      "stock": 35
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c8b"
      },
      "stock": 30
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c8c"
      },
      "stock": 20
    }
  ],
  "tags": [
    "activewear",
    "compression",
    "men"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c797f6dd74230ef1720ce3"
  },
  "name": "Men's Waterproof Jacket 6",
  "slug": "mens-waterproof-jacket-6",
  "description": "Waterproof and breathable shell jacket.",
  "price": 3290,
  "discount": 20,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775240/ecowear/products/mens-waterproof-jacket-6_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775240/ecowear/products/mens-waterproof-jacket-6_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775240/ecowear/products/mens-waterproof-jacket-6_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775240/ecowear/products/mens-waterproof-jacket-6_1.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa561"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa57a"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c88"
      },
      "stock": 18
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c89"
      },
      "stock": 22
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c8a"
      },
      "stock": 28
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c8b"
      },
      "stock": 25
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c8c"
      },
      "stock": 15
    }
  ],
  "tags": [
    "jacket",
    "waterproof",
    "outdoor",
    "men"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c797f6dd74230ef1720ca5"
  },
  "name": "Men's Cargo Pants 3",
  "slug": "mens-cargo-pants-3",
  "description": "Utility cargo pants with multiple pockets.",
  "price": 1990,
  "discount": 15,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773147/ecowear/products/mens-cargo-pants-3_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773147/ecowear/products/mens-cargo-pants-3_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773147/ecowear/products/mens-cargo-pants-3_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773147/ecowear/products/mens-cargo-pants-3_3.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa566"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 18
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 28
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 38
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 33
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 18
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 8
    }
  ],
  "tags": [
    "cargo",
    "pants",
    "utility",
    "men"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c797f6dd74230ef1720ca6"
  },
  "name": "Men's Tapered Fit Trousers 4",
  "slug": "mens-tapered-fit-trousers-4",
  "description": "Smart tapered trousers for office wear.",
  "price": 2290,
  "discount": 5,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775226/ecowear/products/mens-tapered-fit-trousers-4_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775226/ecowear/products/mens-tapered-fit-trousers-4_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775226/ecowear/products/mens-tapered-fit-trousers-4_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775226/ecowear/products/mens-tapered-fit-trousers-4_3.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa566"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 15
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 25
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 35
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 30
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 15
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 5
    }
  ],
  "tags": [
    "trousers",
    "tapered-fit",
    "formal",
    "men"
  ],
  "isActive": true,
  "isFeatured": true,
  "featuredOrder": 6,
  "averageRating": 3,
  "totalReviews": 0,
  "updatedAt": {
    "$date": "2026-03-29T17:30:38.021Z"
  },
  "views": 0
},
{
  "_id": {
    "$oid": "69c797f6dd74230ef1720caf"
  },
  "name": "Women's Wrap Dress 3",
  "slug": "womens-wrap-dress-3",
  "description": "Flattering wrap dress with belt.",
  "price": 2190,
  "discount": 10,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775370/ecowear/products/womens-wrap-dress-3_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775370/ecowear/products/womens-wrap-dress-3_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775371/ecowear/products/womens-wrap-dress-3_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775371/ecowear/products/womens-wrap-dress-3_1.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55d"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa568"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c74"
      },
      "stock": 18
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c75"
      },
      "stock": 28
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c76"
      },
      "stock": 38
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c77"
      },
      "stock": 33
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c78"
      },
      "stock": 18
    }
  ],
  "tags": [
    "dress",
    "wrap",
    "women",
    "casual"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0,
  "averageRating": 5,
  "totalReviews": 1,
  "updatedAt": {
    "$date": "2026-03-31T17:01:02.806Z"
  },
  "views": 0
},
{
  "_id": {
    "$oid": "69c797f6dd74230ef1720ca8"
  },
  "name": "Men's Stretch Joggers 6",
  "slug": "mens-stretch-joggers-6",
  "description": "Comfortable joggers with elastic cuffs.",
  "price": 1490,
  "discount": 10,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775221/ecowear/products/mens-stretch-joggers-6_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775221/ecowear/products/mens-stretch-joggers-6_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775221/ecowear/products/mens-stretch-joggers-6_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775221/ecowear/products/mens-stretch-joggers-6_4.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa566"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 30
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 40
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 50
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 45
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 30
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 15
    }
  ],
  "tags": [
    "joggers",
    "stretch",
    "casual",
    "men"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c797f6dd74230ef1720cad"
  },
  "name": "Women's Floral Maxi Dress 1",
  "slug": "womens-floral-maxi-dress-1",
  "description": "Elegant floral maxi dress for summer.",
  "price": 2290,
  "discount": 15,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775295/ecowear/products/womens-floral-maxi-dress-1_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775295/ecowear/products/womens-floral-maxi-dress-1_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775295/ecowear/products/womens-floral-maxi-dress-1_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775295/ecowear/products/womens-floral-maxi-dress-1_4.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55d"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa568"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c74"
      },
      "stock": 15
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c75"
      },
      "stock": 25
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c76"
      },
      "stock": 35
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c77"
      },
      "stock": 30
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c78"
      },
      "stock": 15
    }
  ],
  "tags": [
    "dress",
    "maxi",
    "floral",
    "women"
  ],
  "isActive": true,
  "isFeatured": true,
  "featuredOrder": 8
},
{
  "_id": {
    "$oid": "69c797f6dd74230ef1720cb7"
  },
  "name": "Women's A-Line Skirt 11",
  "slug": "womens-a-line-skirt-11",
  "description": "Classic A-line skirt in tweed.",
  "price": 1590,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775252/ecowear/products/womens-a-line-skirt-11_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775252/ecowear/products/womens-a-line-skirt-11_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775252/ecowear/products/womens-a-line-skirt-11_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775252/ecowear/products/womens-a-line-skirt-11_3.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55d"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa56a"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c74"
      },
      "stock": 25
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c75"
      },
      "stock": 35
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c76"
      },
      "stock": 45
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c77"
      },
      "stock": 40
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c78"
      },
      "stock": 25
    }
  ],
  "tags": [
    "skirt",
    "a-line",
    "women",
    "casual"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c797f6dd74230ef1720cd5"
  },
  "name": "Silk Scarf 9",
  "slug": "silk-scarf-9",
  "description": "Elegant silk scarf with print.",
  "price": 990,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775249/ecowear/products/silk-scarf-9_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775249/ecowear/products/silk-scarf-9_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775249/ecowear/products/silk-scarf-9_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775250/ecowear/products/silk-scarf-9_2.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55f"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa572"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7e"
      },
      "stock": 40
    }
  ],
  "tags": [
    "scarf",
    "silk",
    "accessory"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c797f6dd74230ef1720cc6"
  },
  "name": "Girls' Denim Jacket 2",
  "slug": "girls-denim-jacket-2",
  "description": "Stylish denim jacket for girls.",
  "price": 1290,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773110/ecowear/products/girls-denim-jacket-2_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773110/ecowear/products/girls-denim-jacket-2_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773110/ecowear/products/girls-denim-jacket-2_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773110/ecowear/products/girls-denim-jacket-2_4.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55e"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa56d"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c79"
      },
      "stock": 20
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7a"
      },
      "stock": 25
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7b"
      },
      "stock": 30
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7c"
      },
      "stock": 25
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7d"
      },
      "stock": 18
    }
  ],
  "tags": [
    "jacket",
    "denim",
    "girls"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c797f6dd74230ef1720c90"
  },
  "name": "Men's Slim Fit Denim Shirt 2",
  "slug": "mens-slim-fit-denim-shirt-2",
  "description": "Stylish denim shirt for a casual look.",
  "price": 1890,
  "discount": 10,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775209/ecowear/products/mens-slim-fit-denim-shirt-2_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775209/ecowear/products/mens-slim-fit-denim-shirt-2_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775209/ecowear/products/mens-slim-fit-denim-shirt-2_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775209/ecowear/products/mens-slim-fit-denim-shirt-2_3.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa564"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 10
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 20
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 25
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 20
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 12
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 5
    }
  ],
  "tags": [
    "shirt",
    "denim",
    "men",
    "casual"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0,
  "averageRating": 5,
  "totalReviews": 1,
  "updatedAt": {
    "$date": "2026-04-02T09:34:41.968Z"
  },
  "views": 0
},
{
  "_id": {
    "$oid": "69c797f6dd74230ef1720c98"
  },
  "name": "Men's Formal Dress Shirt 10",
  "slug": "mens-formal-dress-shirt-10",
  "description": "Elegant dress shirt for formal events.",
  "price": 2090,
  "discount": 5,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773181/ecowear/products/mens-formal-dress-shirt-10_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773181/ecowear/products/mens-formal-dress-shirt-10_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773181/ecowear/products/mens-formal-dress-shirt-10_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773181/ecowear/products/mens-formal-dress-shirt-10_3.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa564"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 4
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 14
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 22
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 20
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 10
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 4
    }
  ],
  "tags": [
    "shirt",
    "formal",
    "dress",
    "men"
  ],
  "isActive": true,
  "isFeatured": true,
  "featuredOrder": 3,
  "updatedAt": {
    "$date": "2026-04-01T09:47:59.505Z"
  }
},
{
  "_id": {
    "$oid": "69c797f6dd74230ef1720ca7"
  },
  "name": "Men's Denim Shorts 5",
  "slug": "mens-denim-shorts-5",
  "description": "Casual denim shorts for summer.",
  "price": 1290,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773175/ecowear/products/mens-denim-shorts-5_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773175/ecowear/products/mens-denim-shorts-5_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773175/ecowear/products/mens-denim-shorts-5_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773175/ecowear/products/mens-denim-shorts-5_2.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa566"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 22
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 32
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 42
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 37
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 22
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 10
    }
  ],
  "tags": [
    "shorts",
    "denim",
    "summer",
    "men"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c797f6dd74230ef1720caa"
  },
  "name": "Men's Bomber Jacket 8",
  "slug": "mens-bomber-jacket-8",
  "description": "Classic bomber jacket with ribbed cuffs.",
  "price": 3290,
  "discount": 15,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773143/ecowear/products/mens-bomber-jacket-8_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773143/ecowear/products/mens-bomber-jacket-8_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773143/ecowear/products/mens-bomber-jacket-8_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773143/ecowear/products/mens-bomber-jacket-8_3.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa567"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 11
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 20
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 28
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 25
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 15
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 6
    }
  ],
  "tags": [
    "jacket",
    "bomber",
    "men",
    "casual"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0,
  "updatedAt": {
    "$date": "2026-03-31T12:40:12.533Z"
  }
},
{
  "_id": {
    "$oid": "69c797f6dd74230ef1720cb5"
  },
  "name": "Women's Off-Shoulder Top 9",
  "slug": "womens-off-shoulder-top-9",
  "description": "Trendy off-shoulder top for summer.",
  "price": 1490,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775326/ecowear/products/womens-off-shoulder-top-9_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775326/ecowear/products/womens-off-shoulder-top-9_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775326/ecowear/products/womens-off-shoulder-top-9_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775326/ecowear/products/womens-off-shoulder-top-9_4.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55d"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa569"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c74"
      },
      "stock": 28
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c75"
      },
      "stock": 38
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c76"
      },
      "stock": 48
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c77"
      },
      "stock": 42
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c78"
      },
      "stock": 28
    }
  ],
  "tags": [
    "top",
    "off-shoulder",
    "women",
    "summer"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c797f6dd74230ef1720cc2"
  },
  "name": "Boys' Hooded Sweatshirt 3",
  "slug": "boys-hooded-sweatshirt-3",
  "description": "Comfortable hoodie with kangaroo pocket.",
  "price": 1190,
  "discount": 5,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773083/ecowear/products/boys-hooded-sweatshirt-3_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773083/ecowear/products/boys-hooded-sweatshirt-3_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773083/ecowear/products/boys-hooded-sweatshirt-3_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773083/ecowear/products/boys-hooded-sweatshirt-3_1.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55e"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa56c"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c79"
      },
      "stock": 20
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7a"
      },
      "stock": 25
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7b"
      },
      "stock": 30
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7c"
      },
      "stock": 25
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7d"
      },
      "stock": 15
    }
  ],
  "tags": [
    "hoodie",
    "boys",
    "sweatshirt"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c797f6dd74230ef1720cda"
  },
  "name": "Men's Leather Sandals 5",
  "slug": "mens-leather-sandals-5",
  "description": "Comfortable leather sandals for summer.",
  "price": 1890,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775152/ecowear/products/mens-leather-sandals-5_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775152/ecowear/products/mens-leather-sandals-5_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775152/ecowear/products/mens-leather-sandals-5_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775152/ecowear/products/mens-leather-sandals-5_2.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa560"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa575"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7f"
      },
      "stock": 20
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c80"
      },
      "stock": 25
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c81"
      },
      "stock": 30
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c82"
      },
      "stock": 30
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c83"
      },
      "stock": 25
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c84"
      },
      "stock": 20
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c85"
      },
      "stock": 15
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c86"
      },
      "stock": 12
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c87"
      },
      "stock": 8
    }
  ],
  "tags": [
    "sandals",
    "leather",
    "summer",
    "men"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8e9dd74230ef1720cfe"
  },
  "name": "Men's Tapered Fit Trousers 11",
  "slug": "mens-tapered-fit-trousers-11",
  "description": "Smart tapered trousers for office wear.",
  "price": 2290,
  "discount": 5,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775222/ecowear/products/mens-tapered-fit-trousers-11_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775222/ecowear/products/mens-tapered-fit-trousers-11_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775223/ecowear/products/mens-tapered-fit-trousers-11_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775223/ecowear/products/mens-tapered-fit-trousers-11_4.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa566"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 12
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 22
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 32
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 28
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 12
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 5
    }
  ],
  "tags": [
    "trousers",
    "tapered-fit",
    "formal"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8e9dd74230ef1720d11"
  },
  "name": "Women's Denim Skirt 17",
  "slug": "womens-denim-skirt-17",
  "description": "Casual denim skirt with button front.",
  "price": 1390,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775282/ecowear/products/womens-denim-skirt-17_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775282/ecowear/products/womens-denim-skirt-17_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775283/ecowear/products/womens-denim-skirt-17_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775283/ecowear/products/womens-denim-skirt-17_1.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55d"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa56a"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c74"
      },
      "stock": 28
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c75"
      },
      "stock": 38
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c76"
      },
      "stock": 48
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c77"
      },
      "stock": 42
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c78"
      },
      "stock": 28
    }
  ],
  "tags": [
    "skirt",
    "denim",
    "women"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8e9dd74230ef1720d12"
  },
  "name": "Women's Leather Skirt 18",
  "slug": "womens-leather-skirt-18",
  "description": "Edgy faux leather skirt.",
  "price": 2190,
  "discount": 15,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775318/ecowear/products/womens-leather-skirt-18_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775318/ecowear/products/womens-leather-skirt-18_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775318/ecowear/products/womens-leather-skirt-18_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775319/ecowear/products/womens-leather-skirt-18_1.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55d"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa56a"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c74"
      },
      "stock": 16
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c75"
      },
      "stock": 26
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c76"
      },
      "stock": 36
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c77"
      },
      "stock": 31
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c78"
      },
      "stock": 16
    }
  ],
  "tags": [
    "skirt",
    "leather",
    "women"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8e9dd74230ef1720d29"
  },
  "name": "Fabric Belt 14",
  "slug": "fabric-belt-14",
  "description": "Woven fabric belt with adjustable clip.",
  "price": 590,
  "discount": 10,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773102/ecowear/products/fabric-belt-14_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773104/ecowear/products/fabric-belt-14_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773102/ecowear/products/fabric-belt-14_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773102/ecowear/products/fabric-belt-14_4.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55f"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa570"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7e"
      },
      "stock": 58
    }
  ],
  "tags": [
    "belt",
    "fabric",
    "casual"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8eadd74230ef1720d31"
  },
  "name": "Women's Pumps 12",
  "slug": "womens-pumps-12",
  "description": "Elegant pumps with pointed toe.",
  "price": 2790,
  "discount": 5,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775332/ecowear/products/womens-pumps-12_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775332/ecowear/products/womens-pumps-12_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775332/ecowear/products/womens-pumps-12_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775332/ecowear/products/womens-pumps-12_3.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa560"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa574"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7f"
      },
      "stock": 13
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c80"
      },
      "stock": 17
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c81"
      },
      "stock": 21
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c82"
      },
      "stock": 21
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c83"
      },
      "stock": 17
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c84"
      },
      "stock": 13
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c85"
      },
      "stock": 9
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c86"
      },
      "stock": 7
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c87"
      },
      "stock": 4
    }
  ],
  "tags": [
    "pumps",
    "heels",
    "women",
    "formal"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8e9dd74230ef1720cee"
  },
  "name": "Men's Flannel Winter Shirt 18",
  "slug": "mens-flannel-winter-shirt-18",
  "description": "Warm flannel shirt for chilly days.",
  "price": 1790,
  "discount": 10,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773177/ecowear/products/mens-flannel-winter-shirt-18_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773177/ecowear/products/mens-flannel-winter-shirt-18_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773177/ecowear/products/mens-flannel-winter-shirt-18_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773177/ecowear/products/mens-flannel-winter-shirt-18_2.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa564"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 12
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 18
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 22
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 20
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 10
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 5
    }
  ],
  "tags": [
    "shirt",
    "flannel",
    "winter"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8e9dd74230ef1720cf2"
  },
  "name": "Men's Graphic Printed T-Shirt 12",
  "slug": "mens-graphic-printed-t-shirt-12",
  "description": "Trendy graphic print t-shirt.",
  "price": 790,
  "discount": 10,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773185/ecowear/products/mens-graphic-printed-t-shirt-12_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773185/ecowear/products/mens-graphic-printed-t-shirt-12_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773185/ecowear/products/mens-graphic-printed-t-shirt-12_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773185/ecowear/products/mens-graphic-printed-t-shirt-12_2.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa565"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 35
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 45
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 55
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 50
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 30
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 15
    }
  ],
  "tags": [
    "t-shirt",
    "graphic",
    "men"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8e9dd74230ef1720d13"
  },
  "name": "Women's High-Waisted Trousers 19",
  "slug": "womens-high-waisted-trousers-19",
  "description": "Tailored high-waisted trousers for office.",
  "price": 2090,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775309/ecowear/products/womens-high-waisted-trousers-19_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775309/ecowear/products/womens-high-waisted-trousers-19_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775309/ecowear/products/womens-high-waisted-trousers-19_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775309/ecowear/products/womens-high-waisted-trousers-19_3.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55d"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa56b"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c74"
      },
      "stock": 18
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c75"
      },
      "stock": 28
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c76"
      },
      "stock": 38
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c77"
      },
      "stock": 33
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c78"
      },
      "stock": 18
    }
  ],
  "tags": [
    "trousers",
    "high-waisted",
    "women"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8e9dd74230ef1720d1a"
  },
  "name": "Boys' Hooded Sweatshirt 8",
  "slug": "boys-hooded-sweatshirt-8",
  "description": "Comfortable hoodie with kangaroo pocket.",
  "price": 1190,
  "discount": 5,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773085/ecowear/products/boys-hooded-sweatshirt-8_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773084/ecowear/products/boys-hooded-sweatshirt-8_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773084/ecowear/products/boys-hooded-sweatshirt-8_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773084/ecowear/products/boys-hooded-sweatshirt-8_3.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55e"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa56c"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c79"
      },
      "stock": 18
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7a"
      },
      "stock": 23
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7b"
      },
      "stock": 28
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7c"
      },
      "stock": 23
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7d"
      },
      "stock": 14
    }
  ],
  "tags": [
    "hoodie",
    "boys",
    "sweatshirt"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8e9dd74230ef1720d1c"
  },
  "name": "Boys' Polo Shirt 10",
  "slug": "boys-polo-shirt-10",
  "description": "Classic polo shirt for school.",
  "price": 790,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773086/ecowear/products/boys-polo-shirt-10_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773086/ecowear/products/boys-polo-shirt-10_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773086/ecowear/products/boys-polo-shirt-10_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773086/ecowear/products/boys-polo-shirt-10_1.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55e"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa56c"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c79"
      },
      "stock": 32
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7a"
      },
      "stock": 37
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7b"
      },
      "stock": 42
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7c"
      },
      "stock": 37
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7d"
      },
      "stock": 27
    }
  ],
  "tags": [
    "polo",
    "boys",
    "shirt"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8e9dd74230ef1720d23"
  },
  "name": "Baby Hooded Towel 7",
  "slug": "baby-hooded-towel-7",
  "description": "Soft hooded towel for bath time.",
  "price": 790,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773061/ecowear/products/baby-hooded-towel-7_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773061/ecowear/products/baby-hooded-towel-7_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773061/ecowear/products/baby-hooded-towel-7_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773062/ecowear/products/baby-hooded-towel-7_1.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55e"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa56e"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c79"
      },
      "stock": 38
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7a"
      },
      "stock": 43
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7b"
      },
      "stock": 48
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7c"
      },
      "stock": 43
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7d"
      },
      "stock": 33
    }
  ],
  "tags": [
    "baby",
    "towel",
    "hooded"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8e9dd74230ef1720d24"
  },
  "name": "Baby Bodysuit Pack 8",
  "slug": "baby-bodysuit-pack-8",
  "description": "Pack of 3 organic cotton bodysuits.",
  "price": 990,
  "discount": 10,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774772976/ecowear/products/baby-bodysuit-pack-8_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774772975/ecowear/products/baby-bodysuit-pack-8_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774772975/ecowear/products/baby-bodysuit-pack-8_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774772976/ecowear/products/baby-bodysuit-pack-8_3.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55e"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa56e"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c79"
      },
      "stock": 33
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7a"
      },
      "stock": 38
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7b"
      },
      "stock": 43
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7c"
      },
      "stock": 38
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7d"
      },
      "stock": 28
    }
  ],
  "tags": [
    "baby",
    "bodysuit",
    "pack"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8e9dd74230ef1720ce8"
  },
  "name": "Men's Slim Fit Denim Shirt 12",
  "slug": "mens-slim-fit-denim-shirt-12",
  "description": "Stylish denim shirt for a casual look.",
  "price": 1790,
  "discount": 10,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775207/ecowear/products/mens-slim-fit-denim-shirt-12_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775207/ecowear/products/mens-slim-fit-denim-shirt-12_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775207/ecowear/products/mens-slim-fit-denim-shirt-12_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775207/ecowear/products/mens-slim-fit-denim-shirt-12_4.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa564"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 12
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 18
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 22
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 20
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 10
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 5
    }
  ],
  "tags": [
    "shirt",
    "denim",
    "men"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8e9dd74230ef1720d0d"
  },
  "name": "Women's Off-Shoulder Top 13",
  "slug": "womens-off-shoulder-top-13",
  "description": "Trendy off-shoulder top for summer.",
  "price": 1490,
  "discount": 0,
  "images": [],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55d"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa569"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c74"
      },
      "stock": 26
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c75"
      },
      "stock": 36
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c76"
      },
      "stock": 46
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c77"
      },
      "stock": 40
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c78"
      },
      "stock": 26
    }
  ],
  "tags": [
    "top",
    "off-shoulder",
    "women"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8eadd74230ef1720d38"
  },
  "name": "Men's Training Shorts 10",
  "slug": "mens-training-shorts-10",
  "description": "Lightweight shorts with built-in liner.",
  "price": 1190,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775227/ecowear/products/mens-training-shorts-10_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775227/ecowear/products/mens-training-shorts-10_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775227/ecowear/products/mens-training-shorts-10_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775227/ecowear/products/mens-training-shorts-10_2.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa561"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa578"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c88"
      },
      "stock": 28
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c89"
      },
      "stock": 33
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c8a"
      },
      "stock": 38
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c8b"
      },
      "stock": 33
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c8c"
      },
      "stock": 23
    }
  ],
  "tags": [
    "shorts",
    "training",
    "men"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8e9dd74230ef1720cf4"
  },
  "name": "Men's Premium Polo T-Shirt 14",
  "slug": "mens-premium-polo-t-shirt-14",
  "description": "High-quality polo shirt with embroidered logo.",
  "price": 1290,
  "discount": 15,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775177/ecowear/products/mens-premium-polo-t-shirt-14_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775177/ecowear/products/mens-premium-polo-t-shirt-14_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775177/ecowear/products/mens-premium-polo-t-shirt-14_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775177/ecowear/products/mens-premium-polo-t-shirt-14_2.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa565"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 18
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 28
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 38
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 33
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 18
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 8
    }
  ],
  "tags": [
    "polo",
    "t-shirt",
    "premium"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8e9dd74230ef1720d04"
  },
  "name": "Men's Denim Jacket 17",
  "slug": "mens-denim-jacket-17",
  "description": "Classic denim jacket for everyday wear.",
  "price": 2790,
  "discount": 10,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773170/ecowear/products/mens-denim-jacket-17_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773170/ecowear/products/mens-denim-jacket-17_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773170/ecowear/products/mens-denim-jacket-17_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773170/ecowear/products/mens-denim-jacket-17_1.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa567"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 15
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 25
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 35
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 30
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 18
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 8
    }
  ],
  "tags": [
    "jacket",
    "denim",
    "men"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8e9dd74230ef1720d07"
  },
  "name": "Women's Wrap Dress 9",
  "slug": "womens-wrap-dress-9",
  "description": "Flattering wrap dress with belt.",
  "price": 2190,
  "discount": 10,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775372/ecowear/products/womens-wrap-dress-9_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775372/ecowear/products/womens-wrap-dress-9_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775372/ecowear/products/womens-wrap-dress-9_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775372/ecowear/products/womens-wrap-dress-9_3.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55d"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa568"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c74"
      },
      "stock": 16
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c75"
      },
      "stock": 26
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c76"
      },
      "stock": 36
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c77"
      },
      "stock": 31
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c78"
      },
      "stock": 16
    }
  ],
  "tags": [
    "dress",
    "wrap",
    "women"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8e9dd74230ef1720d14"
  },
  "name": "Women's Wide Leg Pants 20",
  "slug": "womens-wide-leg-pants-20",
  "description": "Flowy wide leg pants in crepe.",
  "price": 1890,
  "discount": 10,
  "images": [],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55d"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa56b"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c74"
      },
      "stock": 23
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c75"
      },
      "stock": 33
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c76"
      },
      "stock": 43
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c77"
      },
      "stock": 38
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c78"
      },
      "stock": 23
    }
  ],
  "tags": [
    "pants",
    "wide-leg",
    "women"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8e9dd74230ef1720d19"
  },
  "name": "Boys' Denim Jeans 7",
  "slug": "boys-denim-jeans-7",
  "description": "Sturdy denim jeans for active kids.",
  "price": 990,
  "discount": 10,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773075/ecowear/products/boys-denim-jeans-7_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773074/ecowear/products/boys-denim-jeans-7_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773076/ecowear/products/boys-denim-jeans-7_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773076/ecowear/products/boys-denim-jeans-7_4.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55e"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa56c"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c79"
      },
      "stock": 23
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7a"
      },
      "stock": 28
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7b"
      },
      "stock": 33
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7c"
      },
      "stock": 28
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7d"
      },
      "stock": 18
    }
  ],
  "tags": [
    "jeans",
    "boys",
    "denim"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8e9dd74230ef1720d1f"
  },
  "name": "Girls' Tutu Skirt 7",
  "slug": "girls-tutu-skirt-7",
  "description": "Fun and fluffy tutu skirt.",
  "price": 690,
  "discount": 5,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773123/ecowear/products/girls-tutu-skirt-7_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773122/ecowear/products/girls-tutu-skirt-7_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773122/ecowear/products/girls-tutu-skirt-7_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773122/ecowear/products/girls-tutu-skirt-7_3.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55e"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa56d"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c79"
      },
      "stock": 38
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7a"
      },
      "stock": 43
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7b"
      },
      "stock": 48
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7c"
      },
      "stock": 43
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7d"
      },
      "stock": 33
    }
  ],
  "tags": [
    "skirt",
    "tutu",
    "girls"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8eadd74230ef1720d32"
  },
  "name": "Men's Leather Sandals 13",
  "slug": "mens-leather-sandals-13",
  "description": "Comfortable leather sandals for summer.",
  "price": 1890,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775148/ecowear/products/mens-leather-sandals-13_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775148/ecowear/products/mens-leather-sandals-13_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775148/ecowear/products/mens-leather-sandals-13_3.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa560"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa575"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7f"
      },
      "stock": 19
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c80"
      },
      "stock": 24
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c81"
      },
      "stock": 29
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c82"
      },
      "stock": 29
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c83"
      },
      "stock": 24
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c84"
      },
      "stock": 19
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c85"
      },
      "stock": 14
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c86"
      },
      "stock": 11
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c87"
      },
      "stock": 7
    }
  ],
  "tags": [
    "sandals",
    "leather",
    "summer",
    "men"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8eadd74230ef1720d37"
  },
  "name": "Women's Racerback Tank 9",
  "slug": "womens-racerback-tank-9",
  "description": "Breathable racerback tank for yoga.",
  "price": 990,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775340/ecowear/products/womens-racerback-tank-9_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775340/ecowear/products/womens-racerback-tank-9_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775340/ecowear/products/womens-racerback-tank-9_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775341/ecowear/products/womens-racerback-tank-9_2.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa561"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa577"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c88"
      },
      "stock": 33
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c89"
      },
      "stock": 38
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c8a"
      },
      "stock": 43
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c8b"
      },
      "stock": 38
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c8c"
      },
      "stock": 28
    }
  ],
  "tags": [
    "activewear",
    "tank",
    "women"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8eadd74230ef1720d3a"
  },
  "name": "Women's Sports Bra 12",
  "slug": "womens-sports-bra-12",
  "description": "Medium support sports bra for gym.",
  "price": 1290,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775356/ecowear/products/womens-sports-bra-12_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775356/ecowear/products/womens-sports-bra-12_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775356/ecowear/products/womens-sports-bra-12_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775356/ecowear/products/womens-sports-bra-12_2.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa561"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa579"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c88"
      },
      "stock": 33
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c89"
      },
      "stock": 38
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c8a"
      },
      "stock": 43
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c8b"
      },
      "stock": 38
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c8c"
      },
      "stock": 28
    }
  ],
  "tags": [
    "sports-bra",
    "activewear",
    "women"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8e9dd74230ef1720cf8"
  },
  "name": "Men's Ringer T-Shirt 18",
  "slug": "mens-ringer-t-shirt-18",
  "description": "Retro style with contrast collar and sleeve trim.",
  "price": 790,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775195/ecowear/products/mens-ringer-t-shirt-18_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775195/ecowear/products/mens-ringer-t-shirt-18_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775195/ecowear/products/mens-ringer-t-shirt-18_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775195/ecowear/products/mens-ringer-t-shirt-18_1.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa565"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 22
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 32
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 42
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 37
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 22
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 10
    }
  ],
  "tags": [
    "t-shirt",
    "ringer",
    "retro"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8e9dd74230ef1720cfc"
  },
  "name": "Men's Relaxed Fit Chinos 9",
  "slug": "mens-relaxed-fit-chinos-9",
  "description": "Comfortable chinos for casual wear.",
  "price": 1690,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775193/ecowear/products/mens-relaxed-fit-chinos-9_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775193/ecowear/products/mens-relaxed-fit-chinos-9_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775193/ecowear/products/mens-relaxed-fit-chinos-9_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775194/ecowear/products/mens-relaxed-fit-chinos-9_2.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa566"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 22
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 32
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 42
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 37
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 22
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 10
    }
  ],
  "tags": [
    "chinos",
    "relaxed-fit",
    "men"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8e9dd74230ef1720d10"
  },
  "name": "Women's Pleated Midi Skirt 16",
  "slug": "womens-pleated-midi-skirt-16",
  "description": "Elegant pleated midi skirt.",
  "price": 1890,
  "discount": 10,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775329/ecowear/products/womens-pleated-midi-skirt-16_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775329/ecowear/products/womens-pleated-midi-skirt-16_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775329/ecowear/products/womens-pleated-midi-skirt-16_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775329/ecowear/products/womens-pleated-midi-skirt-16_1.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55d"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa56a"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c74"
      },
      "stock": 18
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c75"
      },
      "stock": 28
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c76"
      },
      "stock": 38
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c77"
      },
      "stock": 33
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c78"
      },
      "stock": 18
    }
  ],
  "tags": [
    "skirt",
    "pleated",
    "midi"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8e9dd74230ef1720ce7"
  },
  "name": "Men's Classic Fit Cotton Shirt 11",
  "slug": "mens-classic-fit-cotton-shirt-11",
  "description": "A high-quality cotton shirt perfect for formal or casual occasions.",
  "price": 1290,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773157/ecowear/products/mens-classic-fit-cotton-shirt-11_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773157/ecowear/products/mens-classic-fit-cotton-shirt-11_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773157/ecowear/products/mens-classic-fit-cotton-shirt-11_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773157/ecowear/products/mens-classic-fit-cotton-shirt-11_3.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa564"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 20
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 25
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 30
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 28
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 15
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 8
    }
  ],
  "tags": [
    "shirt",
    "cotton",
    "men"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8e9dd74230ef1720cf9"
  },
  "name": "Men's Long Sleeve T-Shirt 19",
  "slug": "mens-long-sleeve-t-shirt-19",
  "description": "Long sleeve for cooler weather.",
  "price": 890,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775157/ecowear/products/mens-long-sleeve-t-shirt-19_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775157/ecowear/products/mens-long-sleeve-t-shirt-19_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775157/ecowear/products/mens-long-sleeve-t-shirt-19_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775157/ecowear/products/mens-long-sleeve-t-shirt-19_3.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa565"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 25
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 35
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 45
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 40
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 22
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 12
    }
  ],
  "tags": [
    "t-shirt",
    "long-sleeve",
    "men"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8e9dd74230ef1720cfa"
  },
  "name": "Men's Slim Fit T-Shirt 20",
  "slug": "mens-slim-fit-t-shirt-20",
  "description": "Modern slim fit for a tailored look.",
  "price": 790,
  "discount": 5,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775215/ecowear/products/mens-slim-fit-t-shirt-20_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775215/ecowear/products/mens-slim-fit-t-shirt-20_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775215/ecowear/products/mens-slim-fit-t-shirt-20_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775215/ecowear/products/mens-slim-fit-t-shirt-20_1.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa565"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 30
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 40
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 50
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 45
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 25
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 12
    }
  ],
  "tags": [
    "t-shirt",
    "slim-fit",
    "men"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8e9dd74230ef1720d0c"
  },
  "name": "Women's Silk Camisole 12",
  "slug": "womens-silk-camisole-12",
  "description": "Luxurious silk camisole for layering.",
  "price": 1790,
  "discount": 10,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775342/ecowear/products/womens-silk-camisole-12_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775342/ecowear/products/womens-silk-camisole-12_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775342/ecowear/products/womens-silk-camisole-12_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775342/ecowear/products/womens-silk-camisole-12_2.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55d"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa569"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c74"
      },
      "stock": 18
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c75"
      },
      "stock": 28
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c76"
      },
      "stock": 38
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c77"
      },
      "stock": 33
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c78"
      },
      "stock": 18
    }
  ],
  "tags": [
    "camisole",
    "silk",
    "women"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8e9dd74230ef1720d1e"
  },
  "name": "Girls' Denim Jacket 6",
  "slug": "girls-denim-jacket-6",
  "description": "Stylish denim jacket for girls.",
  "price": 1290,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773112/ecowear/products/girls-denim-jacket-6_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773112/ecowear/products/girls-denim-jacket-6_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773111/ecowear/products/girls-denim-jacket-6_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773112/ecowear/products/girls-denim-jacket-6_4.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55e"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa56d"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c79"
      },
      "stock": 18
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7a"
      },
      "stock": 23
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7b"
      },
      "stock": 28
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7c"
      },
      "stock": 23
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7d"
      },
      "stock": 16
    }
  ],
  "tags": [
    "jacket",
    "denim",
    "girls"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8e9dd74230ef1720d21"
  },
  "name": "Baby Cotton Romper 5",
  "slug": "baby-cotton-romper-5",
  "description": "Soft cotton romper for babies.",
  "price": 590,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774772975/ecowear/products/baby-cotton-romper-5_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774772975/ecowear/products/baby-cotton-romper-5_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774772975/ecowear/products/baby-cotton-romper-5_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774772976/ecowear/products/baby-cotton-romper-5_2.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55e"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa56e"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c79"
      },
      "stock": 28
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7a"
      },
      "stock": 33
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7b"
      },
      "stock": 38
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7c"
      },
      "stock": 33
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7d"
      },
      "stock": 23
    }
  ],
  "tags": [
    "baby",
    "romper",
    "cotton"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8eadd74230ef1720d34"
  },
  "name": "Men's Hiking Boots 15",
  "slug": "mens-hiking-boots-15",
  "description": "Durable waterproof hiking boots.",
  "price": 3990,
  "discount": 15,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775141/ecowear/products/mens-hiking-boots-15_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775142/ecowear/products/mens-hiking-boots-15_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775142/ecowear/products/mens-hiking-boots-15_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775141/ecowear/products/mens-hiking-boots-15_1.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa560"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa576"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7f"
      },
      "stock": 9
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c80"
      },
      "stock": 13
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c81"
      },
      "stock": 17
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c82"
      },
      "stock": 17
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c83"
      },
      "stock": 13
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c84"
      },
      "stock": 9
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c85"
      },
      "stock": 7
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c86"
      },
      "stock": 5
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c87"
      },
      "stock": 3
    }
  ],
  "tags": [
    "boots",
    "hiking",
    "outdoor",
    "men"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8eadd74230ef1720d39"
  },
  "name": "Women's High-Waisted Leggings 11",
  "slug": "womens-high-waisted-leggings-11",
  "description": "Squat-proof leggings with tummy control.",
  "price": 1490,
  "discount": 10,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775303/ecowear/products/womens-high-waisted-leggings-11_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775303/ecowear/products/womens-high-waisted-leggings-11_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775303/ecowear/products/womens-high-waisted-leggings-11_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775303/ecowear/products/womens-high-waisted-leggings-11_4.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa561"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa578"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c88"
      },
      "stock": 38
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c89"
      },
      "stock": 43
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c8a"
      },
      "stock": 48
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c8b"
      },
      "stock": 43
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c8c"
      },
      "stock": 33
    }
  ],
  "tags": [
    "leggings",
    "high-waisted",
    "women"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8eadd74230ef1720d3b"
  },
  "name": "Men's Waterproof Jacket 13",
  "slug": "mens-waterproof-jacket-13",
  "description": "Waterproof and breathable shell jacket.",
  "price": 3290,
  "discount": 20,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775237/ecowear/products/mens-waterproof-jacket-13_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775237/ecowear/products/mens-waterproof-jacket-13_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775237/ecowear/products/mens-waterproof-jacket-13_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775237/ecowear/products/mens-waterproof-jacket-13_1.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa561"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa57a"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c88"
      },
      "stock": 17
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c89"
      },
      "stock": 21
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c8a"
      },
      "stock": 26
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c8b"
      },
      "stock": 23
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c8c"
      },
      "stock": 14
    }
  ],
  "tags": [
    "jacket",
    "waterproof",
    "outdoor",
    "men"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8e9dd74230ef1720cf3"
  },
  "name": "Men's V-Neck T-Shirt 13",
  "slug": "mens-v-neck-t-shirt-13",
  "description": "Classic V-neck t-shirt in various colors.",
  "price": 690,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775232/ecowear/products/mens-v-neck-t-shirt-13_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775232/ecowear/products/mens-v-neck-t-shirt-13_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775232/ecowear/products/mens-v-neck-t-shirt-13_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775232/ecowear/products/mens-v-neck-t-shirt-13_4.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa565"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 40
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 50
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 65
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 60
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 35
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 18
    }
  ],
  "tags": [
    "t-shirt",
    "v-neck",
    "men"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8e9dd74230ef1720d06"
  },
  "name": "Women's Little Black Dress 8",
  "slug": "womens-little-black-dress-8",
  "description": "Classic little black dress for any occasion.",
  "price": 2490,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775323/ecowear/products/womens-little-black-dress-8_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775324/ecowear/products/womens-little-black-dress-8_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775324/ecowear/products/womens-little-black-dress-8_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775324/ecowear/products/womens-little-black-dress-8_1.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55d"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa568"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c74"
      },
      "stock": 18
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c75"
      },
      "stock": 28
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c76"
      },
      "stock": 38
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c77"
      },
      "stock": 33
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c78"
      },
      "stock": 18
    }
  ],
  "tags": [
    "dress",
    "little-black-dress",
    "women"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8e9dd74230ef1720d0b"
  },
  "name": "Women's Cotton Blouse 11",
  "slug": "womens-cotton-blouse-11",
  "description": "Lightweight cotton blouse with embroidery.",
  "price": 1290,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775270/ecowear/products/womens-cotton-blouse-11_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775270/ecowear/products/womens-cotton-blouse-11_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775271/ecowear/products/womens-cotton-blouse-11_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775272/ecowear/products/womens-cotton-blouse-11_2.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55d"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa569"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c74"
      },
      "stock": 28
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c75"
      },
      "stock": 38
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c76"
      },
      "stock": 48
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c77"
      },
      "stock": 42
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c78"
      },
      "stock": 28
    }
  ],
  "tags": [
    "blouse",
    "cotton",
    "women"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8e9dd74230ef1720d1b"
  },
  "name": "Boys' Cargo Pants 9",
  "slug": "boys-cargo-pants-9",
  "description": "Utility cargo pants with multiple pockets.",
  "price": 1090,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773070/ecowear/products/boys-cargo-pants-9_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773070/ecowear/products/boys-cargo-pants-9_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773070/ecowear/products/boys-cargo-pants-9_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773070/ecowear/products/boys-cargo-pants-9_4.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55e"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa56c"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c79"
      },
      "stock": 20
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7a"
      },
      "stock": 25
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7b"
      },
      "stock": 30
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7c"
      },
      "stock": 25
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7d"
      },
      "stock": 16
    }
  ],
  "tags": [
    "cargo",
    "pants",
    "boys"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8e9dd74230ef1720d27"
  },
  "name": "Crossbody Bag 12",
  "slug": "crossbody-bag-12",
  "description": "Compact crossbody bag with adjustable strap.",
  "price": 1490,
  "discount": 5,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773097/ecowear/products/crossbody-bag-12_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773097/ecowear/products/crossbody-bag-12_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773097/ecowear/products/crossbody-bag-12_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773097/ecowear/products/crossbody-bag-12_2.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55f"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa56f"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7e"
      },
      "stock": 38
    }
  ],
  "tags": [
    "bag",
    "crossbody",
    "casual"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8eadd74230ef1720d36"
  },
  "name": "Men's Compression Shirt 8",
  "slug": "mens-compression-shirt-8",
  "description": "Moisture-wicking compression top for workouts.",
  "price": 1290,
  "discount": 5,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773163/ecowear/products/mens-compression-shirt-8_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773163/ecowear/products/mens-compression-shirt-8_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773163/ecowear/products/mens-compression-shirt-8_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773163/ecowear/products/mens-compression-shirt-8_3.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa561"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa577"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c88"
      },
      "stock": 23
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c89"
      },
      "stock": 28
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c8a"
      },
      "stock": 33
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c8b"
      },
      "stock": 28
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c8c"
      },
      "stock": 18
    }
  ],
  "tags": [
    "activewear",
    "compression",
    "men"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8e9dd74230ef1720ced"
  },
  "name": "Men's Checkered Casual Shirt 17",
  "slug": "mens-checkered-casual-shirt-17",
  "description": "Checkered pattern for a relaxed weekend look.",
  "price": 1390,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773153/ecowear/products/mens-checkered-casual-shirt-17_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773153/ecowear/products/mens-checkered-casual-shirt-17_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773153/ecowear/products/mens-checkered-casual-shirt-17_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773153/ecowear/products/mens-checkered-casual-shirt-17_3.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa564"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 18
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 25
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 30
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 28
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 15
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 8
    }
  ],
  "tags": [
    "shirt",
    "checkered",
    "men"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8e9dd74230ef1720cef"
  },
  "name": "Men's Short Sleeve Shirt 19",
  "slug": "mens-short-sleeve-shirt-19",
  "description": "Comfortable short sleeve shirt for summer.",
  "price": 1190,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775204/ecowear/products/mens-short-sleeve-shirt-19_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775204/ecowear/products/mens-short-sleeve-shirt-19_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775204/ecowear/products/mens-short-sleeve-shirt-19_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775204/ecowear/products/mens-short-sleeve-shirt-19_2.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa564"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 25
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 30
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 35
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 32
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 20
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 10
    }
  ],
  "tags": [
    "shirt",
    "short-sleeve",
    "men"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8e9dd74230ef1720cf0"
  },
  "name": "Men's Formal Dress Shirt 20",
  "slug": "mens-formal-dress-shirt-20",
  "description": "Elegant dress shirt for formal events.",
  "price": 2090,
  "discount": 5,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773182/ecowear/products/mens-formal-dress-shirt-20_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773182/ecowear/products/mens-formal-dress-shirt-20_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773182/ecowear/products/mens-formal-dress-shirt-20_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773182/ecowear/products/mens-formal-dress-shirt-20_3.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa564"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 8
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 14
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 18
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 16
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 8
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 4
    }
  ],
  "tags": [
    "shirt",
    "formal",
    "dress"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8e9dd74230ef1720cf1"
  },
  "name": "Men's Cotton T-Shirt 11",
  "slug": "mens-cotton-t-shirt-11",
  "description": "Soft 100% cotton t-shirt for everyday wear.",
  "price": 590,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773165/ecowear/products/mens-cotton-t-shirt-11_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773165/ecowear/products/mens-cotton-t-shirt-11_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773165/ecowear/products/mens-cotton-t-shirt-11_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773165/ecowear/products/mens-cotton-t-shirt-11_2.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa565"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 45
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 55
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 70
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 65
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 40
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 20
    }
  ],
  "tags": [
    "t-shirt",
    "cotton",
    "men"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8e9dd74230ef1720d17"
  },
  "name": "Women's Cotton Linen Pants 23",
  "slug": "womens-cotton-linen-pants-23",
  "description": "Breathable cotton-linen blend for summer.",
  "price": 1690,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775278/ecowear/products/womens-cotton-linen-pants-23_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775278/ecowear/products/womens-cotton-linen-pants-23_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775278/ecowear/products/womens-cotton-linen-pants-23_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775278/ecowear/products/womens-cotton-linen-pants-23_4.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55d"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa56b"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c74"
      },
      "stock": 25
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c75"
      },
      "stock": 35
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c76"
      },
      "stock": 45
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c77"
      },
      "stock": 40
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c78"
      },
      "stock": 25
    }
  ],
  "tags": [
    "pants",
    "linen",
    "summer"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8e9dd74230ef1720d18"
  },
  "name": "Boys' Graphic T-Shirt 6",
  "slug": "boys-graphic-t-shirt-6",
  "description": "Cool graphic t-shirt for boys.",
  "price": 590,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773080/ecowear/products/boys-graphic-t-shirt-6_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773080/ecowear/products/boys-graphic-t-shirt-6_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773080/ecowear/products/boys-graphic-t-shirt-6_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773080/ecowear/products/boys-graphic-t-shirt-6_3.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55e"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa56c"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c79"
      },
      "stock": 28
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7a"
      },
      "stock": 33
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7b"
      },
      "stock": 38
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7c"
      },
      "stock": 33
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7d"
      },
      "stock": 23
    }
  ],
  "tags": [
    "t-shirt",
    "boys",
    "graphic"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8e9dd74230ef1720d22"
  },
  "name": "Baby Footed Pajamas 6",
  "slug": "baby-footed-pajamas-6",
  "description": "Cozy footed pajamas with zipper.",
  "price": 690,
  "discount": 5,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774772976/ecowear/products/baby-footed-pajamas-6_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774772976/ecowear/products/baby-footed-pajamas-6_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774772990/ecowear/products/baby-footed-pajamas-6_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774772976/ecowear/products/baby-footed-pajamas-6_2.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55e"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa56e"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c79"
      },
      "stock": 26
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7a"
      },
      "stock": 31
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7b"
      },
      "stock": 36
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7c"
      },
      "stock": 31
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7d"
      },
      "stock": 21
    }
  ],
  "tags": [
    "baby",
    "pajamas",
    "footed"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8e9dd74230ef1720d28"
  },
  "name": "Leather Belt 13",
  "slug": "leather-belt-13",
  "description": "Genuine leather belt with metal buckle.",
  "price": 890,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773125/ecowear/products/leather-belt-13_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773124/ecowear/products/leather-belt-13_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773124/ecowear/products/leather-belt-13_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773124/ecowear/products/leather-belt-13_1.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55f"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa570"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7e"
      },
      "stock": 48
    }
  ],
  "tags": [
    "belt",
    "leather",
    "accessory"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8eadd74230ef1720d30"
  },
  "name": "Men's Oxford Shoes 11",
  "slug": "mens-oxford-shoes-11",
  "description": "Classic leather oxford shoes for formal wear.",
  "price": 3290,
  "discount": 10,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775171/ecowear/products/mens-oxford-shoes-11_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775171/ecowear/products/mens-oxford-shoes-11_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775171/ecowear/products/mens-oxford-shoes-11_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775171/ecowear/products/mens-oxford-shoes-11_1.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa560"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa574"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7f"
      },
      "stock": 11
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c80"
      },
      "stock": 15
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c81"
      },
      "stock": 19
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c82"
      },
      "stock": 19
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c83"
      },
      "stock": 15
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c84"
      },
      "stock": 11
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c85"
      },
      "stock": 7
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c86"
      },
      "stock": 5
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c87"
      },
      "stock": 3
    }
  ],
  "tags": [
    "shoes",
    "oxford",
    "formal",
    "men"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8e9dd74230ef1720ce9"
  },
  "name": "Men's Oxford Button-Down Shirt 13",
  "slug": "mens-oxford-button-down-shirt-13",
  "description": "Classic Oxford shirt with button-down collar.",
  "price": 1590,
  "discount": 5,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775166/ecowear/products/mens-oxford-button-down-shirt-13_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775166/ecowear/products/mens-oxford-button-down-shirt-13_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775166/ecowear/products/mens-oxford-button-down-shirt-13_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775166/ecowear/products/mens-oxford-button-down-shirt-13_1.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa564"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 10
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 16
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 20
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 18
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 10
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 5
    }
  ],
  "tags": [
    "shirt",
    "oxford",
    "men"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8e9dd74230ef1720cf6"
  },
  "name": "Men's Athletic T-Shirt 16",
  "slug": "mens-athletic-t-shirt-16",
  "description": "Moisture-wicking fabric for sports activities.",
  "price": 990,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773136/ecowear/products/mens-athletic-t-shirt-16_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773136/ecowear/products/mens-athletic-t-shirt-16_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773136/ecowear/products/mens-athletic-t-shirt-16_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773136/ecowear/products/mens-athletic-t-shirt-16_1.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa565"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 32
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 42
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 52
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 47
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 28
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 14
    }
  ],
  "tags": [
    "t-shirt",
    "athletic",
    "sport"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8e9dd74230ef1720cfb"
  },
  "name": "Men's Slim Fit Jeans 8",
  "slug": "mens-slim-fit-jeans-8",
  "description": "Classic slim fit denim jeans.",
  "price": 1890,
  "discount": 10,
  "images": [],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa566"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 18
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 28
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 38
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 33
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 18
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 8
    }
  ],
  "tags": [
    "jeans",
    "slim-fit",
    "denim"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8e9dd74230ef1720cff"
  },
  "name": "Men's Denim Shorts 12",
  "slug": "mens-denim-shorts-12",
  "description": "Casual denim shorts for summer.",
  "price": 1290,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773172/ecowear/products/mens-denim-shorts-12_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773172/ecowear/products/mens-denim-shorts-12_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773172/ecowear/products/mens-denim-shorts-12_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773172/ecowear/products/mens-denim-shorts-12_2.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa566"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 20
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 30
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 40
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 35
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 20
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 8
    }
  ],
  "tags": [
    "shorts",
    "denim",
    "summer"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8e9dd74230ef1720d16"
  },
  "name": "Women's Jogger Pants 22",
  "slug": "womens-jogger-pants-22",
  "description": "Comfortable joggers with elastic waist.",
  "price": 1490,
  "discount": 5,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775314/ecowear/products/womens-jogger-pants-22_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775314/ecowear/products/womens-jogger-pants-22_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775314/ecowear/products/womens-jogger-pants-22_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775314/ecowear/products/womens-jogger-pants-22_3.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55d"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa56b"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c74"
      },
      "stock": 32
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c75"
      },
      "stock": 42
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c76"
      },
      "stock": 52
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c77"
      },
      "stock": 47
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c78"
      },
      "stock": 32
    }
  ],
  "tags": [
    "joggers",
    "casual",
    "women"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8e9dd74230ef1720d2e"
  },
  "name": "Men's Running Sneakers 9",
  "slug": "mens-running-sneakers-9",
  "description": "Lightweight running sneakers with cushioning.",
  "price": 2490,
  "discount": 15,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775202/ecowear/products/mens-running-sneakers-9_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775202/ecowear/products/mens-running-sneakers-9_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775202/ecowear/products/mens-running-sneakers-9_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775202/ecowear/products/mens-running-sneakers-9_1.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa560"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa573"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7f"
      },
      "stock": 14
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c80"
      },
      "stock": 19
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c81"
      },
      "stock": 24
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c82"
      },
      "stock": 24
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c83"
      },
      "stock": 19
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c84"
      },
      "stock": 14
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c85"
      },
      "stock": 9
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c86"
      },
      "stock": 7
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c87"
      },
      "stock": 4
    }
  ],
  "tags": [
    "sneakers",
    "running",
    "men"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8e9dd74230ef1720ceb"
  },
  "name": "Men's Casual Plaid Shirt 15",
  "slug": "mens-casual-plaid-shirt-15",
  "description": "Stylish plaid pattern for a rugged look.",
  "price": 1490,
  "discount": 5,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773148/ecowear/products/mens-casual-plaid-shirt-15_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773148/ecowear/products/mens-casual-plaid-shirt-15_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773148/ecowear/products/mens-casual-plaid-shirt-15_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773149/ecowear/products/mens-casual-plaid-shirt-15_1.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa564"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 15
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 22
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 28
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 25
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 12
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 6
    }
  ],
  "tags": [
    "shirt",
    "plaid",
    "men"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8e9dd74230ef1720cec"
  },
  "name": "Men's Premium White Shirt 16",
  "slug": "mens-premium-white-shirt-16",
  "description": "Crisp white shirt made from premium Egyptian cotton.",
  "price": 2490,
  "discount": 20,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775181/ecowear/products/mens-premium-white-shirt-16_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775181/ecowear/products/mens-premium-white-shirt-16_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775181/ecowear/products/mens-premium-white-shirt-16_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775181/ecowear/products/mens-premium-white-shirt-16_3.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa564"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 5
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 10
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 15
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 12
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 6
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 3
    }
  ],
  "tags": [
    "shirt",
    "white",
    "premium"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8e9dd74230ef1720cf5"
  },
  "name": "Men's Oversized T-Shirt 15",
  "slug": "mens-oversized-t-shirt-15",
  "description": "Trendy oversized fit for a relaxed style.",
  "price": 890,
  "discount": 5,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775161/ecowear/products/mens-oversized-t-shirt-15_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775161/ecowear/products/mens-oversized-t-shirt-15_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775161/ecowear/products/mens-oversized-t-shirt-15_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775161/ecowear/products/mens-oversized-t-shirt-15_4.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa565"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 28
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 38
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 48
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 42
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 25
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 12
    }
  ],
  "tags": [
    "t-shirt",
    "oversized",
    "men"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8e9dd74230ef1720d00"
  },
  "name": "Men's Stretch Joggers 13",
  "slug": "mens-stretch-joggers-13",
  "description": "Comfortable joggers with elastic cuffs.",
  "price": 1490,
  "discount": 10,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775218/ecowear/products/mens-stretch-joggers-13_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775218/ecowear/products/mens-stretch-joggers-13_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775218/ecowear/products/mens-stretch-joggers-13_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775218/ecowear/products/mens-stretch-joggers-13_2.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa566"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 28
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 38
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 48
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 42
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 28
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 14
    }
  ],
  "tags": [
    "joggers",
    "stretch",
    "casual"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8e9dd74230ef1720d02"
  },
  "name": "Men's Bomber Jacket 15",
  "slug": "mens-bomber-jacket-15",
  "description": "Classic bomber jacket with ribbed cuffs.",
  "price": 3290,
  "discount": 15,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773140/ecowear/products/mens-bomber-jacket-15_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773140/ecowear/products/mens-bomber-jacket-15_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773140/ecowear/products/mens-bomber-jacket-15_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773140/ecowear/products/mens-bomber-jacket-15_1.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa567"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 10
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 18
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 25
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 22
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 12
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 6
    }
  ],
  "tags": [
    "jacket",
    "bomber",
    "men"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8e9dd74230ef1720d08"
  },
  "name": "Women's Casual T-Shirt Dress 10",
  "slug": "womens-casual-t-shirt-dress-10",
  "description": "Comfortable t-shirt dress for everyday.",
  "price": 1490,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775261/ecowear/products/womens-casual-t-shirt-dress-10_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775261/ecowear/products/womens-casual-t-shirt-dress-10_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775261/ecowear/products/womens-casual-t-shirt-dress-10_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775261/ecowear/products/womens-casual-t-shirt-dress-10_3.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55d"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa568"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c74"
      },
      "stock": 22
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c75"
      },
      "stock": 32
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c76"
      },
      "stock": 42
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c77"
      },
      "stock": 37
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c78"
      },
      "stock": 22
    }
  ],
  "tags": [
    "dress",
    "t-shirt",
    "casual"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8e9dd74230ef1720d26"
  },
  "name": "Canvas Backpack 11",
  "slug": "canvas-backpack-11",
  "description": "Durable canvas backpack with laptop sleeve.",
  "price": 1890,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773090/ecowear/products/canvas-backpack-11_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773090/ecowear/products/canvas-backpack-11_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773090/ecowear/products/canvas-backpack-11_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773090/ecowear/products/canvas-backpack-11_2.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55f"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa56f"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7e"
      },
      "stock": 32
    }
  ],
  "tags": [
    "backpack",
    "canvas",
    "school"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8e9dd74230ef1720d2d"
  },
  "name": "Silk Scarf 18",
  "slug": "silk-scarf-18",
  "description": "Elegant silk scarf with print.",
  "price": 990,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775246/ecowear/products/silk-scarf-18_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775246/ecowear/products/silk-scarf-18_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775247/ecowear/products/silk-scarf-18_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775247/ecowear/products/silk-scarf-18_2.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55f"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa572"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7e"
      },
      "stock": 38
    }
  ],
  "tags": [
    "scarf",
    "silk",
    "accessory"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8e9dd74230ef1720d2f"
  },
  "name": "Women's Fashion Sneakers 10",
  "slug": "womens-fashion-sneakers-10",
  "description": "Stylish sneakers for everyday wear.",
  "price": 2190,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775288/ecowear/products/womens-fashion-sneakers-10_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775288/ecowear/products/womens-fashion-sneakers-10_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775289/ecowear/products/womens-fashion-sneakers-10_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775288/ecowear/products/womens-fashion-sneakers-10_2.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa560"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa573"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7f"
      },
      "stock": 17
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c80"
      },
      "stock": 21
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c81"
      },
      "stock": 26
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c82"
      },
      "stock": 26
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c83"
      },
      "stock": 21
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c84"
      },
      "stock": 17
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c85"
      },
      "stock": 11
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c86"
      },
      "stock": 7
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c87"
      },
      "stock": 4
    }
  ],
  "tags": [
    "sneakers",
    "fashion",
    "women"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8e9dd74230ef1720cf7"
  },
  "name": "Men's Henley T-Shirt 17",
  "slug": "mens-henley-t-shirt-17",
  "description": "Classic henley neck style with button placket.",
  "price": 1090,
  "discount": 10,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775138/ecowear/products/mens-henley-t-shirt-17_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775138/ecowear/products/mens-henley-t-shirt-17_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775138/ecowear/products/mens-henley-t-shirt-17_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775138/ecowear/products/mens-henley-t-shirt-17_4.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa565"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 18
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 28
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 38
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 33
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 18
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 8
    }
  ],
  "tags": [
    "t-shirt",
    "henley",
    "men"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8e9dd74230ef1720d01"
  },
  "name": "Men's Wool Blend Overcoat 14",
  "slug": "mens-wool-blend-overcoat-14",
  "description": "Elegant overcoat for winter.",
  "price": 4490,
  "discount": 20,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775241/ecowear/products/mens-wool-blend-overcoat-14_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775242/ecowear/products/mens-wool-blend-overcoat-14_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775242/ecowear/products/mens-wool-blend-overcoat-14_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775242/ecowear/products/mens-wool-blend-overcoat-14_4.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa567"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 8
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 16
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 22
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 20
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 10
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 5
    }
  ],
  "tags": [
    "overcoat",
    "wool",
    "winter"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8e9dd74230ef1720d09"
  },
  "name": "Women's Evening Gown 11",
  "slug": "womens-evening-gown-11",
  "description": "Stunning evening gown for special events.",
  "price": 4990,
  "discount": 20,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775284/ecowear/products/womens-evening-gown-11_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775284/ecowear/products/womens-evening-gown-11_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775284/ecowear/products/womens-evening-gown-11_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775284/ecowear/products/womens-evening-gown-11_1.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55d"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa568"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c74"
      },
      "stock": 6
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c75"
      },
      "stock": 10
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c76"
      },
      "stock": 15
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c77"
      },
      "stock": 12
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c78"
      },
      "stock": 6
    }
  ],
  "tags": [
    "gown",
    "evening",
    "formal"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8e9dd74230ef1720d15"
  },
  "name": "Women's Skinny Jeans 21",
  "slug": "womens-skinny-jeans-21",
  "description": "Classic skinny fit jeans with stretch.",
  "price": 1790,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775347/ecowear/products/womens-skinny-jeans-21_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775347/ecowear/products/womens-skinny-jeans-21_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775347/ecowear/products/womens-skinny-jeans-21_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775348/ecowear/products/womens-skinny-jeans-21_3.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55d"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa56b"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c74"
      },
      "stock": 28
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c75"
      },
      "stock": 38
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c76"
      },
      "stock": 48
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c77"
      },
      "stock": 42
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c78"
      },
      "stock": 28
    }
  ],
  "tags": [
    "jeans",
    "skinny",
    "women"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8e9dd74230ef1720d20"
  },
  "name": "Girls' Leggings 8",
  "slug": "girls-leggings-8",
  "description": "Soft stretch leggings for everyday.",
  "price": 490,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773118/ecowear/products/girls-leggings-8_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773118/ecowear/products/girls-leggings-8_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773118/ecowear/products/girls-leggings-8_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773118/ecowear/products/girls-leggings-8_3.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55e"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa56d"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c79"
      },
      "stock": 48
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7a"
      },
      "stock": 53
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7b"
      },
      "stock": 58
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7c"
      },
      "stock": 53
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7d"
      },
      "stock": 43
    }
  ],
  "tags": [
    "leggings",
    "girls",
    "basics"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8e9dd74230ef1720d2a"
  },
  "name": "Baseball Cap 15",
  "slug": "baseball-cap-15",
  "description": "Classic baseball cap with adjustable strap.",
  "price": 690,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773063/ecowear/products/baseball-cap-15_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773063/ecowear/products/baseball-cap-15_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773063/ecowear/products/baseball-cap-15_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773063/ecowear/products/baseball-cap-15_3.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55f"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa571"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7e"
      },
      "stock": 68
    }
  ],
  "tags": [
    "cap",
    "baseball",
    "hat"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8e9dd74230ef1720d2c"
  },
  "name": "Cashmere Scarf 17",
  "slug": "cashmere-scarf-17",
  "description": "Luxurious cashmere blend scarf.",
  "price": 1290,
  "discount": 10,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773094/ecowear/products/cashmere-scarf-17_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773094/ecowear/products/cashmere-scarf-17_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773094/ecowear/products/cashmere-scarf-17_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773094/ecowear/products/cashmere-scarf-17_1.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55f"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa572"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7e"
      },
      "stock": 28
    }
  ],
  "tags": [
    "scarf",
    "cashmere",
    "winter"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8e9dd74230ef1720d03"
  },
  "name": "Men's Raincoat 16",
  "slug": "mens-raincoat-16",
  "description": "Waterproof raincoat with hood.",
  "price": 2590,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775185/ecowear/products/mens-raincoat-16_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775185/ecowear/products/mens-raincoat-16_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775185/ecowear/products/mens-raincoat-16_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775186/ecowear/products/mens-raincoat-16_3.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa567"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 12
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 22
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 32
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 28
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 15
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 6
    }
  ],
  "tags": [
    "raincoat",
    "waterproof",
    "men"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8eadd74230ef1720d33"
  },
  "name": "Women's Wedge Sandals 14",
  "slug": "womens-wedge-sandals-14",
  "description": "Stylish wedge sandals with ankle strap.",
  "price": 2090,
  "discount": 10,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775361/ecowear/products/womens-wedge-sandals-14_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775361/ecowear/products/womens-wedge-sandals-14_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775361/ecowear/products/womens-wedge-sandals-14_1.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa560"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa575"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7f"
      },
      "stock": 17
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c80"
      },
      "stock": 21
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c81"
      },
      "stock": 26
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c82"
      },
      "stock": 26
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c83"
      },
      "stock": 21
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c84"
      },
      "stock": 17
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c85"
      },
      "stock": 11
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c86"
      },
      "stock": 7
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c87"
      },
      "stock": 4
    }
  ],
  "tags": [
    "sandals",
    "wedge",
    "summer",
    "women"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8e9dd74230ef1720d0a"
  },
  "name": "Women's High-Low Hem Dress 12",
  "slug": "womens-high-low-hem-dress-12",
  "description": "Trendy high-low hem dress.",
  "price": 1990,
  "discount": 5,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775298/ecowear/products/womens-high-low-hem-dress-12_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775298/ecowear/products/womens-high-low-hem-dress-12_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775298/ecowear/products/womens-high-low-hem-dress-12_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775299/ecowear/products/womens-high-low-hem-dress-12_2.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55d"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa568"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c74"
      },
      "stock": 20
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c75"
      },
      "stock": 30
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c76"
      },
      "stock": 40
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c77"
      },
      "stock": 35
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c78"
      },
      "stock": 20
    }
  ],
  "tags": [
    "dress",
    "high-low",
    "women"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8e9dd74230ef1720d0e"
  },
  "name": "Women's Chiffon Blouse 14",
  "slug": "womens-chiffon-blouse-14",
  "description": "Elegant chiffon blouse with ruffles.",
  "price": 1690,
  "discount": 5,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775268/ecowear/products/womens-chiffon-blouse-14_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775268/ecowear/products/womens-chiffon-blouse-14_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775268/ecowear/products/womens-chiffon-blouse-14_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775268/ecowear/products/womens-chiffon-blouse-14_4.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55d"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa569"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c74"
      },
      "stock": 20
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c75"
      },
      "stock": 30
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c76"
      },
      "stock": 40
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c77"
      },
      "stock": 35
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c78"
      },
      "stock": 20
    }
  ],
  "tags": [
    "blouse",
    "chiffon",
    "women"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8e9dd74230ef1720d0f"
  },
  "name": "Women's A-Line Skirt 15",
  "slug": "womens-a-line-skirt-15",
  "description": "Classic A-line skirt in tweed.",
  "price": 1590,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775253/ecowear/products/womens-a-line-skirt-15_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775253/ecowear/products/womens-a-line-skirt-15_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775253/ecowear/products/womens-a-line-skirt-15_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775253/ecowear/products/womens-a-line-skirt-15_3.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55d"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa56a"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c74"
      },
      "stock": 23
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c75"
      },
      "stock": 33
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c76"
      },
      "stock": 43
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c77"
      },
      "stock": 38
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c78"
      },
      "stock": 23
    }
  ],
  "tags": [
    "skirt",
    "a-line",
    "women"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8e9dd74230ef1720d1d"
  },
  "name": "Girls' Floral Dress 5",
  "slug": "girls-floral-dress-5",
  "description": "Beautiful floral print dress for girls.",
  "price": 890,
  "discount": 10,
  "images": [],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55e"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa56d"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c79"
      },
      "stock": 26
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7a"
      },
      "stock": 31
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7b"
      },
      "stock": 36
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7c"
      },
      "stock": 31
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7d"
      },
      "stock": 21
    }
  ],
  "tags": [
    "dress",
    "floral",
    "girls"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8e9dd74230ef1720d05"
  },
  "name": "Women's Floral Maxi Dress 7",
  "slug": "womens-floral-maxi-dress-7",
  "description": "Elegant floral maxi dress for summer.",
  "price": 2290,
  "discount": 15,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775297/ecowear/products/womens-floral-maxi-dress-7_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775297/ecowear/products/womens-floral-maxi-dress-7_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775296/ecowear/products/womens-floral-maxi-dress-7_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775297/ecowear/products/womens-floral-maxi-dress-7_2.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55d"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa568"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c74"
      },
      "stock": 12
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c75"
      },
      "stock": 22
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c76"
      },
      "stock": 32
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c77"
      },
      "stock": 28
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c78"
      },
      "stock": 12
    }
  ],
  "tags": [
    "dress",
    "maxi",
    "floral",
    "women"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8e9dd74230ef1720cea"
  },
  "name": "Men's Linen Summer Shirt 14",
  "slug": "mens-linen-summer-shirt-14",
  "description": "Breathable linen shirt for hot weather.",
  "price": 1990,
  "discount": 15,
  "images": [],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa564"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 8
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 14
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 18
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 16
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 8
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 4
    }
  ],
  "tags": [
    "shirt",
    "linen",
    "summer"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8e9dd74230ef1720d2b"
  },
  "name": "Wool Beanie 16",
  "slug": "wool-beanie-16",
  "description": "Warm wool beanie for winter.",
  "price": 790,
  "discount": 5,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775373/ecowear/products/wool-beanie-16_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775373/ecowear/products/wool-beanie-16_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775373/ecowear/products/wool-beanie-16_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775374/ecowear/products/wool-beanie-16_2.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55f"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa571"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7e"
      },
      "stock": 43
    }
  ],
  "tags": [
    "beanie",
    "wool",
    "winter"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8e9dd74230ef1720cfd"
  },
  "name": "Men's Cargo Pants 10",
  "slug": "mens-cargo-pants-10",
  "description": "Utility cargo pants with multiple pockets.",
  "price": 1990,
  "discount": 15,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773145/ecowear/products/mens-cargo-pants-10_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773145/ecowear/products/mens-cargo-pants-10_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773145/ecowear/products/mens-cargo-pants-10_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773145/ecowear/products/mens-cargo-pants-10_1.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa566"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 16
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 26
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 36
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 31
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 16
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 7
    }
  ],
  "tags": [
    "cargo",
    "pants",
    "utility"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8e9dd74230ef1720d25"
  },
  "name": "Leather Tote Bag 10",
  "slug": "leather-tote-bag-10",
  "description": "Elegant leather tote for daily use.",
  "price": 2990,
  "discount": 10,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773130/ecowear/products/leather-tote-bag-10_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773129/ecowear/products/leather-tote-bag-10_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773129/ecowear/products/leather-tote-bag-10_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773130/ecowear/products/leather-tote-bag-10_1.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55f"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa56f"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7e"
      },
      "stock": 18
    }
  ],
  "tags": [
    "bag",
    "tote",
    "leather"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8eadd74230ef1720d35"
  },
  "name": "Women's Ankle Boots 16",
  "slug": "womens-ankle-boots-16",
  "description": "Trendy ankle boots with block heel.",
  "price": 2790,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775256/ecowear/products/womens-ankle-boots-16_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775256/ecowear/products/womens-ankle-boots-16_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775256/ecowear/products/womens-ankle-boots-16_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775256/ecowear/products/womens-ankle-boots-16_2.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa560"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa576"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7f"
      },
      "stock": 14
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c80"
      },
      "stock": 19
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c81"
      },
      "stock": 24
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c82"
      },
      "stock": 24
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c83"
      },
      "stock": 19
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c84"
      },
      "stock": 14
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c85"
      },
      "stock": 9
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c86"
      },
      "stock": 7
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c87"
      },
      "stock": 4
    }
  ],
  "tags": [
    "boots",
    "ankle",
    "women",
    "casual"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7b8eadd74230ef1720d3c"
  },
  "name": "Women's Softshell Jacket 14",
  "slug": "womens-softshell-jacket-14",
  "description": "Windproof softshell jacket for hiking.",
  "price": 2790,
  "discount": 10,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775350/ecowear/products/womens-softshell-jacket-14_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775350/ecowear/products/womens-softshell-jacket-14_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775350/ecowear/products/womens-softshell-jacket-14_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775350/ecowear/products/womens-softshell-jacket-14_1.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa561"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa57a"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c88"
      },
      "stock": 19
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c89"
      },
      "stock": 24
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c8a"
      },
      "stock": 29
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c8b"
      },
      "stock": 27
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c8c"
      },
      "stock": 17
    }
  ],
  "tags": [
    "jacket",
    "softshell",
    "outdoor",
    "women"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d83c"
  },
  "name": "Men's Checkered Casual Shirt 27",
  "slug": "mens-checkered-casual-shirt-27",
  "description": "Checkered pattern for a relaxed weekend look.",
  "price": 1350,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773154/ecowear/products/mens-checkered-casual-shirt-27_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773154/ecowear/products/mens-checkered-casual-shirt-27_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773154/ecowear/products/mens-checkered-casual-shirt-27_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773154/ecowear/products/mens-checkered-casual-shirt-27_2.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa564"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 20
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 27
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 34
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 30
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 16
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 8
    }
  ],
  "tags": [
    "shirt",
    "checkered",
    "men"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d85e"
  },
  "name": "Women's A-Line Skirt 19",
  "slug": "womens-a-line-skirt-19",
  "description": "Classic A-line skirt in tweed.",
  "price": 1590,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775255/ecowear/products/womens-a-line-skirt-19_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775254/ecowear/products/womens-a-line-skirt-19_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775254/ecowear/products/womens-a-line-skirt-19_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775255/ecowear/products/womens-a-line-skirt-19_1.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55d"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa56a"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c74"
      },
      "stock": 25
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c75"
      },
      "stock": 35
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c76"
      },
      "stock": 47
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c77"
      },
      "stock": 41
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c78"
      },
      "stock": 25
    }
  ],
  "tags": [
    "skirt",
    "a-line",
    "women"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d858"
  },
  "name": "Women's Evening Gown 17",
  "slug": "womens-evening-gown-17",
  "description": "Stunning evening gown for special events.",
  "price": 4990,
  "discount": 25,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775285/ecowear/products/womens-evening-gown-17_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775285/ecowear/products/womens-evening-gown-17_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775285/ecowear/products/womens-evening-gown-17_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775285/ecowear/products/womens-evening-gown-17_1.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55d"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa568"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c74"
      },
      "stock": 7
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c75"
      },
      "stock": 12
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c76"
      },
      "stock": 18
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c77"
      },
      "stock": 15
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c78"
      },
      "stock": 7
    }
  ],
  "tags": [
    "gown",
    "evening",
    "formal"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d85c"
  },
  "name": "Women's Off-Shoulder Top 17",
  "slug": "womens-off-shoulder-top-17",
  "description": "Trendy off-shoulder top for summer.",
  "price": 1490,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775325/ecowear/products/womens-off-shoulder-top-17_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775325/ecowear/products/womens-off-shoulder-top-17_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775325/ecowear/products/womens-off-shoulder-top-17_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775325/ecowear/products/womens-off-shoulder-top-17_1.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55d"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa569"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c74"
      },
      "stock": 28
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c75"
      },
      "stock": 38
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c76"
      },
      "stock": 50
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c77"
      },
      "stock": 44
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c78"
      },
      "stock": 28
    }
  ],
  "tags": [
    "top",
    "off-shoulder",
    "women"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d864"
  },
  "name": "Women's Skinny Jeans 26",
  "slug": "womens-skinny-jeans-26",
  "description": "Classic skinny fit jeans with stretch.",
  "price": 1790,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775349/ecowear/products/womens-skinny-jeans-26_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775349/ecowear/products/womens-skinny-jeans-26_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775349/ecowear/products/womens-skinny-jeans-26_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775349/ecowear/products/womens-skinny-jeans-26_2.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55d"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa56b"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c74"
      },
      "stock": 30
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c75"
      },
      "stock": 40
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c76"
      },
      "stock": 52
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c77"
      },
      "stock": 46
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c78"
      },
      "stock": 30
    }
  ],
  "tags": [
    "jeans",
    "skinny",
    "women"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d865"
  },
  "name": "Women's Jogger Pants 27",
  "slug": "womens-jogger-pants-27",
  "description": "Comfortable joggers with elastic waist.",
  "price": 1490,
  "discount": 8,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775315/ecowear/products/womens-jogger-pants-27_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775315/ecowear/products/womens-jogger-pants-27_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775315/ecowear/products/womens-jogger-pants-27_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775315/ecowear/products/womens-jogger-pants-27_2.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55d"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa56b"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c74"
      },
      "stock": 35
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c75"
      },
      "stock": 45
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c76"
      },
      "stock": 57
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c77"
      },
      "stock": 51
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c78"
      },
      "stock": 35
    }
  ],
  "tags": [
    "joggers",
    "casual",
    "women"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d86e"
  },
  "name": "Girls' Tutu Skirt 11",
  "slug": "girls-tutu-skirt-11",
  "description": "Fun and fluffy tutu skirt.",
  "price": 690,
  "discount": 8,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773119/ecowear/products/girls-tutu-skirt-11_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773119/ecowear/products/girls-tutu-skirt-11_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773119/ecowear/products/girls-tutu-skirt-11_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773119/ecowear/products/girls-tutu-skirt-11_4.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55e"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa56d"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c79"
      },
      "stock": 40
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7a"
      },
      "stock": 45
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7b"
      },
      "stock": 50
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7c"
      },
      "stock": 45
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7d"
      },
      "stock": 35
    }
  ],
  "tags": [
    "skirt",
    "tutu",
    "girls"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d878"
  },
  "name": "Fabric Belt 23",
  "slug": "fabric-belt-23",
  "description": "Woven fabric belt with adjustable clip.",
  "price": 590,
  "discount": 12,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773105/ecowear/products/fabric-belt-23_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773105/ecowear/products/fabric-belt-23_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773105/ecowear/products/fabric-belt-23_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773105/ecowear/products/fabric-belt-23_4.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55f"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa570"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7e"
      },
      "stock": 60
    }
  ],
  "tags": [
    "belt",
    "fabric",
    "casual"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d885"
  },
  "name": "Men's Compression Shirt 14",
  "slug": "mens-compression-shirt-14",
  "description": "Moisture-wicking compression top for workouts.",
  "price": 1290,
  "discount": 8,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773160/ecowear/products/mens-compression-shirt-14_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773160/ecowear/products/mens-compression-shirt-14_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773160/ecowear/products/mens-compression-shirt-14_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773160/ecowear/products/mens-compression-shirt-14_4.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa561"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa577"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c88"
      },
      "stock": 25
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c89"
      },
      "stock": 30
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c8a"
      },
      "stock": 35
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c8b"
      },
      "stock": 30
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c8c"
      },
      "stock": 20
    }
  ],
  "tags": [
    "activewear",
    "compression",
    "men"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d838"
  },
  "name": "Men's Oxford Button-Down Shirt 23",
  "slug": "mens-oxford-button-down-shirt-23",
  "description": "Classic Oxford shirt with button-down collar.",
  "price": 1650,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775167/ecowear/products/mens-oxford-button-down-shirt-23_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775167/ecowear/products/mens-oxford-button-down-shirt-23_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775167/ecowear/products/mens-oxford-button-down-shirt-23_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775167/ecowear/products/mens-oxford-button-down-shirt-23_3.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa564"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 12
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 18
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 24
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 20
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 12
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 6
    }
  ],
  "tags": [
    "shirt",
    "oxford",
    "men"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d842"
  },
  "name": "Men's V-Neck T-Shirt 23",
  "slug": "mens-v-neck-t-shirt-23",
  "description": "Classic V-neck t-shirt in various colors.",
  "price": 690,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775233/ecowear/products/mens-v-neck-t-shirt-23_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775233/ecowear/products/mens-v-neck-t-shirt-23_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775233/ecowear/products/mens-v-neck-t-shirt-23_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775234/ecowear/products/mens-v-neck-t-shirt-23_4.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa565"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 42
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 53
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 68
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 62
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 38
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 20
    }
  ],
  "tags": [
    "t-shirt",
    "v-neck",
    "men"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d847"
  },
  "name": "Men's Ringer T-Shirt 28",
  "slug": "mens-ringer-t-shirt-28",
  "description": "Retro style with contrast collar and sleeve trim.",
  "price": 790,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775197/ecowear/products/mens-ringer-t-shirt-28_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775197/ecowear/products/mens-ringer-t-shirt-28_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775197/ecowear/products/mens-ringer-t-shirt-28_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775197/ecowear/products/mens-ringer-t-shirt-28_2.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa565"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 25
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 35
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 46
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 40
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 24
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 12
    }
  ],
  "tags": [
    "t-shirt",
    "ringer",
    "retro"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d852"
  },
  "name": "Men's Raincoat 22",
  "slug": "mens-raincoat-22",
  "description": "Waterproof raincoat with hood.",
  "price": 2590,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775187/ecowear/products/mens-raincoat-22_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775187/ecowear/products/mens-raincoat-22_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775187/ecowear/products/mens-raincoat-22_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775187/ecowear/products/mens-raincoat-22_4.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa567"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 14
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 24
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 36
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 30
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 16
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 7
    }
  ],
  "tags": [
    "raincoat",
    "waterproof",
    "men"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d856"
  },
  "name": "Women's Wrap Dress 15",
  "slug": "womens-wrap-dress-15",
  "description": "Flattering wrap dress with belt.",
  "price": 2190,
  "discount": 12,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775369/ecowear/products/womens-wrap-dress-15_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775369/ecowear/products/womens-wrap-dress-15_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775369/ecowear/products/womens-wrap-dress-15_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775369/ecowear/products/womens-wrap-dress-15_1.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55d"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa568"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c74"
      },
      "stock": 18
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c75"
      },
      "stock": 28
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c76"
      },
      "stock": 40
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c77"
      },
      "stock": 34
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c78"
      },
      "stock": 18
    }
  ],
  "tags": [
    "dress",
    "wrap",
    "women"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d86b"
  },
  "name": "Boys' Polo Shirt 15",
  "slug": "boys-polo-shirt-15",
  "description": "Classic polo shirt for school.",
  "price": 790,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773087/ecowear/products/boys-polo-shirt-15_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773087/ecowear/products/boys-polo-shirt-15_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773087/ecowear/products/boys-polo-shirt-15_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773087/ecowear/products/boys-polo-shirt-15_3.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55e"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa56c"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c79"
      },
      "stock": 35
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7a"
      },
      "stock": 40
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7b"
      },
      "stock": 45
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7c"
      },
      "stock": 40
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7d"
      },
      "stock": 30
    }
  ],
  "tags": [
    "polo",
    "boys",
    "shirt"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d86d"
  },
  "name": "Girls' Denim Jacket 10",
  "slug": "girls-denim-jacket-10",
  "description": "Stylish denim jacket for girls.",
  "price": 1290,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773108/ecowear/products/girls-denim-jacket-10_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773108/ecowear/products/girls-denim-jacket-10_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773108/ecowear/products/girls-denim-jacket-10_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773108/ecowear/products/girls-denim-jacket-10_2.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55e"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa56d"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c79"
      },
      "stock": 20
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7a"
      },
      "stock": 25
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7b"
      },
      "stock": 30
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7c"
      },
      "stock": 25
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7d"
      },
      "stock": 18
    }
  ],
  "tags": [
    "jacket",
    "denim",
    "girls"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d888"
  },
  "name": "Women's High-Waisted Leggings 17",
  "slug": "womens-high-waisted-leggings-17",
  "description": "Squat-proof leggings with tummy control.",
  "price": 1490,
  "discount": 12,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775305/ecowear/products/womens-high-waisted-leggings-17_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775305/ecowear/products/womens-high-waisted-leggings-17_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775305/ecowear/products/womens-high-waisted-leggings-17_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775305/ecowear/products/womens-high-waisted-leggings-17_1.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa561"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa578"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c88"
      },
      "stock": 40
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c89"
      },
      "stock": 45
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c8a"
      },
      "stock": 50
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c8b"
      },
      "stock": 45
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c8c"
      },
      "stock": 35
    }
  ],
  "tags": [
    "leggings",
    "high-waisted",
    "women"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d84e"
  },
  "name": "Men's Denim Shorts 18",
  "slug": "mens-denim-shorts-18",
  "description": "Casual denim shorts for summer.",
  "price": 1290,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773174/ecowear/products/mens-denim-shorts-18_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773174/ecowear/products/mens-denim-shorts-18_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773174/ecowear/products/mens-denim-shorts-18_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773174/ecowear/products/mens-denim-shorts-18_3.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa566"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 22
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 32
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 44
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 38
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 22
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 10
    }
  ],
  "tags": [
    "shorts",
    "denim",
    "summer"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d857"
  },
  "name": "Women's Casual T-Shirt Dress 16",
  "slug": "womens-casual-t-shirt-dress-16",
  "description": "Comfortable t-shirt dress for everyday.",
  "price": 1490,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775263/ecowear/products/womens-casual-t-shirt-dress-16_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775263/ecowear/products/womens-casual-t-shirt-dress-16_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775263/ecowear/products/womens-casual-t-shirt-dress-16_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775263/ecowear/products/womens-casual-t-shirt-dress-16_3.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55d"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa568"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c74"
      },
      "stock": 24
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c75"
      },
      "stock": 34
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c76"
      },
      "stock": 46
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c77"
      },
      "stock": 40
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c78"
      },
      "stock": 24
    }
  ],
  "tags": [
    "dress",
    "t-shirt",
    "casual"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d85b"
  },
  "name": "Women's Silk Camisole 16",
  "slug": "womens-silk-camisole-16",
  "description": "Luxurious silk camisole for layering.",
  "price": 1790,
  "discount": 12,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775344/ecowear/products/womens-silk-camisole-16_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775344/ecowear/products/womens-silk-camisole-16_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775344/ecowear/products/womens-silk-camisole-16_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775344/ecowear/products/womens-silk-camisole-16_4.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55d"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa569"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c74"
      },
      "stock": 20
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c75"
      },
      "stock": 30
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c76"
      },
      "stock": 42
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c77"
      },
      "stock": 36
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c78"
      },
      "stock": 20
    }
  ],
  "tags": [
    "camisole",
    "silk",
    "women"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d870"
  },
  "name": "Baby Cotton Romper 9",
  "slug": "baby-cotton-romper-9",
  "description": "Soft cotton romper for babies.",
  "price": 590,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774772976/ecowear/products/baby-cotton-romper-9_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774772975/ecowear/products/baby-cotton-romper-9_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774772976/ecowear/products/baby-cotton-romper-9_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774772975/ecowear/products/baby-cotton-romper-9_1.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55e"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa56e"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c79"
      },
      "stock": 30
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7a"
      },
      "stock": 35
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7b"
      },
      "stock": 40
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7c"
      },
      "stock": 35
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7d"
      },
      "stock": 25
    }
  ],
  "tags": [
    "baby",
    "romper",
    "cotton"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d879"
  },
  "name": "Baseball Cap 24",
  "slug": "baseball-cap-24",
  "description": "Classic baseball cap with adjustable strap.",
  "price": 690,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773065/ecowear/products/baseball-cap-24_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773065/ecowear/products/baseball-cap-24_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773065/ecowear/products/baseball-cap-24_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773065/ecowear/products/baseball-cap-24_3.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55f"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa571"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7e"
      },
      "stock": 70
    }
  ],
  "tags": [
    "cap",
    "baseball",
    "hat"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d83a"
  },
  "name": "Men's Casual Plaid Shirt 25",
  "slug": "mens-casual-plaid-shirt-25",
  "description": "Stylish plaid pattern for a rugged look.",
  "price": 1450,
  "discount": 8,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773150/ecowear/products/mens-casual-plaid-shirt-25_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773150/ecowear/products/mens-casual-plaid-shirt-25_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773150/ecowear/products/mens-casual-plaid-shirt-25_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773150/ecowear/products/mens-casual-plaid-shirt-25_2.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa564"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 17
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 24
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 32
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 28
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 14
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 7
    }
  ],
  "tags": [
    "shirt",
    "plaid",
    "men"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d83f"
  },
  "name": "Men's Formal Dress Shirt 30",
  "slug": "mens-formal-dress-shirt-30",
  "description": "Elegant dress shirt for formal events.",
  "price": 2150,
  "discount": 5,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773183/ecowear/products/mens-formal-dress-shirt-30_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773183/ecowear/products/mens-formal-dress-shirt-30_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773183/ecowear/products/mens-formal-dress-shirt-30_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773184/ecowear/products/mens-formal-dress-shirt-30_2.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa564"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 9
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 16
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 22
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 18
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 9
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 4
    }
  ],
  "tags": [
    "shirt",
    "formal",
    "dress"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d846"
  },
  "name": "Men's Henley T-Shirt 27",
  "slug": "mens-henley-t-shirt-27",
  "description": "Classic henley neck style with button placket.",
  "price": 1090,
  "discount": 10,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775140/ecowear/products/mens-henley-t-shirt-27_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775139/ecowear/products/mens-henley-t-shirt-27_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775140/ecowear/products/mens-henley-t-shirt-27_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775140/ecowear/products/mens-henley-t-shirt-27_4.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa565"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 20
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 30
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 42
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 36
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 20
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 9
    }
  ],
  "tags": [
    "t-shirt",
    "henley",
    "men"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d862"
  },
  "name": "Women's High-Waisted Trousers 24",
  "slug": "womens-high-waisted-trousers-24",
  "description": "Tailored high-waisted trousers for office.",
  "price": 2090,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775310/ecowear/products/womens-high-waisted-trousers-24_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775311/ecowear/products/womens-high-waisted-trousers-24_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775311/ecowear/products/womens-high-waisted-trousers-24_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775311/ecowear/products/womens-high-waisted-trousers-24_4.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55d"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa56b"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c74"
      },
      "stock": 20
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c75"
      },
      "stock": 30
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c76"
      },
      "stock": 42
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c77"
      },
      "stock": 36
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c78"
      },
      "stock": 20
    }
  ],
  "tags": [
    "trousers",
    "high-waisted",
    "women"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d86a"
  },
  "name": "Boys' Cargo Pants 14",
  "slug": "boys-cargo-pants-14",
  "description": "Utility cargo pants with multiple pockets.",
  "price": 1090,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773067/ecowear/products/boys-cargo-pants-14_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773067/ecowear/products/boys-cargo-pants-14_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773067/ecowear/products/boys-cargo-pants-14_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773067/ecowear/products/boys-cargo-pants-14_3.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55e"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa56c"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c79"
      },
      "stock": 22
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7a"
      },
      "stock": 27
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7b"
      },
      "stock": 32
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7c"
      },
      "stock": 27
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7d"
      },
      "stock": 18
    }
  ],
  "tags": [
    "cargo",
    "pants",
    "boys"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d87d"
  },
  "name": "Men's Running Sneakers 17",
  "slug": "mens-running-sneakers-17",
  "description": "Lightweight running sneakers with cushioning.",
  "price": 2490,
  "discount": 18,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775199/ecowear/products/mens-running-sneakers-17_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775199/ecowear/products/mens-running-sneakers-17_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775199/ecowear/products/mens-running-sneakers-17_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775199/ecowear/products/mens-running-sneakers-17_3.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa560"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa573"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7f"
      },
      "stock": 15
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c80"
      },
      "stock": 20
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c81"
      },
      "stock": 25
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c82"
      },
      "stock": 25
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c83"
      },
      "stock": 20
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c84"
      },
      "stock": 15
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c85"
      },
      "stock": 10
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c86"
      },
      "stock": 8
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c87"
      },
      "stock": 5
    }
  ],
  "tags": [
    "sneakers",
    "running",
    "men"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d840"
  },
  "name": "Men's Cotton T-Shirt 21",
  "slug": "mens-cotton-t-shirt-21",
  "description": "Soft 100% cotton t-shirt for everyday wear.",
  "price": 590,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773167/ecowear/products/mens-cotton-t-shirt-21_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773167/ecowear/products/mens-cotton-t-shirt-21_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773167/ecowear/products/mens-cotton-t-shirt-21_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773167/ecowear/products/mens-cotton-t-shirt-21_4.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa565"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 48
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 58
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 75
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 68
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 42
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 22
    }
  ],
  "tags": [
    "t-shirt",
    "cotton",
    "men"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d854"
  },
  "name": "Women's Floral Maxi Dress 13",
  "slug": "womens-floral-maxi-dress-13",
  "description": "Elegant floral maxi dress for summer.",
  "price": 2290,
  "discount": 18,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775293/ecowear/products/womens-floral-maxi-dress-13_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775293/ecowear/products/womens-floral-maxi-dress-13_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775293/ecowear/products/womens-floral-maxi-dress-13_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775294/ecowear/products/womens-floral-maxi-dress-13_4.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55d"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa568"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c74"
      },
      "stock": 14
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c75"
      },
      "stock": 24
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c76"
      },
      "stock": 36
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c77"
      },
      "stock": 30
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c78"
      },
      "stock": 14
    }
  ],
  "tags": [
    "dress",
    "maxi",
    "floral",
    "women"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d86f"
  },
  "name": "Girls' Leggings 12",
  "slug": "girls-leggings-12",
  "description": "Soft stretch leggings for everyday.",
  "price": 490,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773115/ecowear/products/girls-leggings-12_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773115/ecowear/products/girls-leggings-12_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773115/ecowear/products/girls-leggings-12_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773115/ecowear/products/girls-leggings-12_2.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55e"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa56d"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c79"
      },
      "stock": 50
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7a"
      },
      "stock": 55
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7b"
      },
      "stock": 60
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7c"
      },
      "stock": 55
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7d"
      },
      "stock": 45
    }
  ],
  "tags": [
    "leggings",
    "girls",
    "basics"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d87b"
  },
  "name": "Cashmere Scarf 26",
  "slug": "cashmere-scarf-26",
  "description": "Luxurious cashmere blend scarf.",
  "price": 1290,
  "discount": 12,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773096/ecowear/products/cashmere-scarf-26_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773096/ecowear/products/cashmere-scarf-26_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773096/ecowear/products/cashmere-scarf-26_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773096/ecowear/products/cashmere-scarf-26_4.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55f"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa572"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7e"
      },
      "stock": 30
    }
  ],
  "tags": [
    "scarf",
    "cashmere",
    "winter"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d889"
  },
  "name": "Women's Sports Bra 18",
  "slug": "womens-sports-bra-18",
  "description": "Medium support sports bra for gym.",
  "price": 1290,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775357/ecowear/products/womens-sports-bra-18_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775357/ecowear/products/womens-sports-bra-18_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775358/ecowear/products/womens-sports-bra-18_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775357/ecowear/products/womens-sports-bra-18_3.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa561"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa579"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c88"
      },
      "stock": 35
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c89"
      },
      "stock": 40
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c8a"
      },
      "stock": 45
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c8b"
      },
      "stock": 40
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c8c"
      },
      "stock": 30
    }
  ],
  "tags": [
    "sports-bra",
    "activewear",
    "women"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d843"
  },
  "name": "Men's Premium Polo T-Shirt 24",
  "slug": "mens-premium-polo-t-shirt-24",
  "description": "High-quality polo shirt with embroidered logo.",
  "price": 1390,
  "discount": 18,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775178/ecowear/products/mens-premium-polo-t-shirt-24_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775178/ecowear/products/mens-premium-polo-t-shirt-24_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775178/ecowear/products/mens-premium-polo-t-shirt-24_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775178/ecowear/products/mens-premium-polo-t-shirt-24_1.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa565"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 20
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 30
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 42
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 36
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 20
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 9
    }
  ],
  "tags": [
    "polo",
    "t-shirt",
    "premium"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d849"
  },
  "name": "Men's Slim Fit T-Shirt 30",
  "slug": "mens-slim-fit-t-shirt-30",
  "description": "Modern slim fit for a tailored look.",
  "price": 790,
  "discount": 8,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775217/ecowear/products/mens-slim-fit-t-shirt-30_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775217/ecowear/products/mens-slim-fit-t-shirt-30_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775217/ecowear/products/mens-slim-fit-t-shirt-30_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775217/ecowear/products/mens-slim-fit-t-shirt-30_4.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa565"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 33
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 43
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 55
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 48
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 30
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 16
    }
  ],
  "tags": [
    "t-shirt",
    "slim-fit",
    "men"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d855"
  },
  "name": "Women's Little Black Dress 14",
  "slug": "womens-little-black-dress-14",
  "description": "Classic little black dress for any occasion.",
  "price": 2490,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775321/ecowear/products/womens-little-black-dress-14_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775321/ecowear/products/womens-little-black-dress-14_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775321/ecowear/products/womens-little-black-dress-14_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775322/ecowear/products/womens-little-black-dress-14_4.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55d"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa568"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c74"
      },
      "stock": 20
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c75"
      },
      "stock": 30
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c76"
      },
      "stock": 42
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c77"
      },
      "stock": 36
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c78"
      },
      "stock": 20
    }
  ],
  "tags": [
    "dress",
    "little-black-dress",
    "women"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d863"
  },
  "name": "Women's Wide Leg Pants 25",
  "slug": "womens-wide-leg-pants-25",
  "description": "Flowy wide leg pants in crepe.",
  "price": 1890,
  "discount": 12,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775368/ecowear/products/womens-wide-leg-pants-25_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775368/ecowear/products/womens-wide-leg-pants-25_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775368/ecowear/products/womens-wide-leg-pants-25_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775368/ecowear/products/womens-wide-leg-pants-25_1.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55d"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa56b"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c74"
      },
      "stock": 25
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c75"
      },
      "stock": 35
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c76"
      },
      "stock": 47
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c77"
      },
      "stock": 41
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c78"
      },
      "stock": 25
    }
  ],
  "tags": [
    "pants",
    "wide-leg",
    "women"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d874"
  },
  "name": "Leather Tote Bag 19",
  "slug": "leather-tote-bag-19",
  "description": "Elegant leather tote for daily use.",
  "price": 2990,
  "discount": 12,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773131/ecowear/products/leather-tote-bag-19_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773131/ecowear/products/leather-tote-bag-19_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773131/ecowear/products/leather-tote-bag-19_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773131/ecowear/products/leather-tote-bag-19_3.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55f"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa56f"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7e"
      },
      "stock": 20
    }
  ],
  "tags": [
    "bag",
    "tote",
    "leather"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d876"
  },
  "name": "Crossbody Bag 21",
  "slug": "crossbody-bag-21",
  "description": "Compact crossbody bag with adjustable strap.",
  "price": 1490,
  "discount": 8,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773099/ecowear/products/crossbody-bag-21_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773099/ecowear/products/crossbody-bag-21_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773099/ecowear/products/crossbody-bag-21_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773099/ecowear/products/crossbody-bag-21_1.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55f"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa56f"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7e"
      },
      "stock": 40
    }
  ],
  "tags": [
    "bag",
    "crossbody",
    "casual"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d87e"
  },
  "name": "Women's Fashion Sneakers 18",
  "slug": "womens-fashion-sneakers-18",
  "description": "Stylish sneakers for everyday wear.",
  "price": 2190,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775290/ecowear/products/womens-fashion-sneakers-18_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775290/ecowear/products/womens-fashion-sneakers-18_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775290/ecowear/products/womens-fashion-sneakers-18_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775290/ecowear/products/womens-fashion-sneakers-18_2.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa560"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa573"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7f"
      },
      "stock": 18
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c80"
      },
      "stock": 22
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c81"
      },
      "stock": 28
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c82"
      },
      "stock": 28
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c83"
      },
      "stock": 22
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c84"
      },
      "stock": 18
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c85"
      },
      "stock": 12
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c86"
      },
      "stock": 8
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c87"
      },
      "stock": 5
    }
  ],
  "tags": [
    "sneakers",
    "fashion",
    "women"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d886"
  },
  "name": "Women's Racerback Tank 15",
  "slug": "womens-racerback-tank-15",
  "description": "Breathable racerback tank for yoga.",
  "price": 990,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775337/ecowear/products/womens-racerback-tank-15_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775337/ecowear/products/womens-racerback-tank-15_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775337/ecowear/products/womens-racerback-tank-15_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775337/ecowear/products/womens-racerback-tank-15_1.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa561"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa577"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c88"
      },
      "stock": 35
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c89"
      },
      "stock": 40
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c8a"
      },
      "stock": 45
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c8b"
      },
      "stock": 40
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c8c"
      },
      "stock": 30
    }
  ],
  "tags": [
    "activewear",
    "tank",
    "women"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d839"
  },
  "name": "Men's Linen Summer Shirt 24",
  "slug": "mens-linen-summer-shirt-24",
  "description": "Breathable linen shirt for hot weather.",
  "price": 1990,
  "discount": 18,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775153/ecowear/products/mens-linen-summer-shirt-24_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775153/ecowear/products/mens-linen-summer-shirt-24_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775153/ecowear/products/mens-linen-summer-shirt-24_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775154/ecowear/products/mens-linen-summer-shirt-24_3.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa564"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 10
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 16
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 22
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 18
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 10
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 4
    }
  ],
  "tags": [
    "shirt",
    "linen",
    "summer"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d84a"
  },
  "name": "Men's Slim Fit Jeans 14",
  "slug": "mens-slim-fit-jeans-14",
  "description": "Classic slim fit denim jeans.",
  "price": 1890,
  "discount": 12,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775211/ecowear/products/mens-slim-fit-jeans-14_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775211/ecowear/products/mens-slim-fit-jeans-14_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775211/ecowear/products/mens-slim-fit-jeans-14_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775211/ecowear/products/mens-slim-fit-jeans-14_2.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa566"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 20
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 30
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 42
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 36
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 20
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 9
    }
  ],
  "tags": [
    "jeans",
    "slim-fit",
    "denim"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d871"
  },
  "name": "Baby Footed Pajamas 10",
  "slug": "baby-footed-pajamas-10",
  "description": "Cozy footed pajamas with zipper.",
  "price": 690,
  "discount": 8,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774772976/ecowear/products/baby-footed-pajamas-10_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774772976/ecowear/products/baby-footed-pajamas-10_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774772976/ecowear/products/baby-footed-pajamas-10_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774772976/ecowear/products/baby-footed-pajamas-10_1.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55e"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa56e"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c79"
      },
      "stock": 28
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7a"
      },
      "stock": 33
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7b"
      },
      "stock": 38
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7c"
      },
      "stock": 33
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7d"
      },
      "stock": 23
    }
  ],
  "tags": [
    "baby",
    "pajamas",
    "footed"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d877"
  },
  "name": "Leather Belt 22",
  "slug": "leather-belt-22",
  "description": "Genuine leather belt with metal buckle.",
  "price": 890,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773126/ecowear/products/leather-belt-22_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773127/ecowear/products/leather-belt-22_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773126/ecowear/products/leather-belt-22_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773126/ecowear/products/leather-belt-22_4.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55f"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa570"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7e"
      },
      "stock": 50
    }
  ],
  "tags": [
    "belt",
    "leather",
    "accessory"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d87c"
  },
  "name": "Silk Scarf 27",
  "slug": "silk-scarf-27",
  "description": "Elegant silk scarf with print.",
  "price": 990,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775248/ecowear/products/silk-scarf-27_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775248/ecowear/products/silk-scarf-27_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775248/ecowear/products/silk-scarf-27_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775248/ecowear/products/silk-scarf-27_3.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55f"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa572"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7e"
      },
      "stock": 40
    }
  ],
  "tags": [
    "scarf",
    "silk",
    "accessory"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d88b"
  },
  "name": "Women's Softshell Jacket 20",
  "slug": "womens-softshell-jacket-20",
  "description": "Windproof softshell jacket for hiking.",
  "price": 2790,
  "discount": 12,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775353/ecowear/products/womens-softshell-jacket-20_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775353/ecowear/products/womens-softshell-jacket-20_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775353/ecowear/products/womens-softshell-jacket-20_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775353/ecowear/products/womens-softshell-jacket-20_1.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa561"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa57a"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c88"
      },
      "stock": 20
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c89"
      },
      "stock": 25
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c8a"
      },
      "stock": 30
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c8b"
      },
      "stock": 28
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c8c"
      },
      "stock": 18
    }
  ],
  "tags": [
    "jacket",
    "softshell",
    "outdoor",
    "women"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d844"
  },
  "name": "Men's Oversized T-Shirt 25",
  "slug": "mens-oversized-t-shirt-25",
  "description": "Trendy oversized fit for a relaxed style.",
  "price": 890,
  "discount": 8,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775162/ecowear/products/mens-oversized-t-shirt-25_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775162/ecowear/products/mens-oversized-t-shirt-25_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775162/ecowear/products/mens-oversized-t-shirt-25_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775163/ecowear/products/mens-oversized-t-shirt-25_4.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa565"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 30
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 40
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 52
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 45
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 28
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 14
    }
  ],
  "tags": [
    "t-shirt",
    "oversized",
    "men"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d86c"
  },
  "name": "Girls' Floral Dress 9",
  "slug": "girls-floral-dress-9",
  "description": "Beautiful floral print dress for girls.",
  "price": 890,
  "discount": 12,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773114/ecowear/products/girls-floral-dress-9_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773114/ecowear/products/girls-floral-dress-9_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773114/ecowear/products/girls-floral-dress-9_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773114/ecowear/products/girls-floral-dress-9_2.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55e"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa56d"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c79"
      },
      "stock": 28
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7a"
      },
      "stock": 33
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7b"
      },
      "stock": 38
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7c"
      },
      "stock": 33
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7d"
      },
      "stock": 23
    }
  ],
  "tags": [
    "dress",
    "floral",
    "girls"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d883"
  },
  "name": "Men's Hiking Boots 23",
  "slug": "mens-hiking-boots-23",
  "description": "Durable waterproof hiking boots.",
  "price": 3990,
  "discount": 18,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775144/ecowear/products/mens-hiking-boots-23_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775144/ecowear/products/mens-hiking-boots-23_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775144/ecowear/products/mens-hiking-boots-23_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775144/ecowear/products/mens-hiking-boots-23_3.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa560"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa576"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7f"
      },
      "stock": 10
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c80"
      },
      "stock": 14
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c81"
      },
      "stock": 18
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c82"
      },
      "stock": 18
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c83"
      },
      "stock": 14
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c84"
      },
      "stock": 10
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c85"
      },
      "stock": 8
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c86"
      },
      "stock": 6
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c87"
      },
      "stock": 4
    }
  ],
  "tags": [
    "boots",
    "hiking",
    "outdoor",
    "men"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d836"
  },
  "name": "Men's Classic Fit Cotton Shirt 21",
  "slug": "mens-classic-fit-cotton-shirt-21",
  "description": "A high-quality cotton shirt perfect for formal or casual occasions.",
  "price": 1350,
  "discount": 10,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773159/ecowear/products/mens-classic-fit-cotton-shirt-21_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773159/ecowear/products/mens-classic-fit-cotton-shirt-21_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773159/ecowear/products/mens-classic-fit-cotton-shirt-21_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773158/ecowear/products/mens-classic-fit-cotton-shirt-21_4.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa564"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 22
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 28
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 35
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 30
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 18
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 8
    }
  ],
  "tags": [
    "shirt",
    "cotton",
    "men"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d83e"
  },
  "name": "Men's Short Sleeve Shirt 29",
  "slug": "mens-short-sleeve-shirt-29",
  "description": "Comfortable short sleeve shirt for summer.",
  "price": 1190,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775205/ecowear/products/mens-short-sleeve-shirt-29_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775205/ecowear/products/mens-short-sleeve-shirt-29_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775205/ecowear/products/mens-short-sleeve-shirt-29_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775205/ecowear/products/mens-short-sleeve-shirt-29_3.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa564"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 27
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 33
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 40
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 35
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 22
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 12
    }
  ],
  "tags": [
    "shirt",
    "short-sleeve",
    "men"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d84c"
  },
  "name": "Men's Cargo Pants 16",
  "slug": "mens-cargo-pants-16",
  "description": "Utility cargo pants with multiple pockets.",
  "price": 1990,
  "discount": 18,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773146/ecowear/products/mens-cargo-pants-16_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773146/ecowear/products/mens-cargo-pants-16_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773146/ecowear/products/mens-cargo-pants-16_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773146/ecowear/products/mens-cargo-pants-16_4.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa566"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 18
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 28
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 40
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 34
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 18
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 8
    }
  ],
  "tags": [
    "cargo",
    "pants",
    "utility"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d853"
  },
  "name": "Men's Denim Jacket 23",
  "slug": "mens-denim-jacket-23",
  "description": "Classic denim jacket for everyday wear.",
  "price": 2790,
  "discount": 12,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773171/ecowear/products/mens-denim-jacket-23_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773171/ecowear/products/mens-denim-jacket-23_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773171/ecowear/products/mens-denim-jacket-23_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773171/ecowear/products/mens-denim-jacket-23_2.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa567"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 17
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 27
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 39
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 33
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 20
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 9
    }
  ],
  "tags": [
    "jacket",
    "denim",
    "men"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d869"
  },
  "name": "Boys' Hooded Sweatshirt 13",
  "slug": "boys-hooded-sweatshirt-13",
  "description": "Comfortable hoodie with kangaroo pocket.",
  "price": 1190,
  "discount": 8,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773081/ecowear/products/boys-hooded-sweatshirt-13_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773082/ecowear/products/boys-hooded-sweatshirt-13_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773081/ecowear/products/boys-hooded-sweatshirt-13_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773081/ecowear/products/boys-hooded-sweatshirt-13_1.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55e"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa56c"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c79"
      },
      "stock": 20
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7a"
      },
      "stock": 25
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7b"
      },
      "stock": 30
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7c"
      },
      "stock": 25
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7d"
      },
      "stock": 15
    }
  ],
  "tags": [
    "hoodie",
    "boys",
    "sweatshirt"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d873"
  },
  "name": "Baby Bodysuit Pack 12",
  "slug": "baby-bodysuit-pack-12",
  "description": "Pack of 3 organic cotton bodysuits.",
  "price": 990,
  "discount": 12,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774772975/ecowear/products/baby-bodysuit-pack-12_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774772975/ecowear/products/baby-bodysuit-pack-12_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774772975/ecowear/products/baby-bodysuit-pack-12_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774772975/ecowear/products/baby-bodysuit-pack-12_1.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55e"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa56e"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c79"
      },
      "stock": 35
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7a"
      },
      "stock": 40
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7b"
      },
      "stock": 45
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7c"
      },
      "stock": 40
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7d"
      },
      "stock": 30
    }
  ],
  "tags": [
    "baby",
    "bodysuit",
    "pack"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d87f"
  },
  "name": "Men's Oxford Shoes 19",
  "slug": "mens-oxford-shoes-19",
  "description": "Classic leather oxford shoes for formal wear.",
  "price": 3290,
  "discount": 12,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775173/ecowear/products/mens-oxford-shoes-19_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775173/ecowear/products/mens-oxford-shoes-19_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775173/ecowear/products/mens-oxford-shoes-19_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775173/ecowear/products/mens-oxford-shoes-19_1.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa560"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa574"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7f"
      },
      "stock": 12
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c80"
      },
      "stock": 16
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c81"
      },
      "stock": 20
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c82"
      },
      "stock": 20
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c83"
      },
      "stock": 16
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c84"
      },
      "stock": 12
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c85"
      },
      "stock": 8
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c86"
      },
      "stock": 6
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c87"
      },
      "stock": 4
    }
  ],
  "tags": [
    "shoes",
    "oxford",
    "formal",
    "men"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d880"
  },
  "name": "Women's Pumps 20",
  "slug": "womens-pumps-20",
  "description": "Elegant pumps with pointed toe.",
  "price": 2790,
  "discount": 8,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775333/ecowear/products/womens-pumps-20_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775333/ecowear/products/womens-pumps-20_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775333/ecowear/products/womens-pumps-20_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775333/ecowear/products/womens-pumps-20_4.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa560"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa574"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7f"
      },
      "stock": 14
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c80"
      },
      "stock": 18
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c81"
      },
      "stock": 22
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c82"
      },
      "stock": 22
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c83"
      },
      "stock": 18
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c84"
      },
      "stock": 14
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c85"
      },
      "stock": 10
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c86"
      },
      "stock": 8
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c87"
      },
      "stock": 5
    }
  ],
  "tags": [
    "pumps",
    "heels",
    "women",
    "formal"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d845"
  },
  "name": "Men's Athletic T-Shirt 26",
  "slug": "mens-athletic-t-shirt-26",
  "description": "Moisture-wicking fabric for sports activities.",
  "price": 990,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773137/ecowear/products/mens-athletic-t-shirt-26_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773137/ecowear/products/mens-athletic-t-shirt-26_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773137/ecowear/products/mens-athletic-t-shirt-26_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773137/ecowear/products/mens-athletic-t-shirt-26_2.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa565"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 34
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 45
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 56
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 50
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 30
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 16
    }
  ],
  "tags": [
    "t-shirt",
    "athletic",
    "sport"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d872"
  },
  "name": "Baby Hooded Towel 11",
  "slug": "baby-hooded-towel-11",
  "description": "Soft hooded towel for bath time.",
  "price": 790,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774772975/ecowear/products/baby-hooded-towel-11_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774772975/ecowear/products/baby-hooded-towel-11_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774772976/ecowear/products/baby-hooded-towel-11_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774772976/ecowear/products/baby-hooded-towel-11_3.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55e"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa56e"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c79"
      },
      "stock": 40
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7a"
      },
      "stock": 45
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7b"
      },
      "stock": 50
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7c"
      },
      "stock": 45
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7d"
      },
      "stock": 35
    }
  ],
  "tags": [
    "baby",
    "towel",
    "hooded"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d867"
  },
  "name": "Boys' Graphic T-Shirt 11",
  "slug": "boys-graphic-t-shirt-11",
  "description": "Cool graphic t-shirt for boys.",
  "price": 590,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773078/ecowear/products/boys-graphic-t-shirt-11_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773077/ecowear/products/boys-graphic-t-shirt-11_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773077/ecowear/products/boys-graphic-t-shirt-11_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773077/ecowear/products/boys-graphic-t-shirt-11_3.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55e"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa56c"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c79"
      },
      "stock": 30
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7a"
      },
      "stock": 35
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7b"
      },
      "stock": 40
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7c"
      },
      "stock": 35
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7d"
      },
      "stock": 25
    }
  ],
  "tags": [
    "t-shirt",
    "boys",
    "graphic"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d88a"
  },
  "name": "Men's Waterproof Jacket 19",
  "slug": "mens-waterproof-jacket-19",
  "description": "Waterproof and breathable shell jacket.",
  "price": 3290,
  "discount": 22,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775238/ecowear/products/mens-waterproof-jacket-19_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775238/ecowear/products/mens-waterproof-jacket-19_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775238/ecowear/products/mens-waterproof-jacket-19_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775238/ecowear/products/mens-waterproof-jacket-19_1.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa561"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa57a"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c88"
      },
      "stock": 18
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c89"
      },
      "stock": 22
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c8a"
      },
      "stock": 28
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c8b"
      },
      "stock": 25
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c8c"
      },
      "stock": 15
    }
  ],
  "tags": [
    "jacket",
    "waterproof",
    "outdoor",
    "men"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d83b"
  },
  "name": "Men's Premium White Shirt 26",
  "slug": "mens-premium-white-shirt-26",
  "description": "Crisp white shirt made from premium Egyptian cotton.",
  "price": 2590,
  "discount": 25,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775182/ecowear/products/mens-premium-white-shirt-26_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775182/ecowear/products/mens-premium-white-shirt-26_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775182/ecowear/products/mens-premium-white-shirt-26_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775182/ecowear/products/mens-premium-white-shirt-26_4.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa564"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 6
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 12
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 18
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 14
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 8
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 4
    }
  ],
  "tags": [
    "shirt",
    "white",
    "premium"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d83d"
  },
  "name": "Men's Flannel Winter Shirt 28",
  "slug": "mens-flannel-winter-shirt-28",
  "description": "Warm flannel shirt for chilly days.",
  "price": 1790,
  "discount": 12,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773178/ecowear/products/mens-flannel-winter-shirt-28_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773178/ecowear/products/mens-flannel-winter-shirt-28_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773178/ecowear/products/mens-flannel-winter-shirt-28_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773178/ecowear/products/mens-flannel-winter-shirt-28_2.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa564"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 14
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 20
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 26
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 22
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 12
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 6
    }
  ],
  "tags": [
    "shirt",
    "flannel",
    "winter"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d841"
  },
  "name": "Men's Graphic Printed T-Shirt 22",
  "slug": "mens-graphic-printed-t-shirt-22",
  "description": "Trendy graphic print t-shirt.",
  "price": 790,
  "discount": 12,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775135/ecowear/products/mens-graphic-printed-t-shirt-22_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775135/ecowear/products/mens-graphic-printed-t-shirt-22_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775135/ecowear/products/mens-graphic-printed-t-shirt-22_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775135/ecowear/products/mens-graphic-printed-t-shirt-22_1.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa565"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 38
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 48
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 60
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 53
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 32
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 16
    }
  ],
  "tags": [
    "t-shirt",
    "graphic",
    "men"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d848"
  },
  "name": "Men's Long Sleeve T-Shirt 29",
  "slug": "mens-long-sleeve-t-shirt-29",
  "description": "Long sleeve for cooler weather.",
  "price": 890,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775158/ecowear/products/mens-long-sleeve-t-shirt-29_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775158/ecowear/products/mens-long-sleeve-t-shirt-29_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775158/ecowear/products/mens-long-sleeve-t-shirt-29_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775158/ecowear/products/mens-long-sleeve-t-shirt-29_4.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa565"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 28
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 38
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 50
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 44
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 26
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 14
    }
  ],
  "tags": [
    "t-shirt",
    "long-sleeve",
    "men"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d84d"
  },
  "name": "Men's Tapered Fit Trousers 17",
  "slug": "mens-tapered-fit-trousers-17",
  "description": "Smart tapered trousers for office wear.",
  "price": 2290,
  "discount": 8,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775224/ecowear/products/mens-tapered-fit-trousers-17_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775224/ecowear/products/mens-tapered-fit-trousers-17_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775224/ecowear/products/mens-tapered-fit-trousers-17_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775225/ecowear/products/mens-tapered-fit-trousers-17_1.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa566"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 14
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 24
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 36
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 30
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 14
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 6
    }
  ],
  "tags": [
    "trousers",
    "tapered-fit",
    "formal"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d84f"
  },
  "name": "Men's Stretch Joggers 19",
  "slug": "mens-stretch-joggers-19",
  "description": "Comfortable joggers with elastic cuffs.",
  "price": 1490,
  "discount": 12,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775220/ecowear/products/mens-stretch-joggers-19_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775220/ecowear/products/mens-stretch-joggers-19_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775220/ecowear/products/mens-stretch-joggers-19_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775220/ecowear/products/mens-stretch-joggers-19_4.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa566"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 30
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 40
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 52
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 46
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 30
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 16
    }
  ],
  "tags": [
    "joggers",
    "stretch",
    "casual"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d850"
  },
  "name": "Men's Wool Blend Overcoat 20",
  "slug": "mens-wool-blend-overcoat-20",
  "description": "Elegant overcoat for winter.",
  "price": 4490,
  "discount": 25,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775243/ecowear/products/mens-wool-blend-overcoat-20_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775243/ecowear/products/mens-wool-blend-overcoat-20_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775243/ecowear/products/mens-wool-blend-overcoat-20_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775243/ecowear/products/mens-wool-blend-overcoat-20_1.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa567"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 9
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 17
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 25
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 22
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 12
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 6
    }
  ],
  "tags": [
    "overcoat",
    "wool",
    "winter"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d875"
  },
  "name": "Canvas Backpack 20",
  "slug": "canvas-backpack-20",
  "description": "Durable canvas backpack with laptop sleeve.",
  "price": 1890,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773091/ecowear/products/canvas-backpack-20_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773091/ecowear/products/canvas-backpack-20_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773091/ecowear/products/canvas-backpack-20_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773091/ecowear/products/canvas-backpack-20_2.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55f"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa56f"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7e"
      },
      "stock": 35
    }
  ],
  "tags": [
    "backpack",
    "canvas",
    "school"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d881"
  },
  "name": "Men's Leather Sandals 21",
  "slug": "mens-leather-sandals-21",
  "description": "Comfortable leather sandals for summer.",
  "price": 1890,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775150/ecowear/products/mens-leather-sandals-21_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775150/ecowear/products/mens-leather-sandals-21_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775150/ecowear/products/mens-leather-sandals-21_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775150/ecowear/products/mens-leather-sandals-21_2.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa560"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa575"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7f"
      },
      "stock": 20
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c80"
      },
      "stock": 25
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c81"
      },
      "stock": 30
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c82"
      },
      "stock": 30
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c83"
      },
      "stock": 25
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c84"
      },
      "stock": 20
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c85"
      },
      "stock": 15
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c86"
      },
      "stock": 12
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c87"
      },
      "stock": 8
    }
  ],
  "tags": [
    "sandals",
    "leather",
    "summer",
    "men"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d882"
  },
  "name": "Women's Wedge Sandals 22",
  "slug": "womens-wedge-sandals-22",
  "description": "Stylish wedge sandals with ankle strap.",
  "price": 2090,
  "discount": 12,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775363/ecowear/products/womens-wedge-sandals-22_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775363/ecowear/products/womens-wedge-sandals-22_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775363/ecowear/products/womens-wedge-sandals-22_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775363/ecowear/products/womens-wedge-sandals-22_1.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa560"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa575"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7f"
      },
      "stock": 18
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c80"
      },
      "stock": 22
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c81"
      },
      "stock": 28
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c82"
      },
      "stock": 28
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c83"
      },
      "stock": 22
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c84"
      },
      "stock": 18
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c85"
      },
      "stock": 12
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c86"
      },
      "stock": 8
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c87"
      },
      "stock": 5
    }
  ],
  "tags": [
    "sandals",
    "wedge",
    "summer",
    "women"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d837"
  },
  "name": "Men's Slim Fit Denim Shirt 22",
  "slug": "mens-slim-fit-denim-shirt-22",
  "description": "Stylish denim shirt for a casual look.",
  "price": 1850,
  "discount": 12,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775208/ecowear/products/mens-slim-fit-denim-shirt-22_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775208/ecowear/products/mens-slim-fit-denim-shirt-22_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775208/ecowear/products/mens-slim-fit-denim-shirt-22_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775208/ecowear/products/mens-slim-fit-denim-shirt-22_1.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa564"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 14
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 20
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 26
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 22
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 12
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 5
    }
  ],
  "tags": [
    "shirt",
    "denim",
    "men"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d851"
  },
  "name": "Men's Bomber Jacket 21",
  "slug": "mens-bomber-jacket-21",
  "description": "Classic bomber jacket with ribbed cuffs.",
  "price": 3290,
  "discount": 18,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773142/ecowear/products/mens-bomber-jacket-21_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773142/ecowear/products/mens-bomber-jacket-21_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773142/ecowear/products/mens-bomber-jacket-21_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773142/ecowear/products/mens-bomber-jacket-21_2.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa567"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 12
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 20
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 28
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 25
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 14
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 7
    }
  ],
  "tags": [
    "jacket",
    "bomber",
    "men"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d85d"
  },
  "name": "Women's Chiffon Blouse 18",
  "slug": "womens-chiffon-blouse-18",
  "description": "Elegant chiffon blouse with ruffles.",
  "price": 1690,
  "discount": 8,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775269/ecowear/products/womens-chiffon-blouse-18_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775269/ecowear/products/womens-chiffon-blouse-18_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775269/ecowear/products/womens-chiffon-blouse-18_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775269/ecowear/products/womens-chiffon-blouse-18_2.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55d"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa569"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c74"
      },
      "stock": 22
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c75"
      },
      "stock": 32
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c76"
      },
      "stock": 44
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c77"
      },
      "stock": 38
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c78"
      },
      "stock": 22
    }
  ],
  "tags": [
    "blouse",
    "chiffon",
    "women"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d85f"
  },
  "name": "Women's Pleated Midi Skirt 20",
  "slug": "womens-pleated-midi-skirt-20",
  "description": "Elegant pleated midi skirt.",
  "price": 1890,
  "discount": 12,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775330/ecowear/products/womens-pleated-midi-skirt-20_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775330/ecowear/products/womens-pleated-midi-skirt-20_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775330/ecowear/products/womens-pleated-midi-skirt-20_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775331/ecowear/products/womens-pleated-midi-skirt-20_4.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55d"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa56a"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c74"
      },
      "stock": 20
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c75"
      },
      "stock": 30
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c76"
      },
      "stock": 42
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c77"
      },
      "stock": 36
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c78"
      },
      "stock": 20
    }
  ],
  "tags": [
    "skirt",
    "pleated",
    "midi"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d860"
  },
  "name": "Women's Denim Skirt 21",
  "slug": "womens-denim-skirt-21",
  "description": "Casual denim skirt with button front.",
  "price": 1390,
  "discount": 0,
  "images": [],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55d"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa56a"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c74"
      },
      "stock": 30
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c75"
      },
      "stock": 40
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c76"
      },
      "stock": 52
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c77"
      },
      "stock": 46
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c78"
      },
      "stock": 30
    }
  ],
  "tags": [
    "skirt",
    "denim",
    "women"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d861"
  },
  "name": "Women's Leather Skirt 22",
  "slug": "womens-leather-skirt-22",
  "description": "Edgy faux leather skirt.",
  "price": 2190,
  "discount": 18,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775320/ecowear/products/womens-leather-skirt-22_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775320/ecowear/products/womens-leather-skirt-22_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775320/ecowear/products/womens-leather-skirt-22_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775320/ecowear/products/womens-leather-skirt-22_3.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55d"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa56a"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c74"
      },
      "stock": 18
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c75"
      },
      "stock": 28
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c76"
      },
      "stock": 40
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c77"
      },
      "stock": 34
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c78"
      },
      "stock": 18
    }
  ],
  "tags": [
    "skirt",
    "leather",
    "women"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d87a"
  },
  "name": "Wool Beanie 25",
  "slug": "wool-beanie-25",
  "description": "Warm wool beanie for winter.",
  "price": 790,
  "discount": 8,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775375/ecowear/products/wool-beanie-25_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775375/ecowear/products/wool-beanie-25_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775375/ecowear/products/wool-beanie-25_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775375/ecowear/products/wool-beanie-25_3.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55f"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa571"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7e"
      },
      "stock": 45
    }
  ],
  "tags": [
    "beanie",
    "wool",
    "winter"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d887"
  },
  "name": "Men's Training Shorts 16",
  "slug": "mens-training-shorts-16",
  "description": "Lightweight shorts with built-in liner.",
  "price": 1190,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775229/ecowear/products/mens-training-shorts-16_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775229/ecowear/products/mens-training-shorts-16_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775229/ecowear/products/mens-training-shorts-16_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775229/ecowear/products/mens-training-shorts-16_3.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa561"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa578"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c88"
      },
      "stock": 30
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c89"
      },
      "stock": 35
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c8a"
      },
      "stock": 40
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c8b"
      },
      "stock": 35
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c8c"
      },
      "stock": 25
    }
  ],
  "tags": [
    "shorts",
    "training",
    "men"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d866"
  },
  "name": "Women's Cotton Linen Pants 28",
  "slug": "womens-cotton-linen-pants-28",
  "description": "Breathable cotton-linen blend for summer.",
  "price": 1690,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775279/ecowear/products/womens-cotton-linen-pants-28_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775279/ecowear/products/womens-cotton-linen-pants-28_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775279/ecowear/products/womens-cotton-linen-pants-28_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775279/ecowear/products/womens-cotton-linen-pants-28_3.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55d"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa56b"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c74"
      },
      "stock": 28
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c75"
      },
      "stock": 38
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c76"
      },
      "stock": 50
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c77"
      },
      "stock": 44
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c78"
      },
      "stock": 28
    }
  ],
  "tags": [
    "pants",
    "linen",
    "summer"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d84b"
  },
  "name": "Men's Relaxed Fit Chinos 15",
  "slug": "mens-relaxed-fit-chinos-15",
  "description": "Comfortable chinos for casual wear.",
  "price": 1690,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775190/ecowear/products/mens-relaxed-fit-chinos-15_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775190/ecowear/products/mens-relaxed-fit-chinos-15_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775190/ecowear/products/mens-relaxed-fit-chinos-15_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775190/ecowear/products/mens-relaxed-fit-chinos-15_4.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55c"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa566"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6e"
      },
      "stock": 24
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c6f"
      },
      "stock": 34
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c70"
      },
      "stock": 46
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c71"
      },
      "stock": 40
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c72"
      },
      "stock": 24
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c73"
      },
      "stock": 12
    }
  ],
  "tags": [
    "chinos",
    "relaxed-fit",
    "men"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d859"
  },
  "name": "Women's High-Low Hem Dress 18",
  "slug": "womens-high-low-hem-dress-18",
  "description": "Trendy high-low hem dress.",
  "price": 1990,
  "discount": 8,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775300/ecowear/products/womens-high-low-hem-dress-18_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775300/ecowear/products/womens-high-low-hem-dress-18_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775300/ecowear/products/womens-high-low-hem-dress-18_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775300/ecowear/products/womens-high-low-hem-dress-18_2.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55d"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa568"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c74"
      },
      "stock": 22
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c75"
      },
      "stock": 32
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c76"
      },
      "stock": 44
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c77"
      },
      "stock": 38
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c78"
      },
      "stock": 22
    }
  ],
  "tags": [
    "dress",
    "high-low",
    "women"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d85a"
  },
  "name": "Women's Cotton Blouse 15",
  "slug": "womens-cotton-blouse-15",
  "description": "Lightweight cotton blouse with embroidery.",
  "price": 1290,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775273/ecowear/products/womens-cotton-blouse-15_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775273/ecowear/products/womens-cotton-blouse-15_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775273/ecowear/products/womens-cotton-blouse-15_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775273/ecowear/products/womens-cotton-blouse-15_3.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55d"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa569"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c74"
      },
      "stock": 30
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c75"
      },
      "stock": 40
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c76"
      },
      "stock": 52
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c77"
      },
      "stock": 46
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c78"
      },
      "stock": 30
    }
  ],
  "tags": [
    "blouse",
    "cotton",
    "women"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d868"
  },
  "name": "Boys' Denim Jeans 12",
  "slug": "boys-denim-jeans-12",
  "description": "Sturdy denim jeans for active kids.",
  "price": 990,
  "discount": 12,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773072/ecowear/products/boys-denim-jeans-12_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773072/ecowear/products/boys-denim-jeans-12_3.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773072/ecowear/products/boys-denim-jeans-12_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774773072/ecowear/products/boys-denim-jeans-12_2.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55e"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa56c"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c79"
      },
      "stock": 25
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7a"
      },
      "stock": 30
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7b"
      },
      "stock": 35
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7c"
      },
      "stock": 30
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7d"
      },
      "stock": 20
    }
  ],
  "tags": [
    "jeans",
    "boys",
    "denim"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69c7be5565657721c735d884"
  },
  "name": "Women's Ankle Boots 24",
  "slug": "womens-ankle-boots-24",
  "description": "Trendy ankle boots with block heel.",
  "price": 2790,
  "discount": 0,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775257/ecowear/products/womens-ankle-boots-24_2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775258/ecowear/products/womens-ankle-boots-24_4.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775258/ecowear/products/womens-ankle-boots-24_1.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774775257/ecowear/products/womens-ankle-boots-24_3.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa560"
  },
  "subcategory": {
    "$oid": "69c7925619bd3d5aa54fa576"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7f"
      },
      "stock": 15
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c80"
      },
      "stock": 20
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c81"
      },
      "stock": 25
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c82"
      },
      "stock": 25
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c83"
      },
      "stock": 20
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c84"
      },
      "stock": 15
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c85"
      },
      "stock": 10
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c86"
      },
      "stock": 8
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c87"
      },
      "stock": 5
    }
  ],
  "tags": [
    "boots",
    "ankle",
    "women",
    "casual"
  ],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0
},
{
  "_id": {
    "$oid": "69cb73de84a85cb091ff1f24"
  },
  "name": "Quentin Clark",
  "slug": "err-45yhg",
  "description": "Consectetur sint as",
  "price": 452,
  "discount": 20,
  "images": [
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774941149/ecowear/products/wey4vxwipkxpgwsmq9fd.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774941149/ecowear/products/veaptemvotroqnolvfu2.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1774941149/ecowear/products/ghmldnxmfy8coryivsjf.jpg",
    "https://res.cloudinary.com/ds4hwq3hb/image/upload/v1775333259/ecowear/products/pus3lbwlpmwpf7gbsnfe.jpg"
  ],
  "category": {
    "$oid": "69c78e0919bd3d5aa54fa55e"
  },
  "sizes": [
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c79"
      },
      "stock": 11,
      "_id": {
        "$oid": "69d16f8c6e282628b048eb6f"
      }
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7a"
      },
      "stock": 0,
      "_id": {
        "$oid": "69d16f8c6e282628b048eb70"
      }
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7b"
      },
      "stock": 0,
      "_id": {
        "$oid": "69d16f8c6e282628b048eb71"
      }
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7c"
      },
      "stock": 0,
      "_id": {
        "$oid": "69d16f8c6e282628b048eb72"
      }
    },
    {
      "size": {
        "$oid": "69c79515dd74230ef1720c7d"
      },
      "stock": 0,
      "_id": {
        "$oid": "69d16f8c6e282628b048eb73"
      }
    }
  ],
  "tags": [],
  "isActive": true,
  "isFeatured": false,
  "featuredOrder": 0,
  "views": 0,
  "averageRating": 0,
  "totalReviews": 0,
  "createdAt": {
    "$date": "2026-03-31T07:12:30.305Z"
  },
  "updatedAt": {
    "$date": "2026-04-04T20:07:40.715Z"
  },
  "__v": 0
}]














const cities = [
    "Dhaka", "Chittagong", "Sylhet", "Rajshahi", "Khulna", "Barisal", "Rangpur", 
    "Mymensingh", "Gazipur", "Narayanganj", "Comilla", "Noakhali", "Feni", 
    "Cox's Bazar", "Bogra", "Jessore", "Tangail", "Dinajpur"
];

const statuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

const generateData = (count) => {
    const orders = [];
    for (let i = 0; i < count; i++) {
        const user = users[Math.floor(Math.random() * users.length)];
        const product = products[Math.floor(Math.random() * products.length)];
        const itemsPrice = product.price;

        orders.push({
            user: user.id, // Plain string
            orderItems: [{
                product: product.id, // Plain string
                name: product.name,
                size: product.sizes[0], // Plain string
                quantity: 1,
                price: product.price,
                image: product.image
            }],
            shippingAddress: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                street: "Sector " + (i % 15),
                city: cities[Math.floor(Math.random() * cities.length)],
                state: "Bangladesh",
                zip: "1230"
            },
            paymentMethod: "COD",
            paymentResult: { status: "COD" },
            itemsPrice,
            shippingPrice: 60,
            discountAmount: 0,
            totalPrice: itemsPrice + 60,
            orderStatus: statuses[Math.floor(Math.random() * statuses.length)],
            pathaoStatus: "Not Synced",
            createdAt: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString() // ISO String
        });
    }
    return orders;
};

fs.writeFileSync('orders.json', JSON.stringify(generateData(1000), null, 2));
console.log("✅ orders.json created!");