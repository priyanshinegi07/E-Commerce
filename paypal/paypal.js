const paypal = require("@paypal/checkout-server-sdk")
const dotenv = require("dotenv")
dotenv.config();
function environment() {
    //to connect to paypal sandbox environment and do fake payment, we create an instance of sandbox environment
    return new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_S);
}

function client() {
    //to make http req and connect application with client, we can create and manage transations
    return new paypal.core.PayPalHttpClient(environment());
}
module.exports = {client}