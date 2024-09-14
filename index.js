const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const colors = require("colors")
const ejsMate = require("ejs-mate")
const methodOverride = require("method-override")
const flash = require("connect-flash");
const session = require('express-session')
const MongoStore = require('connect-mongo');
const passport = require("passport")
const LocalStrategy = require('passport-local');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const passportLocal = require("passport-local")
const User = require('./models/User');
const paypal = require("@paypal/checkout-server-sdk")
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const Feedback = require("./models/Feedback");
const Contact = require("./models/Contact");

dotenv.config();
const app = express();
const port = 3000;
app.engine("ejs", ejsMate)
app.set("view engine", "ejs")

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//to populate req.body
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(methodOverride("_method"))

app.set("views", path.join(__dirname, "views"))
app.use(express.static(path.join(__dirname, "public")))
// mongoose.connect("mongodb://127.0.0.1:27017/ecomm")
// .then(() => console.log("db connected"))
// .catch((err) => console.log(err))

//connection to atlas
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("connected to db", mongoose.connection.host))
.catch((err) => console.log("error connecting to db, error is", err));




const store = MongoStore.create({
    mongoUrl : process.env.MONGO_URL,
    crypto : {
        secret : process.env.SECRET,
    },
    //if there is no change in session then it will be updated after this time, earlier it was updated everytime we refresh but now we want it refreshes only on updation or after 24 hrs
    touchAfter : 24 * 3600,
    
})
store.on("error", () => {
    console.log("error in mongo session store", error);
})
const sessionConfig = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        httpOnly : true,
        //session expires after 7 days
        expires : Date.now() + 7*24*60*60*1000
     }
    
}

app.use(session(sessionConfig));
//initialize flash message
app.use(flash());
app.use(passport.authenticate("session"))
app.use(passport.initialize())
app.use(passport.session())
// app.use((req, res, next) => {
//     console.log("Session data: ", req.session);
//     next();
// });
// app.use((req, res, next) => {
//     console.log("User data: ", req.user);
//     next();
// });

app.use((req, res, next) => {
    // console.log("user: "+ req.user)
    // console.log("Inside locals" , req.user)
    res.locals.currentUser = req.user || null;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    
    next();
})


//we are authenticating user using local strategy

//set up local startegy
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_S,
    //redirects to this after authentication
    callbackURL: "http://localhost:3000/auth/google/callback",
    scope:["profile","email"]
  },
  async(accessToken, refreshToken, profile, cb) => {
    try {
        console.log("profile : ", profile)
        let user = await User.findOne({googleId : profile.id});
        if(!user) {
            user = new User({
                googleId : profile.id,
                username : profile.displayName,
                email : profile.emails[0].value
            });
            
            await user.save();
            
            
        }
        console.log("e ",profile.emails[0].value)
        return cb(null, user)
        
    }
    catch(err) {
        return cb(err);
    }
  }

));
//helps to store data in session for a particular user
passport.serializeUser((user, cb) => {
    cb(null, user);
})
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);  // Find user by ID
        done(null, user);  // Attach user to req.user
    } catch (err) {
        done(err);
    }
})



//Routes
const productRoutes = require("./routes/productRoutes")
const reviewRoutes = require("./routes/reviewRoutes")
const authRoutes = require("./routes/authRoutes")
const cartRoutes = require("./routes/cartRoutes");
const paypalRoutes = require("./routes/paypalRoutes");
const Product = require("./models/Product");
const wishlistRoutes = require("./routes/wishlistRoutes");
// app.get("/products", (req, res) => {
//     res.render("products/index")
// })

//routes middleware
app.use(productRoutes)
app.use(reviewRoutes)
app.use(authRoutes)
app.use(cartRoutes)
app.use("/paypal", paypalRoutes)
app.use(wishlistRoutes)

app.post("/feedback", async(req, res) => {
    console.log("Request feedback")
    const {email, feedback} = req.body;
    await Feedback.create({email, feedback});
    // req.flash("success", "Feedback send");
    res.redirect("/")
})
app.post("/contact", async(req, res) => {
    const {email, message} = req.body;
    console.log(req.body)
    await Contact.create({email, message});
    res.redirect("/")


})
app.get("/", async(req, res) => {
    // const products = await Product.find({});
    res.render("homepage")
})


app.listen(port, (req, res) => {
    console.log(`server is running at port ${port}`)
})