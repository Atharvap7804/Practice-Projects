const ContactMessage = require('../models/ContactMessage');

exports.sendMessage = async (req, res) => {
  const { name, email, message } = req.body;
  const msg = new ContactMessage({ name, email, message });
  await msg.save();
  res.json({ success: true });
};

exports.contactForm = async (req, res) => {
  console.log(req.body); // <--- this logs incoming form data
};

