const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const Product = require("../models/Product");
const { isLoggedIn } = require("../middleware");

// Create a review for a product
router.post("/products/:productid/review", isLoggedIn, async (req, res) => {
    const { productid } = req.params;
    const { rating, comment } = req.body;
    const user = req.user;

    try {
        const product = await Product.findById(productid);
        if (!product) {
            req.flash("error", "Product not found.");
            return res.redirect(`/products/${productid}`);
        }
        const createdBy = user._id;
        // console.log("error", userid)
        const review = await Review.create({ rating, comment, createdBy });
        product.reviews.push(review);
        await product.save();

        req.flash("success", "Review added successfully!");
        res.redirect(`/products/${productid}`);
    } catch (err) {
        console.error(err);
        req.flash("error", "Error adding review.");
        res.redirect(`/products/${productid}`);
    }
});

// Delete a review from a product
router.delete("/:productid/reviews/:reviewid", isLoggedIn, async (req, res) => {
    const { reviewid, productid } = req.params;
    const user = req.user;
    console.log("try ke bahr");
    try {
        const review = await Review.findById(reviewid);
        // Delete the review
        console.log("if ke upr");
        const reviewBy = review.createdBy;
        const userid = user._id
        console.log(review.createdBy, user._id,"review id and user id ")
        if(userid.equals(reviewBy)) {
            console.log("if ke andr");

            await Review.findByIdAndDelete(reviewid);
            

        }
        else {
            console.log("else ke andr");
            req.flash("error", "You cannot delete this review");
            return res.redirect(`/products/${productid}`);
        }
        // console.log("else ke niche");
        // Find the product and remove the review from it
        const product = await Product.findById(productid);
        if (product) {
            product.reviews.pull(reviewid);
            await product.save();
        }
        console.log("flash ke upr");

        req.flash("success", "Review deleted successfully!");
        res.redirect(`/products/${productid}`);
    } catch (err) {
        console.error(err);
        req.flash("error", "Error deleting review.");
        res.redirect(`/products/${productid}`);
    }
});

module.exports = router;
