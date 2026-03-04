const User = require("../models/usermodel.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { sendResetEmail } = require("../helpers/emailService");

const addUser = async (req, res) => {
  try {
    const { username, email, password, phoneNumber, location, bio } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    const isemail = await User.findOne({ where: { email } });
    if (isemail) {
      return res.json({ success: false, message: "User already exists" });
    }

    const hassed = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hassed,
      phoneNumber,
      location,
      bio,
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
};

const getAllUser = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ["password"] } });
    return res.json({
      success: true,
      users,
      message: "User fetched successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
};

const getUsersById = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findByPk(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    return res.json({
      success: true,
      user: { id: user.id, username: user.username },
      message: "User fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching user",
      error: error.message,
    });
  }
};

const getActiveUsers = async (req, res) => {
  res.json({ message: "Get active users - to be implemented" });
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, password, phoneNumber, location, bio, role } =
      req.body;

    // Permission check: only admin or the user themselves can update
    const requester = req.user;
    if (!requester) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    if (requester.role !== "admin" && parseInt(requester.id) !== parseInt(id)) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Access denied. Admin privileges required.",
        });
    }

    // Prevent non-admin users from changing roles
    if (role && requester.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Only admin can change user roles" });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (username) {
      const isexistinguser = await User.findOne({ where: { username } });
      if (isexistinguser && isexistinguser.id !== user.id) {
        return res
          .status(400)
          .json({ success: false, message: "User with that username exists" });
      }
    }

    if (email) {
      const isexistingemail = await User.findOne({ where: { email } });
      if (isexistingemail && isexistingemail.id !== user.id) {
        return res
          .status(400)
          .json({ success: false, message: "User with that email exists" });
      }
    }

    let hassedPassword = user.password;
    if (password) {
      hassedPassword = await bcrypt.hash(password, 10);
    }
    await user.update({
      username: username || user.username,
      email: email || user.email,
      password: hassedPassword,
      phoneNumber: phoneNumber || user.phoneNumber,
      location: typeof location !== "undefined" ? location : user.location,
      bio: typeof bio !== "undefined" ? bio : user.bio,
      ...(role ? { role } : {}),
    });
    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: {
        id: user.id,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error updating user", error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findByPk(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    await user.destroy();

    return res.status(200).json({
      success: true,
      // user:{id:user.id,username:user.username},
      message: "User deleted",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error",
      error: error.message,
    });
  }
};

const logInUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isvalidUser = await bcrypt.compare(password, user.password);

    if (!isvalidUser) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        username: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error logging in",
      error: error.message,
    });
  }
};

const getMe = async (req, res) => {
  try {
    const id = req.user?.id;
    if (!id)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const user = await User.findByPk(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
        location: user.location,
        bio: user.bio,
      },
      message: "User fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching user",
      error: error.message,
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Generate a 6-digit OTP and store its hash
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
    const expires = Date.now() + 60 * 60 * 1000; // 1 hour

    await user.update({
      resetPasswordToken: hashedOtp,
      resetPasswordExpires: new Date(expires),
    });

    // Send OTP via email
    try {
      await sendResetEmail(user.email, otp, user.username);
    } catch (err) {
      console.error(
        "Failed to send reset OTP email:",
        err && err.message ? err.message : err,
      );
      return res
        .status(500)
        .json({
          success: false,
          message: "Failed to send OTP email",
          error: err && err.message ? err.message : String(err),
        });
    }

    return res
      .status(200)
      .json({ success: true, message: "OTP sent to email" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error sending reset OTP", error: error.message });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res
        .status(400)
        .json({ success: false, message: "Email and OTP are required" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
    if (!user.resetPasswordToken || user.resetPasswordToken !== hashedOtp) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP" });
    }

    if (
      user.resetPasswordExpires &&
      new Date(user.resetPasswordExpires) < new Date()
    ) {
      return res
        .status(400)
        .json({ success: false, message: "OTP has expired" });
    }

    return res.json({ success: true, message: "OTP verified" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, newPassword, resetToken } = req.body;

    if (!email || !resetToken || !newPassword) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Verify token
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    if (!user.resetPasswordToken || user.resetPasswordToken !== hashedToken) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });
    }

    if (
      user.resetPasswordExpires &&
      new Date(user.resetPasswordExpires) < new Date()
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Token has expired" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error resetting password",
      error: error.message,
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { currentPassword, newPassword } = req.body;

    if (!userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!currentPassword || !newPassword)
      return res
        .status(400)
        .json({
          success: false,
          message: "Current and new passwords are required",
        });
    if (newPassword.length < 8)
      return res
        .status(400)
        .json({
          success: false,
          message: "New password must be at least 8 characters",
        });

    const user = await User.findByPk(userId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid)
      return res
        .status(400)
        .json({ success: false, message: "Current password is incorrect" });

    const hashed = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashed });

    return res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllUser,
  addUser,
  getUsersById,
  getActiveUsers,
  updateUser,
  deleteUser,
  logInUser,
  getMe,
  forgotPassword,
  resetPassword,
  verifyOtp,
  changePassword,
};
