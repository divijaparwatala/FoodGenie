"use strict";

var Cart = require("../models/cartModel");

var FoodItem = require("../models/foodItem");

var Restaurant = require("../models/restaurant");

function addItemToCart(req, res) {
  var _req$body, userId, foodItemId, restaurantId, quantity, foodItem, restaurant, cart, itemIndex, updatedCart;

  return regeneratorRuntime.async(function addItemToCart$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, userId = _req$body.userId, foodItemId = _req$body.foodItemId, restaurantId = _req$body.restaurantId, quantity = _req$body.quantity;
          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(FoodItem.findById(foodItemId));

        case 4:
          foodItem = _context.sent;

          if (foodItem) {
            _context.next = 7;
            break;
          }

          return _context.abrupt("return", res.status(404).json({
            message: "Food item not found"
          }));

        case 7:
          _context.next = 9;
          return regeneratorRuntime.awrap(Restaurant.findById(restaurantId));

        case 9:
          restaurant = _context.sent;

          if (restaurant) {
            _context.next = 12;
            break;
          }

          return _context.abrupt("return", res.status(404).json({
            message: "Restaurant not found"
          }));

        case 12:
          _context.next = 14;
          return regeneratorRuntime.awrap(Cart.findOne({
            user: userId
          }));

        case 14:
          cart = _context.sent;

          if (!cart) {
            _context.next = 26;
            break;
          }

          if (!(cart.restaurant.toString() !== restaurantId)) {
            _context.next = 22;
            break;
          }

          _context.next = 19;
          return regeneratorRuntime.awrap(Cart.deleteOne({
            _id: cart._id
          }));

        case 19:
          cart = new Cart({
            user: userId,
            restaurant: restaurantId,
            items: [{
              foodItem: foodItemId,
              quantity: quantity
            }]
          });
          _context.next = 24;
          break;

        case 22:
          itemIndex = cart.items.findIndex(function (item) {
            return item.foodItem.toString() === foodItemId;
          });

          if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
          } else {
            cart.items.push({
              foodItem: foodItemId,
              quantity: quantity
            });
          }

        case 24:
          _context.next = 27;
          break;

        case 26:
          cart = new Cart({
            user: userId,
            restaurant: restaurantId,
            items: [{
              foodItem: foodItemId,
              quantity: quantity
            }]
          });

        case 27:
          _context.next = 29;
          return regeneratorRuntime.awrap(cart.save());

        case 29:
          _context.next = 31;
          return regeneratorRuntime.awrap(Cart.findOne({
            user: userId
          }).populate({
            path: "items.foodItem",
            select: "name price images"
          }).populate({
            path: "restaurant",
            select: "name"
          }));

        case 31:
          updatedCart = _context.sent;
          res.status(200).json({
            message: "Cart updated",
            cart: updatedCart
          });
          _context.next = 38;
          break;

        case 35:
          _context.prev = 35;
          _context.t0 = _context["catch"](1);
          res.status(500).json({
            message: "Server error",
            error: _context.t0
          });

        case 38:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 35]]);
} // Update Cart


function updateCartItemQuantity(req, res) {
  var _req$body2, userId, foodItemId, quantity, cart, itemIndex, updatedCart;

  return regeneratorRuntime.async(function updateCartItemQuantity$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body2 = req.body, userId = _req$body2.userId, foodItemId = _req$body2.foodItemId, quantity = _req$body2.quantity;
          _context2.prev = 1;
          _context2.next = 4;
          return regeneratorRuntime.awrap(Cart.findOne({
            user: userId
          }));

        case 4:
          cart = _context2.sent;

          if (cart) {
            _context2.next = 7;
            break;
          }

          return _context2.abrupt("return", res.status(404).json({
            message: "Cart not found"
          }));

        case 7:
          itemIndex = cart.items.findIndex(function (item) {
            return item.foodItem.toString() === foodItemId;
          });

          if (!(itemIndex === -1)) {
            _context2.next = 10;
            break;
          }

          return _context2.abrupt("return", res.status(404).json({
            message: "Food item not found in cart"
          }));

        case 10:
          cart.items[itemIndex].quantity = quantity;
          _context2.next = 13;
          return regeneratorRuntime.awrap(cart.save());

        case 13:
          _context2.next = 15;
          return regeneratorRuntime.awrap(Cart.findOne({
            user: userId
          }).populate({
            path: "items.foodItem",
            select: "name price images"
          }).populate({
            path: "restaurant",
            select: "name"
          }));

        case 15:
          updatedCart = _context2.sent;
          res.status(200).json({
            message: "Cart item quantity updated",
            cart: updatedCart
          });
          _context2.next = 22;
          break;

        case 19:
          _context2.prev = 19;
          _context2.t0 = _context2["catch"](1);
          res.status(500).json({
            message: "Server error",
            error: _context2.t0
          });

        case 22:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[1, 19]]);
} //Delete cart


function deleteCartItem(req, res) {
  var _req$body3, userId, foodItemId, cart, itemIndex, updatedCart;

  return regeneratorRuntime.async(function deleteCartItem$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _req$body3 = req.body, userId = _req$body3.userId, foodItemId = _req$body3.foodItemId;
          _context3.prev = 1;
          _context3.next = 4;
          return regeneratorRuntime.awrap(Cart.findOne({
            user: userId
          }));

        case 4:
          cart = _context3.sent;

          if (cart) {
            _context3.next = 7;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            message: "Cart not found"
          }));

        case 7:
          itemIndex = cart.items.findIndex(function (item) {
            return item.foodItem.toString() === foodItemId;
          });

          if (!(itemIndex === -1)) {
            _context3.next = 10;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            message: "Food item not found in cart"
          }));

        case 10:
          cart.items.splice(itemIndex, 1);

          if (!(cart.items.length === 0)) {
            _context3.next = 17;
            break;
          }

          _context3.next = 14;
          return regeneratorRuntime.awrap(Cart.deleteOne({
            _id: cart._id
          }));

        case 14:
          return _context3.abrupt("return", res.status(200).json({
            message: "Cart deleted"
          }));

        case 17:
          _context3.next = 19;
          return regeneratorRuntime.awrap(cart.save());

        case 19:
          _context3.next = 21;
          return regeneratorRuntime.awrap(Cart.findOne({
            user: userId
          }).populate({
            path: "items.foodItem",
            select: "name price images"
          }).populate({
            path: "restaurant",
            select: "name"
          }));

        case 21:
          updatedCart = _context3.sent;
          res.status(200).json({
            message: "Cart item deleted",
            cart: updatedCart
          });

        case 23:
          _context3.next = 28;
          break;

        case 25:
          _context3.prev = 25;
          _context3.t0 = _context3["catch"](1);
          res.status(500).json({
            message: "Server error",
            error: _context3.t0
          });

        case 28:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[1, 25]]);
} //Fetch cart Item


function getCartItem(req, res) {
  var userId, cart;
  return regeneratorRuntime.async(function getCartItem$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          userId = req.user._id;
          _context4.prev = 1;
          _context4.next = 4;
          return regeneratorRuntime.awrap(Cart.findOne({
            user: userId
          }).populate({
            path: "items.foodItem",
            select: "name price images"
          }).populate({
            path: "restaurant",
            select: "name"
          }));

        case 4:
          cart = _context4.sent;

          if (cart) {
            _context4.next = 9;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            message: "No cart found"
          }));

        case 9:
          return _context4.abrupt("return", res.status(200).json({
            status: "success",
            data: cart
          }));

        case 10:
          _context4.next = 15;
          break;

        case 12:
          _context4.prev = 12;
          _context4.t0 = _context4["catch"](1);
          res.status(500).json({
            message: "Server error",
            error: _context4.t0
          });

        case 15:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[1, 12]]);
}

module.exports = {
  addItemToCart: addItemToCart,
  updateCartItemQuantity: updateCartItemQuantity,
  deleteCartItem: deleteCartItem,
  getCartItem: getCartItem
};