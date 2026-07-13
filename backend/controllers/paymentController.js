const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const stripe = require("../config/stripe");

//process paymnet api
exports.processPayment = catchAsyncErrors(async(req, res, next) => {
    console.log(req.body);

    if (!Array.isArray(req.body.items) || req.body.items.length === 0) {
        return next(new ErrorHandler("Cart is empty", 400));
    }

    //build Stripe line items and avoid invalid image URLs
    const lineItems = req.body.items.map((item) => {
        const imageUrl = item.foodItem.images?.[0]?.url;
        const validImage =
            typeof imageUrl === "string" &&
            /^(https?:\/\/)/i.test(imageUrl) ?
            imageUrl :
            null;

        const productData = {
            name: item.foodItem.name,
        };

        if (validImage) {
            productData.images = [validImage];
        }

        return {
            price_data: {
                currency: "inr",
                product_data: productData,
                unit_amount: Math.round(item.foodItem.price * 100),
            },
            quantity: item.quantity,
        };
    });

    console.log("Stripe line items:", JSON.stringify(lineItems, null, 2));
    
    console.log("User:", req.user);
    console.log("Email:", req.user?.email);
    console.log("Request Body:");
    console.log(JSON.stringify(req.body, null, 2));
    //create stripe checkout session
    try {
    const session = await stripe.checkout.sessions.create({
        customer_email: req.user.email,
        phone_number_collection: {
            enabled: true,
        },
        line_items: lineItems,
        mode: "payment",
        shipping_address_collection: {
            allowed_countries: ["US", "IN"],
        },
        shipping_options: [{
            shipping_rate_data: {
                display_name: "Delivery Charges",
                type: "fixed_amount",
                fixed_amount: {
                    amount: 5500,
                    currency: "inr",
                },
                delivery_estimate: {
                    minimum: {
                        unit: "hour",
                        value: 1,
                    },
                    maximum: {
                        unit: "hour",
                        value: 3,
                    },
                },
            },
        }],
        success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/cart`,
    });

    return res.status(200).json({ url: session.url });

} catch (err) {
    console.error("Stripe Error:");
    console.error(err);
    return next(new ErrorHandler(err.message, 500));
}
})

//send stripe api key
exports.sendStripeApi = catchAsyncErrors(async(req, res, next) => {
    res.status(200).json({
        stripeApiKey: process.env.STRIPE_API_KEY
    })
})
