const router = require("express").Router();
const authenticateToken = require("./userAuth");
const User = require("../models/user");
const Order = require("../models/orders");

// Place order
router.post("/place-order", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId; 
    const { books } = req.body;

    console.log("User ID:", userId);
    console.log("Books Data:", books);

    if (!books || !Array.isArray(books) || books.length === 0) {
      return res
        .status(400)
        .json({
          status: "Error",
          message: "Order must contain at least one book",
        });
    }

    
    const newOrder = new Order({ user: userId, books });

    
    const orderDataFromDb = await newOrder.save();

   
    await User.findByIdAndUpdate(userId, {
      $push: { orders: orderDataFromDb._id },
    });

   
    await User.findByIdAndUpdate(userId, { $pullAll: { cart: books } });

    return res
      .status(200)
      .json({
        status: "Success",
        message: "Order Placed Successfully",
        order: orderDataFromDb,
      });
  } catch (error) {
    console.error("Error placing order:", error);
    return res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
});
// Get order history of user
router.get("/get-order-history", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log("Fetching order history for user:", userId);

    const userData = await User.findById(userId).populate({
      path: "orders",
      populate: { path: "books" }, 
    });

    if (!userData) {
      return res
        .status(404)
        .json({ status: "Error", message: "User not found" });
    }

   
    const validOrders = userData.orders.filter(
      (order) => order.books && order.books.length > 0
    );

    return res.status(200).json({
      status: "Success",
      data: validOrders.reverse(),
    });
  } catch (error) {
    console.error("Error fetching order history:", error);
    return res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
});

// get all orders -- admin
router.get("/get-all-orders", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ status: "Error", message: "Access denied. Admins only." });
    }

    console.log("Fetching all orders...");

    const ordersData = await Order.find()
      .populate({ path: "books", model: "books", strictPopulate: false }) 
      .populate({ path: "user", model: "User", strictPopulate: false })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      status: "Success",
      data: ordersData,
    });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    return res.status(500).json({
      message: "An error occurred",
      error: error.message,
      stack: error.stack,
    });
  }
});

// Update order -- admin
router.put("/update-status/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

   
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ status: "Error", message: "Access denied. Admins only." });
    }

   
    const validStatuses = [
      "Pending",
      "Ordered placed",
      "Out for delivery",
      "Delivered",
      "Cancelled",
    ];
    if (!validStatuses.includes(req.body.status)) {
      return res
        .status(400)
        .json({ status: "Error", message: "Invalid status value" });
    }

  
    const existingOrder = await Order.findById(id);
    if (!existingOrder) {
      return res
        .status(404)
        .json({ status: "Error", message: "Order not found" });
    }

   
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status: req.body.status },
      { new: true }
    );

    return res.status(200).json({
      status: "Success",
      message: "Status Updated Successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    return res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
});

module.exports = router;
