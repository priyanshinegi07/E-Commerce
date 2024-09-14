const express = require('express');
const router = express.Router();
const { client } = require('../paypal/paypal');
const paypal = require('@paypal/checkout-server-sdk');
const User = require("../models/User");
const {isLoggedIn} = require("../middleware")

//route to create paypal order
router.post("/create-order/:totalAmount",isLoggedIn, async(req, res) => {
    const {totalAmount} = req.params;
    //new req object for order creation
    const request = new paypal.orders.OrdersCreateRequest();
    //sets header to get full response with header details
    //request obj is used to send request to paypal's api
    // request.headers["prefer"] = "return-representation";
    request.prefer("return=representation");
    request.requestBody({
        intent : "CAPTURE",
        purchase_units : [{
            amount : {
                currency_code : 'USD',
                value : totalAmount
            }
        }],
        application_context : {
            return_url : "https://e-commerce-1uxr.onrender.com/paypal/success",
            cancel_url : "https://e-commerce-1uxr.onrender.com/paypal/cancel"

        }

    });


    //handling request of payment
    try {
        const order = await client().execute(request);//sending request to paypal and waiting for response
        const approvalUrl = order.result.links.find(link => link.rel === 'approve').href;
        res.redirect(approvalUrl)
        // res.json(order.result);//send result as json response
        // res.render("")
    }
    catch(err) {
        console.log(err);
        res.status(500).send("error creating order");
    }
})

//route to capture paypal order
router.get("/success",isLoggedIn, async(req, res) => {
    const {token} = req.query;
    const request = new paypal.orders.OrdersCaptureRequest(token);
    try {
        const capture = await client().execute(request);
        // res.render("paypal/paymentSuccess", { capture });
        console.log(capture.result)
        const userid = req.user._id;
        const user = await User.findById(userid);
        // while(user.cart.length > 0) {
        //     user.cart.pop();
        // }
        user.cart = [];
        await user.save();
        res.render("paypal/success", {capture});
    }
    catch(err) {
        console.log(err);
        res.status(500).send("error capturing order");
    }
})
router.get('/cancel',isLoggedIn, (req, res) => {
    // res.send('Payment was cancelled.');
    return res.render("paypal/cancel")
  });
module.exports = router

