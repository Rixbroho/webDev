import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const addUser = async (req, res) => {
  try {
    const prisma = req.app.locals.prisma;
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const isUser = await prisma.user.findUnique({ where: { username } });
    const isemail = await prisma.user.findUnique({ where: { email } });
    if (isUser || isemail) {
      return res.json({ success: false, message: "User already exists" });
    }

    const hassed = await bcrypt.hash(password, 10);
    console.log(hassed);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hassed,
      },
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
    const prisma = req.app.locals.prisma;
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
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
    const prisma = req.app.locals.prisma;
    const id = parseInt(req.params.id);
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
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
    const prisma = req.app.locals.prisma;
    const { id } = req.params;
    const { username, email, password } = req.body;
    const userId = parseInt(id);
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (username) {
      const isexistinguser = await prisma.user.findUnique({
        where: { username },
      });
      if (isexistinguser && isexistinguser.id !== user.id) {
        return res
          .status(400)
          .json({ success: false, message: "User with that username exists" });
      }
    }

    let hashedPassword = user.password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        username: username || user.username,
        email: email || user.email,
        password: hashedPassword,
      },
      select: { id: true, username: true, email: true },
    });
    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error updating user", error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const prisma = req.app.locals.prisma;
    const id = parseInt(req.params.id);
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    await prisma.user.delete({ where: { id } });

    return res.status(200).json({
      success: true,
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
    const prisma = req.app.locals.prisma;
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
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
  const id = req.user.id;
  try {
    const user = await User.findByPk(id);
    return res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        // role: user.role
      },
      message: "User fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching users",
      error: error.message,
    });
  }
};

export {
  getAllUser,
  addUser,
  getUsersById,
  getActiveUsers,
  updateUser,
  deleteUser,
  logInUser,
  getMe,
};
