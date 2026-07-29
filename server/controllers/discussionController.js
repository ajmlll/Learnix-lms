import Discussion from '../models/Discussion.js';

// @desc    Create a Q&A discussion thread
// @route   POST /api/discussions/course/:courseId
// @access  Private
export const createDiscussion = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { title, content, lectureId } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title and content for discussion thread.',
      });
    }

    const discussion = await Discussion.create({
      course: courseId,
      lectureId: lectureId || undefined,
      user: req.user._id,
      title,
      content,
      upvotes: [],
      replies: [],
    });

    res.status(201).json({
      success: true,
      data: discussion,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get discussions for a course (Public & Paginated)
// @route   GET /api/discussions/course/:courseId
// @access  Public
export const getCourseDiscussions = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 10, 50);
    const skip = (page - 1) * limit;

    const total = await Discussion.countDocuments({ course: courseId });

    const discussions = await Discussion.find({ course: courseId })
      .populate('user', 'name avatar role')
      .populate('replies.user', 'name avatar role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.status(200).json({
      success: true,
      count: discussions.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: discussions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a reply to a discussion thread
// @route   POST /api/discussions/:id/replies
// @access  Private
export const addReply = async (req, res, next) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Please provide reply content.',
      });
    }

    const discussion = await Discussion.findById(req.params.id);
    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion thread not found.',
      });
    }

    discussion.replies.push({
      user: req.user._id,
      content,
      upvotes: [],
    });

    await discussion.save();

    res.status(201).json({
      success: true,
      data: discussion.replies,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle upvote on discussion thread
// @route   PUT /api/discussions/:id/upvote
// @access  Private
export const toggleUpvote = async (req, res, next) => {
  try {
    const discussion = await Discussion.findById(req.params.id);
    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion thread not found.',
      });
    }

    const index = discussion.upvotes.indexOf(req.user._id);

    if (index > -1) {
      discussion.upvotes.splice(index, 1);
    } else {
      discussion.upvotes.push(req.user._id);
    }

    await discussion.save();

    res.status(200).json({
      success: true,
      upvoteCount: discussion.upvotes.length,
      data: discussion,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete discussion thread
// @route   DELETE /api/discussions/:id
// @access  Private (Owner/Admin)
export const deleteDiscussion = async (req, res, next) => {
  try {
    const discussion = await Discussion.findById(req.params.id);
    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion thread not found.',
      });
    }

    if (discussion.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this discussion.',
      });
    }

    await discussion.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Discussion thread deleted.',
    });
  } catch (error) {
    next(error);
  }
};
