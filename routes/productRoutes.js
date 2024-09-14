const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const Product = require("../models/Product");
const Feedback = require("../models/Feedback");
const { ObjectId } = mongoose.Types;
const { isLoggedIn } = require("../middleware");
const {upload} = require("../middleware")
const {uploadOnCloudinary} = require("../utils/cloudinary")
const fs = require("fs")

// Get all products
router.get("/products", async (req, res) => {
    try {
        const products = await Product.find({});
        res.render("products/index", { products });
    } catch (err) {
        console.error(err);
        req.flash("error", "Unable to retrieve products.");
        res.redirect("/"); 
    }
});

// Get form to create a new product
router.get("/products/new", isLoggedIn, (req, res) => {
    const user = req.user;
    if(user.userType === "retailer") {
        res.render("products/new");
    }
    else {
        req.flash("error", "You cannot add products");
        res.redirect("/products")
    }
   
});

// Create a new product
router.post("/products", isLoggedIn, upload.single("img"), async (req, res) => {
    try {
        let img;
        const createdBy = req.user._id;
        const { name, price, desc } = req.body;

        if (req.file) {
            const result = await uploadOnCloudinary(req.file.path);
            if (result) {
                img = result.secure_url;
                fs.unlinkSync(req.file.path); // Ensure to use req.file.path
            } else {
                req.flash("error", "Error uploading image to Cloudinary.");
                return res.redirect("/products/new");
            }
        }
        console.log("Createdby in post req of new form", createdBy)
        await Product.create({ name, img, price, desc, createdBy });
        req.flash("success", "Product added successfully");
        res.redirect("/products");
    } catch (err) {
        console.error("Error creating product:", err.message);
        req.flash("error", "Error creating product.");
        res.redirect("/products/new");
    }
});

// Show a single product
router.get("/products/:productid",  async (req, res) => {
    const { productid } = req.params;
    try {
        const product = await Product.findById(productid).populate("reviews").populate("createdBy");
        // console.log("Product", product);
        if (!product) {
            req.flash("error", "Product not found.");
            return res.redirect("/products");
        }
        // console.log("Current User ID:", req.user);
        // console.log("Product CreatedBy ID:", product.createdBy);
        // console.log("Product CreatedBy Type:", typeof product.createdBy);
        const user = req.user;
        console.log(user)
        res.render("products/show", { product});
    } catch (err) {
        console.error(err);
        req.flash("error", "Error fetching product details.");
        res.redirect("/products");
    }
});

// Get edit form
router.get("/products/:productid/edit",isLoggedIn, async (req, res) => {
    console.log("inside get form", req.user)
    const { productid } = req.params;
    const user = req.user;
    const created = user._id;
    console.log("user id" , user._id)

    try {
        const product = await Product.findById(productid).populate("reviews").populate("createdBy");
        if (!product) {
            req.flash("error", "Product not found.");
            return res.redirect("/products");
        }
        console.log("err yaha h3")
        // console.log(currentUser)
        if(!created.equals(product.createdBy._id)) {
            console.log("err yaha 4h")
            // console.log()
            req.flash("error", "You are not authorized to edit this product.");
            return res.redirect("/products");
        }
        else res.render("products/edit", { product });
        console.log("err yaha h5")
    } catch (err) {
        console.error(err);
        req.flash("error", "Error fetching product for editing.");
        res.redirect("/products");
    }
});

// Update product details
router.patch("/products/:productid", isLoggedIn,upload.single("img"), async (req, res) => {
    const { productid } = req.params;
    const { name, price, desc } = req.body;
    const created = req.user._id;

    try {

        // const product = await Product.findByIdAndUpdate(productid, { name, price, img, desc }, { new: true });
        const product  = await Product.findById(productid).populate("reviews").populate("createdBy");
        if (!product) {
            req.flash("error", "Product not found.");
            return res.redirect("/products");
        }
        if (!created._id.equals(product.createdBy._id)) {
            req.flash("error", "You are not authorized to update this product.");
            return res.redirect("/products");
        }
        let img = product.img;
        if(req.file) {
            const result = await uploadOnCloudinary(req.file.path);
            img = result.url;
            fs.unlinkSync(req.file.path);
        }
        await Product.findByIdAndUpdate(productid, { name, price, img, desc }, { new: true });
    
        req.flash("success", "Product details edited successfully!");
        res.redirect(`/products/${productid}`);
    } catch (err) {
        console.error(err);
        req.flash("error", "Error updating product details.");
        res.redirect(`/products/${productid}/edit`);
    }
});

// Delete a product
router.delete("/products/:productid", isLoggedIn, async (req, res) => {
    const { productid } = req.params;
    console.log(req.user)
    const user = req.user;
    const created = user._id;
    const product  = await Product.findById(productid).populate("reviews").populate("createdBy");


    try {
        if(!created._id.equals(product.createdBy._id)) {
            req.flash("error", "You are not authorized to delete this product.");
            return res.redirect("/products");
        }
        const result = await Product.deleteOne({ _id: productid });
        if (result.deletedCount === 0) {
            req.flash("error", "Product not found.");
            return res.redirect("/products");
        }
        req.flash("success", "Item has been deleted!");
        res.redirect("/products");
    } catch (err) {
        console.error(err);
        req.flash("error", "Error deleting product.");
        res.redirect("/products");
    }
});

module.exports = router;
