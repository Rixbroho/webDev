const Setting = require('../models/settingModel');

// Return all settings as an object { key: value }
exports.getSettings = async (req, res) => {
  try {
    const settings = await Setting.findAll({ raw: true });
    const obj = {};
    settings.forEach(s => (obj[s.key] = s.value));

    // Provide sensible defaults if not set
    const defaults = {
      adminName: 'Admin',
      adminEmail: 'admin@venue-portal.com',
      adminAddress: '',
      siteName: 'Venue Manager',
      currency: 'INR (₹)',
      bookingAutoApprove: 'false',
      emailAlerts: 'true',
      twoFactor: 'true'
    };

    const merged = { ...defaults, ...obj };
    res.json({ success: true, settings: merged });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update multiple settings. Expects a JSON object with keys and primitive values.
exports.updateSettings = async (req, res) => {
  try {
    const updates = req.body;
    if (!updates || typeof updates !== 'object') {
      return res.status(400).json({ success: false, message: 'Invalid request body' });
    }

    const promises = Object.keys(updates).map(async (key) => {
      const value = String(updates[key]);
      const exist = await Setting.findOne({ where: { key } });
      if (exist) {
        exist.value = value;
        return exist.save();
      }
      return Setting.create({ key, value });
    });

    await Promise.all(promises);
    res.json({ success: true, message: 'Settings updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};