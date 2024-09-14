const mongoose = require("mongoose")
const Product = require("./models/Product");
const User = require("./models/User");
const { name } = require("ejs");
// const { name } = require("ejs");
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("connected to db", mongoose.connection.host))
.catch((err) => console.log("error connecting to db, error is", err));
console.log("hello")
let products;
(async () => {
    try {
        // const id = "66dc9a6fbc682056406b83b5";
        // const adminUser = await User.findById(id);  // Wait for the user to be found
        // if (!adminUser) {
        //     throw new Error('User not found');
        // }
        
        // Now you can safely access adminUser._id
        // const createdBy = adminUser._id;
        // console.log("Created by: ", createdBy);


        // Use `createdBy` in your subsequent logic
        products = [
            {
                name: 'Iphone 15',
                img: 'https://images.unsplash.com/photo-1695048133021-be2def43f3b2?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                price: 999,
                desc: "A 6.1-inch Super Retina XDR display with ProMotion technology for smoother scrolling.Improved battery life, new color options, and software enhancements with iOS 18.",
                // createdBy : adminUser._id
            },

            {
                name: 'Nike Shoes',
                img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8c2hvZXN8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
                price: 120,
                desc: "Experience the perfect fusion of style and performance with Nike Running Shoes. Engineered for ultimate comfort and support, these shoes feature advanced cushioning and a lightweight design to keep you moving effortlessly. Whether you’re hitting the track or the streets, Nike ensures every step is a stride toward greatness. Elevate your run and conquer your goals with confidence.",
                // createdBy :adminUser._id
        
            },
            {
                name: 'Comfortable Sofa',
                img: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGZ1cm5pdHVyZXxlbnwwfHwwfHx8MA%3D%3D',
                price: 10000,
                desc: " Elevate your living space with our Designer Comfortable Sofa, featuring plush cushions and an elegant design. Crafted with premium materials, it offers unparalleled comfort and style, perfect for both relaxation and entertaining. Transform your home into a haven of luxury and sophistication.",
                // createdBy : adminUser._id
            },
            {
                name: 'Jacket',
                img: 'https://images.unsplash.com/photo-1602370463198-086436840055?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjR8fGdpcmwlMjBmYXNoaW9ufGVufDB8fDB8fHww',
                price: 85,
                desc: "Empower your style with the Girl Leader Jacket. Designed for the bold and ambitious, this jacket combines sleek lines with a flattering fit to make a statement. Crafted from high-quality materials, it offers both comfort and durability, perfect for leading with confidence in any season. Embrace your leadership and showcase your flair with this standout piece",
                // createdBy : adminUser._id
            },
            
            {
                name: 'Jewelry Set: Necklace, Bangle, Earrings, Rings',
                img: 'https://plus.unsplash.com/premium_photo-1681276170758-d6ca6e6e276a?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                price: 150,
                desc: "Indulge in timeless elegance with this exquisite jewelry set. Featuring a dazzling diamond necklace, a sleek and stylish bangle, a pair of radiant earrings, and a matching set of rings, this collection is designed to make every occasion special. Each piece is crafted with precision and care, ensuring a luxurious sparkle that complements any outfit. Perfect for making a statement or gifting to a loved one.",
                // createdBy : adminUser._id
            },
            {
                name: 'Brown Leather Side Bag',
                img: 'https://images.unsplash.com/photo-1523779105320-d1cd346ff52b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8YmFnfGVufDB8fDB8fHww',
                price: 75,
                desc: "Elevate your style with this high-quality brown side bag, crafted from premium materials for durability and sophistication. Its sleek design features ample space for your essentials, complemented by a stylish, adjustable strap for comfort. Perfect for adding a touch of elegance to your everyday look or as a versatile accessory for any outing..",
                // createdBy : adminUser._id
            },
            {
                name : "Stylish Men's Fashion Ensemble",
                img : "https://images.unsplash.com/photo-1602052127025-fe037b6bba38?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8bWVuZmFzaGlvbnxlbnwwfHwwfHx8MA%3D%3D",
                price : 150,
                desc : "Elevate your style with this sleek and contemporary men's outfit. Featuring a tailored jacket, trendy trousers, and matching accessories, this look is perfect for both casual outings and formal events. Stay ahead of the fashion curve with this effortlessly chic ensemble.",
                // createdBy : adminUser._id
            },
            {
                name : "Everyday Humans SPF 50 Sunscreen",
                img : "https://images.unsplash.com/photo-1598662972299-5408ddb8a3dc?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                price : 22,
                desc : "A lightweight, non-greasy sunscreen with SPF 50 that provides all-day protection against harmful UV rays. Perfect for daily wear, it absorbs quickly and leaves skin feeling hydrated without any white residue. Ideal for all skin types, making sun care effortless.",
                // createdBy : adminUser._id

            },
            {
                name : " Chocolate Assortment Box",
                img : "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHN3ZWV0cyUyMHBhY2tldHxlbnwwfHwwfHx8MA%3D%3D",
                price : 22,
                desc : "ndulge in a delightful assortment of your favorite chocolate bars all in one box! This 250g mix includes Snickers, KitKat, Corny, Hanuta, Twix, Mars, and Lion for the perfect treat. Whether you're sharing or keeping it all for yourself, this box is sure to satisfy any sweet tooth!",
                // createdBy : adminUser._id

            },
            {
                name : "Bluetooth Earbuds",
                img : "https://images.unsplash.com/photo-1617350142147-7403b8fb9889?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHdpcmVsZXNzJTIwYmx1ZXRvb3RoJTIwZWFyYnVkc3xlbnwwfHwwfHx8MA%3D%3D",
                price : 59.99,
                desc : "Experience crisp, high-quality sound with our Wireless Bluetooth Earbuds. With noise-cancellation technology and a comfortable, snug fit, these earbuds are perfect for everything from workouts to commuting. Enjoy up to 8 hours of playback on a single charge, and the sleek charging case provides an additional 24 hours of battery life! Available in multiple colors, these are a must-have for music lovers on the go.",
                // createdBy : adminUser._id

            },
            {
                name : "Apple Smart Watch",
                img : "https://images.unsplash.com/photo-1617043983671-adaadcaa2460?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXBwbGUlMjBzbWFydCUyMHdhdGNofGVufDB8fDB8fHww",
                price : 399.99,
                desc : " Stay connected and track your fitness with the sleek Apple Smart Watch. Available in classic black and white, it features a high-resolution display, heart rate monitoring, GPS, and a range of health and fitness apps. Its stylish design complements any outfit, while its customizable watch faces and bands offer a personalized touch. With up to 18 hours of battery life, it's perfect for both daily wear and workouts.",
                // createdBy : adminUser._id
            },
            {
                name: "Monopoly Board Game",
                img : "https://images.unsplash.com/photo-1703925153100-43afda8b6506?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bW9ub3BvbHklMjBib2FyZCUyMGdhbWV8ZW58MHx8MHx8fDA%3D",
                price : 29.99,
                desc : "Enjoy hours of family fun with the classic Monopoly Board Game. This timeless game of strategy and luck lets you buy, sell, and trade properties to build your real estate empire. Featuring iconic game pieces and colorful property cards, Monopoly offers a great way to test your financial skills and outwit your opponents. Whether you’re a seasoned player or new to the game, Monopoly is perfect for game nights and gatherings.",
                // createdBy : adminUser._id
            },
            {
                name : "LEGO NINJAGO",
                img : "https://image.smythstoys.com/original/desktop/222960.jpg",
                price : 119.99,
                desc : "Unleash your imagination with the LEGO NINJAGO Temple of the Dragon Energy Cores! This epic building playset features intricate details and dynamic play elements that bring the NINJAGO universe to life. With multiple levels, secret compartments, and interactive features, kids and collectors alike will enjoy hours of action-packed adventure. Includes minifigures of your favorite NINJAGO heroes and villains for an immersive experience. Perfect for fans of all ages who love creative building and exciting stories.",
                // createdBy : adminUser._id


            },
            {
                name : "Ceramic Coffee Mugs",
                img : "https://plus.unsplash.com/premium_photo-1719454276039-536f36df3a43?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fENlcmFtaWMlMjBDb2ZmZWUlMjBNdWdzfGVufDB8fDB8fHww",
                price : 24.99,
                desc : "Enjoy your morning brew in style with this set of two elegant ceramic coffee mugs. Crafted from high-quality ceramic, these mugs feature a sleek, classic design that complements any kitchen decor. Each mug has a comfortable handle and a generous capacity, perfect for sipping your favorite hot beverages. The smooth, glossy finish and durable construction ensure these mugs will be a favorite addition to your coffee routine for years to come. Ideal for both personal use and as a thoughtful gift for coffee lovers.",
                // createdBy : adminUser._id
            },
            {
                name: 'Glass Bottles Set',
                img: 'https://images.unsplash.com/photo-1543352631-6b884eafab2f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGx1bmNoJTIwYm94fGVufDB8fDB8fHww',
                price: 30,
                desc: "Elevate your kitchen organization with this elegant set of glass bottles. Each bottle is crafted from high-quality, durable glass and topped with sleek, rust-resistant steel caps. Perfect for storing oils, vinegar, or spices, these bottles add a touch of sophistication to any kitchen while ensuring your ingredients stay fresh. A must-have for a stylish and functional culinary space.",
                // createdBy : adminUser._id
            },

        
        ]
    } catch (error) {
        console.error(error);
    }
})();


//func to add products to db

async function seedProducts() {
    // if(await Product.find({})) {
    //     await Product.deleteMany({});
    // }
    const count = await Product.countDocuments();
    console.log(count)
    if (count !== 0) {
        await Product.deleteMany({});
    }
    
    
    await Product.insertMany(products)
    console.log("products have been seeded successfully")

}

seedProducts()

