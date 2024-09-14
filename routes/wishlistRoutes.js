const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Product = require("../models/Product");
const { isLoggedIn } = require("../middleware");

// Add product to wishlist
router.post("/products/:productid/wishlist", isLoggedIn, async (req, res) => {
    const { productid } = req.params;

    try {
        // Find the product
        const product = await Product.findById(productid);
        if (!product) {
            req.flash("error", "Product not found.");
            return res.redirect(`/products/${productid}`);
        }

        // Find the user and check if the product is already in the wishlist
        const userid = req.user._id;
        const user = await User.findById(userid);
        if (!user) {
            req.flash("error", "User not found.");
            return res.redirect(`/products/${productid}`);
        }

        const isPresent = user.wishlist.some((item) => item.id.equals(productid));
        if (isPresent) {
            req.flash("success", "Product already present in wishlist.");
            return res.redirect(`/products/${productid}`);
        }

        // Add product to wishlist
        user.wishlist.push({
            name: product.name,
            price: product.price,
            img: product.img,
            id: product._id
        });

        await user.save();
        req.flash("success", "Product added to wishlist.");
        res.redirect(`/products/${productid}`);
    } catch (err) {
        console.error(err);
        req.flash("error", "Error adding product to wishlist.");
        res.redirect(`/products/${productid}`);
    }
});

// Get user wishlist
router.get("/products/user/wishlist", isLoggedIn, async (req, res) => {
    try {
        const userid = req.user._id;
        const user = await User.findById(userid).populate('wishlist');
        if (!user) {
            req.flash("error", "User not found.");
            return res.redirect("/");
        }

        const wishlist = user.wishlist;
        res.render("cart/wishlist", { wishlist });
    } catch (err) {
        console.error(err);
        req.flash("error", "Error retrieving wishlist.");
        res.redirect("/");
    }
});

// Remove product from wishlist
router.delete("/wishlist/:productid", isLoggedIn, async (req, res) => {
    try {
        const { productid } = req.params;

        // Find the user and filter out the product
        const userid = req.user._id;
        const user = await User.findById(userid);
        if (!user) {
            req.flash("error", "User not found.");
            return res.redirect("/products/user/wishlist");
        }

        const newList = user.wishlist.filter(item => item.id.toString() !== productid);
        user.wishlist = newList;

        await user.save();
        req.flash("success", "Product removed from wishlist.");
        res.redirect("/products/user/wishlist");
    } catch (err) {
        console.error("Error occurred:", err);
        req.flash("error", "Error occurred while removing product from wishlist.");
        res.redirect("/products/user/wishlist");
    }
});

module.exports = router;
