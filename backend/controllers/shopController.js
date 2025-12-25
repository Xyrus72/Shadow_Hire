import Gadget from '../models/Gadget.js';
import Order from '../models/Order.js';

export const getAllGadgets = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, search } = req.query;
    const filter = { isActive: true };

    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.discountedPrice = {};
      if (minPrice) filter.discountedPrice.$gte = parseFloat(minPrice);
      if (maxPrice) filter.discountedPrice.$lte = parseFloat(maxPrice);
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const gadgets = await Gadget.find(filter).sort({ createdAt: -1 });

    res.json(gadgets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getGadgetById = async (req, res) => {
  try {
    const { gadgetId } = req.params;

    const gadget = await Gadget.findById(gadgetId);
    if (!gadget) {
      return res.status(404).json({ error: 'Gadget not found' });
    }

    res.json(gadget);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createOrder = async (req, res) => {
  try {
    const { gadgetId, quantity, paymentMethod, shippingAddress } = req.body;
    const userId = req.user.id;

    const gadget = await Gadget.findById(gadgetId);
    if (!gadget) {
      return res.status(404).json({ error: 'Gadget not found' });
    }

    if (gadget.stock < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    const totalPrice = gadget.discountedPrice * quantity;

    const order = new Order({
      userId,
      gadgetId,
      quantity,
      pricePerUnit: gadget.discountedPrice,
      totalPrice,
      paymentMethod,
      shippingAddress,
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days
    });

    await order.save();

    // Decrease stock
    gadget.stock -= quantity;
    await gadget.save();

    res.status(201).json({
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const { status, userId } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (userId) filter.userId = userId;

    const orders = await Order.find(filter)
      .populate('gadgetId', 'name discountedPrice')
      .populate('userId', 'displayName email')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate('gadgetId')
      .populate('userId');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, trackingNumber } = req.body;

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status, trackingNumber },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({
      message: 'Order updated',
      order
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.userId.toString() !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (['shipped', 'delivered'].includes(order.status)) {
      return res.status(400).json({ error: 'Cannot cancel shipped order' });
    }

    order.status = 'cancelled';
    await order.save();

    // Restore stock
    const gadget = await Gadget.findById(order.gadgetId);
    gadget.stock += order.quantity;
    await gadget.save();

    res.json({
      message: 'Order cancelled',
      order
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
