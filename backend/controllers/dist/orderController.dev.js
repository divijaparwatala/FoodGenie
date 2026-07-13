"use strict";

var Order = require("../models/order");

var FoodItem = require("../models/foodItem");

var Cart = require("../models/cartModel");

var _require = require("mongodb"),
    ObjectId = _require.ObjectId;

var ErrorHandler = require("../utils/errorHandler");

var catchAsyncErrors = require("../middlewares/catchAsyncErrors");

var stripe = require("../config/stripe"); // Create a new order   =>  /api/v1/order/new


exports.newOrder = catchAsyncErrors(function _callee(req, res, next) {
  var session_id, session, cart, deliveryInfo, orderItems, paymentInfo, order;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          // console.log("id", req.body);
          session_id = req.body.session_id;
          _context.next = 3;
          return regeneratorRuntime.awrap(stripe.checkout.sessions.retrieve(session_id, {
            expand: ["customer"]
          }));

        case 3:
          session = _context.sent;
          console.log(session);
          _context.next = 7;
          return regeneratorRuntime.awrap(Cart.findOne({
            user: req.user._id
          }).populate({
            path: "items.foodItem",
            select: "name price images"
          }).populate({
            path: "restaurant",
            select: "name"
          }));

        case 7:
          cart = _context.sent;
          console.log(cart);
          deliveryInfo = {
            address: session.shipping_details.address.line1 + " " + session.shipping_details.address.line2,
            city: session.shipping_details.address.city,
            phoneNo: session.customer_details.phone,
            postalCode: session.shipping_details.address.postal_code,
            country: session.shipping_details.address.country
          };
          orderItems = cart.items.map(function (item) {
            return {
              name: item.foodItem.name,
              quantity: item.quantity,
              image: item.foodItem.images[0].url,
              price: item.foodItem.price,
              fooditem: item.foodItem._id
            };
          });
          paymentInfo = {
            id: session.payment_intent,
            status: session.payment_status
          };
          _context.next = 14;
          return regeneratorRuntime.awrap(Order.create({
            orderItems: orderItems,
            deliveryInfo: deliveryInfo,
            paymentInfo: paymentInfo,
            deliveryCharge: +session.shipping_cost.amount_subtotal / 100,
            itemsPrice: +session.amount_subtotal / 100,
            finalTotal: +session.amount_total / 100,
            user: req.user.id,
            restaurant: cart.restaurant._id,
            paidAt: Date.now()
          }));

        case 14:
          order = _context.sent;
          console.log(order);
          _context.next = 18;
          return regeneratorRuntime.awrap(Cart.findOneAndDelete({
            user: req.user._id
          }));

        case 18:
          res.status(200).json({
            success: true,
            order: order
          });

        case 19:
        case "end":
          return _context.stop();
      }
    }
  });
}); // Get single order   =>   /api/v1/orders/:id

exports.getSingleOrder = catchAsyncErrors(function _callee2(req, res, next) {
  var order;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(Order.findById(req.params.id).populate("user", "name email").populate("restaurant").exec());

        case 2:
          order = _context2.sent;

          if (order) {
            _context2.next = 5;
            break;
          }

          return _context2.abrupt("return", next(new ErrorHandler("No Order found with this ID", 404)));

        case 5:
          res.status(200).json({
            success: true,
            order: order
          });

        case 6:
        case "end":
          return _context2.stop();
      }
    }
  });
}); // Get logged in user orders   =>   /api/v1/orders/me

exports.myOrders = catchAsyncErrors(function _callee3(req, res, next) {
  var userId, orders;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          // Get the user ID from req.user
          userId = new ObjectId(req.user.id); // Find orders for the specific user using the retrieved user ID

          _context3.next = 3;
          return regeneratorRuntime.awrap(Order.find({
            user: userId
          }).populate("user", "name email").populate("restaurant").exec());

        case 3:
          orders = _context3.sent;
          res.status(200).json({
            success: true,
            orders: orders
          });

        case 5:
        case "end":
          return _context3.stop();
      }
    }
  });
}); // Get all orders - ADMIN  =>   /api/v1/admin/orders/

exports.allOrders = catchAsyncErrors(function _callee4(req, res, next) {
  var orders, totalAmount;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(Order.find());

        case 2:
          orders = _context4.sent;
          totalAmount = 0;
          orders.forEach(function (order) {
            totalAmount += order.finalTotal;
          });
          res.status(200).json({
            success: true,
            totalAmount: totalAmount,
            orders: orders
          });

        case 6:
        case "end":
          return _context4.stop();
      }
    }
  });
});