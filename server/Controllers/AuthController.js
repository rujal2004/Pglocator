const { StatusCodes } = require("http-status-codes");
const UserSchema = require("../modals/UserSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* =========================
   REGISTER USER
========================= */
const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const profileImage = req.file;

    if (!profileImage) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, msg: "No profile image uploaded" });
    }

    const existingUser = await UserSchema.findOne({ email });
    if (existingUser) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, msg: "User already exists!" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new UserSchema({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      profileImagePath: profileImage.path,
    });

    await newUser.save();

    res.status(StatusCodes.CREATED).json({
      success: true,
      msg: "User registered successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: error.message,
    });
  }
};

/* =========================
   LOGIN USER
========================= */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await UserSchema.findOne({ email });
    if (!user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, msg: "User does not exist!" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, msg: "Invalid credentials!" });
    }

    // Generate JWT Token (FIXED SPELLING)
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user._doc;

    res.status(StatusCodes.OK).json({
      success: true,
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  register,
  login,
};