import User, { getRoleSpecificModel } from '../models/User.js';
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {
  try {
    const { uid, email, displayName, photoURL, userType } = req.body;

    // Check if user already exists in main users collection
    const existingUser = await User.findOne({ $or: [{ uid }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create user in main "users" collection (for login/registration)
    const newUser = new User({
      uid,
      email,
      displayName,
      photoURL: photoURL || null,
      userType: userType || 'freelancer'
    });

    await newUser.save();

    // Also create user in role-specific collection
    const RoleSpecificModel = getRoleSpecificModel(userType || 'freelancer');
    const roleSpecificUser = new RoleSpecificModel({
      uid,
      email,
      displayName,
      photoURL: photoURL || null,
      userType: userType || 'freelancer'
    });

    await roleSpecificUser.save();

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, uid: newUser.uid, userType: newUser.userType },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log(`✅ User registered: ${displayName} (${userType}) in users & ${userType}_users collections`);

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

    // Find user in main "users" collection (all users login here)
    const user = await User.findOne({ $or: [{ email }, { uid }] });
    if (!user) {
      return res.status(401).json({ error: 'User not found. Please register first.' });
    }

    // Verify userType matches if provided
    if (userType && user.userType !== userType) {
      return res.status(401).json({ error: 'Invalid role selection. Please select the correct role.' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, uid: user.uid, userType: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log(`✅ User logged in: ${user.displayName} (${user.userType}) from users collection`);

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
    const { email, userType } = req.body;

    // Check in main "users" collection
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ error: 'User not registered. Please register first.' });
    }

    res.json({
      _id: user._id,
      email: user.email,
      displayName: user.displayName,
      userType: user.userType,
      photoURL: user.photoURL,
      exists: true,
      collection: 'users'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUser = async (req, res) => {
  try {
    // Get from main users collection
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
    const { userType } = req.user;
    const updates = req.body;

    // Update in main users collection
    const user = await User.findByIdAndUpdate(id, updates, { new: true });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Also update in role-specific collection
    const RoleSpecificModel = getRoleSpecificModel(userType);
    await RoleSpecificModel.findByIdAndUpdate(id, updates, { new: true });

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
    const { userType } = req.user;
    const { skills } = req.body;

    // Update in main users collection
    const user = await User.findByIdAndUpdate(
      id,
      { skills },
      { new: true }
    );

    // Also update in role-specific collection
    const RoleSpecificModel = getRoleSpecificModel(userType);
    await RoleSpecificModel.findByIdAndUpdate(id, { skills }, { new: true });

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
    const { userType } = req.user;
    const { paymentMethod, paymentDetails } = req.body;

    const updateData = {};
    if (paymentMethod === 'bank') {
      updateData.bankDetails = paymentDetails;
    } else if (paymentMethod === 'upi') {
      updateData.upiId = paymentDetails.upiId;
    } else if (paymentMethod === 'crypto') {
      updateData.cryptoWallet = paymentDetails.wallet;
    }

    // Update in main users collection
    const user = await User.findByIdAndUpdate(id, updateData, { new: true });

    // Also update in role-specific collection
    const RoleSpecificModel = getRoleSpecificModel(userType);
    await RoleSpecificModel.findByIdAndUpdate(id, updateData, { new: true });

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

    // Get from main users collection
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

export const getUserBalance = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get from main users collection
    const user = await User.findById(userId).select('availableBalance totalEarnings');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      availableBalance: user.availableBalance || 0,
      totalEarnings: user.totalEarnings || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};