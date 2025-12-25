import User from '../models/User.js';
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {
  try {
    const { uid, email, displayName, photoURL, userType } = req.body;

    const existingUser = await User.findOne({ $or: [{ uid }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const newUser = new User({
      uid,
      email,
      displayName,
      photoURL: photoURL || null,
      userType: userType || 'freelancer'
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, uid: newUser.uid },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: newUser,
      token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, uid, userType } = req.body;

    // Find user by email or uid
    const user = await User.findOne({ $or: [{ email }, { uid }] });
    if (!user) {
      return res.status(401).json({ error: 'User not found. Please register first.' });
    }

    // Verify userType matches if provided
    if (userType && user.userType !== userType) {
      return res.status(401).json({ error: 'Invalid role selection. Please select the correct role.' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, uid: user.uid },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      user,
      token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const checkRegistration = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not registered. Please register first.' });
    }

    // Return user data with role info
    res.json({
      _id: user._id,
      email: user.email,
      displayName: user.displayName,
      userType: user.userType,
      photoURL: user.photoURL,
      exists: true
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.user;
    const updates = req.body;

    const user = await User.findByIdAndUpdate(id, updates, { new: true });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'User updated successfully',
      user
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateSkills = async (req, res) => {
  try {
    const { id } = req.user;
    const { skills } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { skills },
      { new: true }
    );

    res.json({
      message: 'Skills updated successfully',
      user
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updatePaymentMethod = async (req, res) => {
  try {
    const { id } = req.user;
    const { paymentMethod, paymentDetails } = req.body;

    const updateData = {};
    if (paymentMethod === 'bank') {
      updateData.bankDetails = paymentDetails;
    } else if (paymentMethod === 'upi') {
      updateData.upiId = paymentDetails.upiId;
    } else if (paymentMethod === 'crypto') {
      updateData.cryptoWallet = paymentDetails.wallet;
    }

    const user = await User.findByIdAndUpdate(id, updateData, { new: true });

    res.json({
      message: 'Payment method updated successfully',
      user
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPublicProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select(
      'displayName photoURL bio skills averageRating totalReviews projectsCompleted'
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
