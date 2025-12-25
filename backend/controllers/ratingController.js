import Rating from '../models/Rating.js';
import Job from '../models/Job.js';
import User from '../models/User.js';

export const createRating = async (req, res) => {
  try {
    const { toUserId, jobId, rating, comment, ratingType } = req.body;
    const fromUserId = req.user.id;

    if (fromUserId === toUserId) {
      return res.status(400).json({ error: 'Cannot rate yourself' });
    }

    const existingRating = await Rating.findOne({ fromUserId, toUserId, jobId });
    if (existingRating) {
      return res.status(400).json({ error: 'You have already rated this user for this job' });
    }

    const newRating = new Rating({
      fromUserId,
      toUserId,
      jobId,
      rating,
      comment,
      ratingType: ratingType || 'overall'
    });

    await newRating.save();

    // Update user average rating
    const allRatings = await Rating.find({ toUserId });
    const avgRating = allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length;

    await User.findByIdAndUpdate(toUserId, {
      averageRating: avgRating,
      totalReviews: allRatings.length
    });

    res.status(201).json({
      message: 'Rating submitted successfully',
      rating: newRating
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getRatings = async (req, res) => {
  try {
    const { userId, type } = req.query; // type: 'given' or 'received'

    let ratings;

    if (type === 'given') {
      ratings = await Rating.find({ fromUserId: userId })
        .populate('toUserId', 'displayName photoURL')
        .populate('jobId', 'title')
        .sort({ createdAt: -1 });
    } else {
      ratings = await Rating.find({ toUserId: userId })
        .populate('fromUserId', 'displayName photoURL')
        .populate('jobId', 'title')
        .sort({ createdAt: -1 });
    }

    res.json(ratings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserRatings = async (req, res) => {
  try {
    const { userId } = req.params;

    const ratings = await Rating.find({ toUserId: userId })
      .populate('fromUserId', 'displayName photoURL')
      .sort({ createdAt: -1 });

    const avgRating = ratings.length > 0
      ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
      : 0;

    const distribution = {
      5: ratings.filter(r => r.rating === 5).length,
      4: ratings.filter(r => r.rating === 4).length,
      3: ratings.filter(r => r.rating === 3).length,
      2: ratings.filter(r => r.rating === 2).length,
      1: ratings.filter(r => r.rating === 1).length
    };

    res.json({
      userId,
      averageRating: avgRating,
      totalReviews: ratings.length,
      distribution,
      ratings
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteRating = async (req, res) => {
  try {
    const { ratingId } = req.params;
    const userId = req.user.id;

    const rating = await Rating.findById(ratingId);
    if (!rating) {
      return res.status(404).json({ error: 'Rating not found' });
    }

    if (rating.fromUserId.toString() !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await Rating.findByIdAndDelete(ratingId);

    res.json({ message: 'Rating deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
