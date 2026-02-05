const Plan = require('../models/Plan');
const Booking = require('../models/Booking');

// Get all plans
exports.getAllPlans = async (req, res) => {
  try {
    const plans = await Plan.find();
    res.status(200).json({
      success: true,
      message: 'Plans fetched successfully',
      data: plans,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get single plan by ID
exports.getPlanById = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Plan not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Plan fetched successfully',
      data: plan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create new plan
exports.createPlan = async (req, res) => {
  try {
    const { title, oldPrice, newPrice, note, features } = req.body;

    // Validation
    if (!title || !oldPrice || !newPrice) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (title, oldPrice, newPrice)',
      });
    }

    const plan = await Plan.create({
      title,
      oldPrice,
      newPrice,
      note,
      features: features || [],
    });

    res.status(201).json({
      success: true,
      message: 'Plan created successfully',
      data: plan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update plan
exports.updatePlan = async (req, res) => {
  try {
    const { title, oldPrice, newPrice, note, features, isActive } = req.body;

    const plan = await Plan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Plan not found',
      });
    }

    // Update fields if provided
    if (title) plan.title = title;
    if (oldPrice !== undefined) plan.oldPrice = oldPrice;
    if (newPrice !== undefined) plan.newPrice = newPrice;
    if (note) plan.note = note;
    if (features) plan.features = features;
    if (isActive !== undefined) plan.isActive = isActive;

    await plan.save();

    res.status(200).json({
      success: true,
      message: 'Plan updated successfully',
      data: plan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete plan
exports.deletePlan = async (req, res) => {
  try {
    const plan = await Plan.findByIdAndDelete(req.params.id);
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Plan not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Plan deleted successfully',
      data: plan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Book a plan (create booking)
exports.bookPlan = async (req, res) => {
  try {
    const { name, email, phone, message, planName } = req.body;

    // Basic validation
    if (!name || !email || !phone || !planName) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, phone and planName'
      });
    }

    const booking = await Booking.create({
      name,
      email,
      phone,
      message: message || '',
      planName
    });

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: 'Bookings fetched successfully',
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.status(200).json({ success: true, message: 'Booking fetched successfully', data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update booking
exports.updateBooking = async (req, res) => {
  try {
    const { name, email, phone, message, planName } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (name) booking.name = name;
    if (email) booking.email = email;
    if (phone) booking.phone = phone;
    if (message !== undefined) booking.message = message;
    if (planName) booking.planName = planName;

    await booking.save();

    res.status(200).json({ success: true, message: 'Booking updated successfully', data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete booking
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.status(200).json({ success: true, message: 'Booking deleted successfully', data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
