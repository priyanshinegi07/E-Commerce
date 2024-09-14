const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Product = require("../models/Product");
const { isLoggedIn } = require("../middleware");

// View cart page (protected)
router.get("/products/user/cart", isLoggedIn, async (req, res) => {
    try {
        const cart = req.user.cart;
        const totalAmount = cart.reduce((sum, item) => sum + item.price * item.count, 0);
        res.render("cart/cartPage", { cart, totalAmount });
    } catch (err) {
        console.log(err);
        req.flash("error", "An error occurred while retrieving the cart.");
        res.redirect("/products");
    }
});

// Add product to cart (protected)
router.post("/products/:productid/cart", isLoggedIn, async (req, res) => {
    try {
        const { productid } = req.params;
        const userid = req.user._id;
        const user = await User.findById(userid);

        // Check if product is already in cart
        const isPresent = user.cart.some(item => item.id.equals(productid));
        
        if (isPresent) {
            const updatedCart = user.cart.map(item => 
                item.id.equals(productid) ? { ...item, count: item.count + 1 } : item
            );
            user.cart = updatedCart;
            await user.save();
        } else {
            const product = await Product.findById(productid);
            user.cart.push({
                name: product.name,
                price: product.price,
                img: product.img,
                id: product._id,
                // count : count
            });
            await user.save();
        }

        res.redirect("/products/user/cart");
    } catch (err) {
        console.log(err);
        req.flash("error", "An error occurred while adding the product to the cart.");
        res.redirect("/products");
    }
});

// Delete product from cart (protected)
router.delete("/products/user/cart/:productid", isLoggedIn, async (req, res) => {
    try {
        const { productid } = req.params;
        // const user = await User.findById(req.user._id);
        const updatedCart = req.user.cart.filter(item => !((item.id).equals(productid)));
        req.user.cart = updatedCart
        console.log(req.user.cart)
        await req.user.save();
        res.redirect("/products/user/cart");
    } catch (err) {
        console.log(err);
        req.flash("error", "An error occurred while removing the product from the cart.");
        res.redirect("/products/user/cart");
    }
});

router.post("/products/user/cart/:id",isLoggedIn,  async (req, res) => {
    const {id} = req.params;
    const {quantity, action } = req.body;
    const user = req.user;
    console.log("inside post")
    try {
        console.log("inside try")

        const productIndex = user.cart.findIndex(item => item.id.toString() === id);
        if (productIndex === -1) {
            // Product not found in cart
            // return res.status(404).json({ success: false, message: "Product not found in cart" });
            // req.flash("error", "Product not found in cart");
            // return res.redirect("/products/user/cart");
        }
        if(action === 'increment') {
            console.log("inside increment")
            user.cart[productIndex].count += 1;
            await user.save();
        }
        else if (action === 'decrement' && user.cart[productIndex].count > 1) {
            console.log("inside decrement")

            user.cart[productIndex].count -=  1;
            await user.save();
        } 
        else if (action === 'decrement' && user.cart[productIndex].count <= 1) {
            console.log("inside last")

            const updatedCart = req.user.cart.filter(item => !((item.id).equals(id)));
            user.cart = updatedCart;
            await user.save();

        }
        
        res.redirect("/products/user/cart");

    }
    catch(err) {
        console.log("error in updating count", err);
        req.flash("error", "Unexpected error occurred, Try updating cart by `Add to Cart` option")
        res.redirect("/products/user/cart");
    }
})
module.exports = router;
