import Order from "../models/Order.js";

export const createOrder = async (req, res) => {
  try {
    const { items, totalPrice, deliveryAddress, phone } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "Order items are required",
      });
    }

    if (!deliveryAddress || !phone || !totalPrice) {
      return res.status(400).json({
        message: "Delivery address, phone and total price are required",
      });
    }

    const formattedItems = items.map((item) => ({
      product: item.product,
      title: item.title,
      price: item.price,
      quantity: item.quantity,
    }));

    const order = await Order.create({
      user: req.user.userId,
      items: formattedItems,
      totalPrice,
      deliveryAddress,
      phone,
    });

    return res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error while creating order",
    });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId })
      .sort({ createdAt: -1 })
      .populate("user", "name email");

    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({
      message: "Server error while fetching your orders",
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("user", "name email");

    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({
      message: "Server error while fetching all orders",
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = ["new", "processing", "delivered", "cancelled"];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    order.status = status;

    const updatedOrder = await order.save();

    return res.status(200).json({
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error while updating order status",
    });
  }
};
