"use strict";

var dotenv = require("dotenv");

dotenv.config({
  path: "./config/config.env"
});

var stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

module.exports = stripe;