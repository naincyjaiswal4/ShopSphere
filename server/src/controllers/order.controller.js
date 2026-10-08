import mongoose from 'mongoose';
import Order from '../models/Order.js';

// @desc    Create a new order in MongoDB
// @route   POST /api/orders
// @access  Public (or Protected)
export const createOrder = async (req, res, next) => {
  try {
    const {
      orderId,
      user,
      userId,
      userEmail,
      userName,
      items,
      shippingAddress,
      paymentMethod,
      subtotal,
      shippingFee,
      tax,
      totalAmount,
      estimatedDelivery,
      status
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No order items provided'
      });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.street) {
      return res.status(400).json({
        success: false,
        message: 'Complete shipping address is required'
      });
    }

    // Auto-generate order ID if not provided
    const finalOrderId = orderId || `ORD-${Date.now().toString().slice(-6)}`;

    // Validate User ObjectId if passed
    const rawUserId = user || userId;
    const finalUserId = mongoose.Types.ObjectId.isValid(rawUserId) ? rawUserId : null;
    const finalEmail = (userEmail || shippingAddress.email || '').trim().toLowerCase();
    const finalName = userName || shippingAddress.fullName || 'Valued Customer';

    const newOrder = await Order.create({
      orderId: finalOrderId,
      user: finalUserId,
      userEmail: finalEmail,
      userName: finalName,
      items,
      shippingAddress,
      paymentMethod: paymentMethod || 'UPI / QR Code',
      subtotal: Number(subtotal) || 0,
      shippingFee: Number(shippingFee) || 0,
      tax: Number(tax) || 0,
      totalAmount: Number(totalAmount) || 0,
      status: status || 'Processing',
      estimatedDelivery:
        estimatedDelivery ||
        new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })
    });

    res.status(201).json({
      success: true,
      message: 'Order created and saved to MongoDB successfully',
      data: newOrder
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get orders from MongoDB (filtered by user or all for admin)
// @route   GET /api/orders
// @access  Public
export const getOrders = async (req, res, next) => {
  try {
    const { userEmail, userId, role } = req.query;

    let filter = {};

    // If role is admin, admin can view all orders unless specific userEmail is requested
    if (role === 'admin') {
      if (userEmail) filter.userEmail = userEmail.trim().toLowerCase();
      else if (userId && mongoose.Types.ObjectId.isValid(userId)) filter.user = userId;
    } else if (userEmail) {
      filter.userEmail = userEmail.trim().toLowerCase();
    } else if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      filter.user = userId;
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order by orderId or _id
// @route   GET /api/orders/:id
// @access  Public
export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    let order = null;
    if (id.startsWith('ORD-')) {
      order = await Order.findOne({ orderId: id });
    } else {
      order = await Order.findById(id);
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order ${id} not found`
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status in MongoDB
// @route   PATCH /api/orders/:id/status
// @access  Public / Admin
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const validStatuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Valid values: ${validStatuses.join(', ')}`
      });
    }

    const filter = id.startsWith('ORD-') ? { orderId: id } : { _id: id };
    const order = await Order.findOneAndUpdate(
      filter,
      { status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order ${id} not found`
      });
    }

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      data: order
    });
  } catch (error) {
    next(error);
  }
};
