const express = require("express")
const router = express.Router();
const User = require("../models/User")
const passport = require("passport")
const session = require('express-session')
// const session = require('express-session');
router.get("/register", (req, res) => {
    try{
        res.render("auth/signup")
    }
    catch(err) {
        console.log(err);
        res.render("error")
    }
    
})

// router.get("/testUser", async(req, res) => {
//     const user = new User({username : "naman", email : "naman@gmail.com"})
//     //we give password with register method
//     //passport does encryption of this password and stores it
//     const newUser = await User.register(user, "12345");
//     res.send(newUser)
// })

//register a new user
router.post("/register", async (req, res) => {
    try {
        const {username, email, password, userType} = req.body;
        let oldUser = await User.exists({username : username, userType : userType});
        console.log("oldUser2", oldUser)
        if(oldUser) {
            req.flash("error", "A user with the given username is already registered. You may login if you are the one or try using another username");
            res.redirect("/login")
            return;
        }
    // console.log(username+password+email)
    const user = new User({username, email, userType});
    const newUser =  await User.register(user, password)
    req.flash("success", "User registered successfully")
    res.redirect("/login")
    }
    catch(err) {
        console.log(err);
        req.flash("error", "Registration failed. Please try again. ")
        res.render("auth/signup")
    }
    
})

router.get("/login", (req, res) => {
    try {
        res.render("auth/login")
    } catch (error) {
        console.log(error)
        res.render("error")
    }
})

router.post("/login", 
    passport.authenticate("local", {
        failureRedirect : "/login",
        //flash msg is showing without below line
        failureFlash : true,
        //to show failure message
        failureMessage : true
    }),
    //following code wil run on successful login
    function(req, res) {
        try {
            // console.log(req.body)
            const user = req.user;
            if (!user) {
                req.flash("error", "User data not found. Please sign up.");
                return res.redirect("/register");
            }
            if(user.userType === "consumer") {
            req.flash("success",`Welcome back ${req.user.username}!`)

            }
            else {
            req.flash("success",`Welcome back ${req.user.username}! You can only view and add new products`)

            }
        // console.log("userlogin: " + req.user)
        res.redirect("/products")
        } catch (error) {
            console.log(error);
            res.redirect("/login")
        }
        
    }
)

router.get("/logout", (req, res, next) => {
    try {
        req.logout(function(err) {
            if(err) {return next(err);}
            req.flash("success", "Goodbye see you again!");
            res.redirect("/login")
        });
    } catch (error) {
        console.log(error);
        res.render("error")
    }
    
});
//initialize google oauth login
router.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));
   
router.get('/auth/google/callback', 
    passport.authenticate('google', { 
        failureRedirect: '/login',
        failureFlash : true,
        failureMessage : true,
        // successRedirect : "/products"
    }),
    function(req, res) {
        try {
            req.flash("success", `Welcome back ${req.user.username}`)
            res.redirect('/products');
        } catch (error) {
            console.log(error)
            res.redirect("/login")
        }
    // Successful authentication
    
});
module.exports = router;